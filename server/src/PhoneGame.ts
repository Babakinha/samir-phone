import { Socket, Server } from 'socket.io';
import { getRoom, Room, User } from './rooms';
import socket from './socket';
export type PhoneGameData = {
    PlayerRounds: Array<{
        userId: string,
        rounds: Array<{
                userId: string,
                action: "Text" | "Drawing",
                done: boolean,
                data?: string
        }>
            
    }>
}

export type PhoneGameOptions = {
    startWith: "Text" | "Drawing",
    ownerParticipates: boolean,
    time: number
}

export class PhoneGame {
    
    gameData: PhoneGameData;
    room: Room;
    roundIndex: number = 0;
    roundLength: number;

    sockets: Socket[] = [];
    io: Server

    options: PhoneGameOptions = {
        startWith: "Text",
        ownerParticipates: true,
        time: 60
    }
    
    active: boolean = true;
    
    constructor(room: Room, io: Server, options?: PhoneGameOptions) {
        if(options) this.options = {...this.options, ...options}
        this.io = io;
        this.roundLength = room.users.length;
        this.room = room;
        this.gameData = this.createRounds(room.users);
        const sockets = io.sockets.adapter.rooms.get(room.code);
        sockets?.forEach(socketId => {
            this.sockets.push(io.sockets.sockets.get(socketId)!)
            this.assignSocketCallbacks(io.sockets.sockets.get(socketId)!);
        });
        this.startNextRound(this.roundIndex)
    }

    private createRounds(playerList: User[]) {
        let gameData: PhoneGameData = { PlayerRounds: [] };
        
        //Create Round for every player
        playerList.forEach((player) => {
            console.dir(player, {depth: null, color: true})
            console.log(player.id)
            gameData.PlayerRounds.push({
                userId: player.id,
                rounds: []
            });
        });
        
        //Create Rounds for every PlayerRound
        gameData.PlayerRounds.forEach((playerRound) => {
            //Start with Text
            let isText = this.options.startWith == "Text";
            playerRound!.rounds.push({
                userId: playerRound!.userId,
                action: (isText? "Text" : "Drawing"),
                done: false
            });
            isText = !isText;
            
            //Add players in a way that no one repeats(index) in other PlayerRounds
            const staringIndex = playerList.findIndex((u) => u.id == playerRound!.userId)
            
            for (let i = 0; i < playerList.length; i++) {
                const player = playerList[(i + staringIndex)%playerList.length];
                if(player.id == playerRound!.userId) continue;
                
                playerRound!.rounds.push({
                    userId: player.id,
                    action: (isText? "Text" : "Drawing"),
                    done: false
                });
                
                isText = !isText
            }
        });

        return gameData;
    }

    private assignSocketCallbacks(socket: Socket) {
        console.log('Assigning socket: ' + this.room.users.find((u) => u.id == socket.id)?.name)
        socket.on('Phone_Text', (data, callback = () => {}) => {
            if(!this.active) return this.killSocket(socket);

            console.log("PhoneText!")
            const playerRound = this.findPlayerRound(socket.id);
            if(!playerRound) return callback('Phone Game Error :(');
            if(!data) return callback('Invalid data :(');
            const round = playerRound.rounds[this.roundIndex]
            round.done = true;
            round.data = data;
            console.dir(playerRound, {depth: null, color: true});
        });
    }

    private sendRoundData(socket: Socket) {
        if(!this.active) return this.killSocket(socket);

        const playerRound = this.findPlayerRound(socket.id);
        const round = playerRound?.rounds[this.roundIndex]

        console.log("Sending")
        const data = playerRound?.rounds[this.roundIndex - 1]?.data

        socket.emit('Phone_RoundData', {action: round?.action, time: this.options.time, roundLength: this.roundLength, index: this.roundIndex, data});
    }

    private endGame() {
        console.dir(this.gameData, {depth: null, color: true});
        this.io.to(this.room.code).emit('Phone_EndGame', this.gameData)
        const owner = this.io.sockets.sockets.get(this.room.owner.id)
        
        owner?.on('Phone_EndGame', () => this.kill());

        owner?.on('Phone_EndRound', () => {
            this.io.to(this.room.code).emit('Phone_EndRound')
        })

    }

    private startNextRound(yourRoundIndex: number) {
        if(yourRoundIndex < this.roundIndex) return; //This is if we call this delayed
        if((this.roundIndex + 1) > this.roundLength ) return this.endGame();
        if(!this.active) return;

        this.sockets.forEach((socket) => {
            this.sendRoundData(socket);
        })
        
        setTimeout(() => {
            if(!this.active) return;
            if((this.roundIndex + 1) > this.roundLength ) this.endGame();

            this.roundIndex++;
            this.startNextRound(this.roundIndex);
        }, 1000 * this.options.time)
    }

    private findPlayerRound = (playerId: string) => this.gameData.PlayerRounds.find((plRound) => plRound.rounds[this.roundIndex].userId == playerId)
    private findPlayerRoundIndex = (playerId: string) => this.gameData.PlayerRounds.findIndex((plRound) => plRound.rounds[this.roundIndex].userId == playerId)

    public kill() {
        console.log("Dying")
        this.io.to(this.room.code).emit('Phone_kill');
        this.active = false;
        delete this.room.gameData; //I know this doesn't work, but why not
    }

    public killSocket(socket: Socket) {
        socket.removeAllListeners('Phone_Text')
    }
 

}