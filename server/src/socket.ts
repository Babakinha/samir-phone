import { Server, Socket } from "socket.io";
import * as Rooms from "./rooms"
import { createClass } from "./util/classUtil";

function socket({io}: { io: Server}) {
    console.log(`Sockets enabled`);

    io.on("connection", (socket: Socket) => {
        console.log(`User connected ${socket.id}`);

        socket.on('create', ({ name, code }, callback) => {
            const user = Rooms.createRoom(code, {id: socket.id, name})
            if((user as { error: string}).error) {if(callback) {return callback((user as { error: string}).error)}else return};

            socket.join(code);
            
            const players = Rooms.getRoom(code)!.users;
            socket.emit('roomData', {users: players});
        })

        socket.on('join', ({ name, code }, callback) => {
            const user = Rooms.addUser(code, {id: socket.id, name})
            if((user as { error: string}).error) {if(callback) {return callback((user as { error: string}).error)}else return};

            socket.join(code);
            const room =  Rooms.getRoom(code)!;
            const players = room.users;
            socket.emit('roomData', {users: players, mode: room.mode})
            socket.broadcast.to(code).emit('roomData', {users: players})
        })

        socket.on('start', ({mode}: {mode: Rooms.Modes}, callback = () => {}) => {
            const room = Rooms.getUserRoom(socket.id)
            if(!room) return callback('Room doesn\'t exist');
            if(room.owner.id != socket.id) return callback('YOU SHALL NOT START, YOU ARE NOT THAT POWERFUL!');
            if(!(mode in Rooms.Modes)) return callback('This mode doesn\'t exist yet')
            socket.emit('start', {mode});
            socket.broadcast.to(room.code).emit('start', {mode});

            room.inGame = true;
            room.gameData = createClass(Rooms.gameModes.get(mode), room, io);
        })

        socket.on('canvas', (canvas, callback) => {
            try {
                const room = Rooms.getUserRoom(socket.id)
                if(!room) throw 'Room doesn\'t exist';
                socket.broadcast.to(room.code).emit('canvas', canvas)
            }catch(e) {
                if(callback) callback(e)
            }
        })

        socket.on('changeMode', (mode, callback) => {
            try {
                const room = Rooms.getUserRoom(socket.id)
                if(!room) throw 'Room doesn\'t exist';
                if(room.owner.id != socket.id) throw 'User isn\'t the owner';
                if(!(mode in Rooms.Modes)) throw 'This mode doesn\'t exist yet'
                room.mode = mode
                socket.broadcast.to(room.code).emit('roomData', {mode})
            }catch(e) {
                if(callback) callback(e)
            }
        })

        socket.on('disconnect', () => {
            const room = Rooms.getUserRoom(socket.id)
            if(!room) return;

            Rooms.removeUser(room, socket.id)
            socket.broadcast.to(room.code).emit('roomData', {users: room.users})
            console.log(`User Disconnected ${socket.id}`);
        })
    })
}

export default socket