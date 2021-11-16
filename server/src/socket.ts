import { Server, Socket } from "socket.io";
import * as Rooms from "./rooms"

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
            
            const players = Rooms.getRoom(code)!.users;
            socket.emit('roomData', {users: players})
            socket.broadcast.to(code).emit('roomData', {users: players})
        })

        socket.on('canvas', (canvas, callback) => {
            try {
                const room = Rooms.getUserRoom(socket.id)
                if(!room) throw 'Room doesn\'t exist cant';
                socket.broadcast.to(room.code).emit('canvas', canvas)
            }catch(e) {
                if(callback) callback(e)
            }
        })

        socket.on('changeMode', (mode, callback) => {
            try {
                const room = Rooms.getUserRoom(socket.id)
                if(!room) throw 'Room doesn\'t exist cant';
                if(room.owner.id != socket.id) throw 'User isn\'t the owner';
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