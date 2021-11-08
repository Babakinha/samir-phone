import { Server, Socket } from "socket.io";
import * as Users from "./users"

function socket({io}: { io: Server}) {
    console.log(`Sockets enabled`);

    io.on("connection", (socket: Socket) => {
        console.log(`User connected ${socket.id}`);

        socket.on('join', ({ name, room }, callback) => {
            const { error, user } = Users.addUser({id: socket.id, name, room})
            if(error) {if(callback) {return callback(error)}else return};

            socket.join(user!.room);
            socket.broadcast.to(room).emit('join', { name })
            
            const players = Users.getUsersInRoom(room);
            players.forEach(player => {
                socket.emit('join', {name: player.name })
            })
        })

        socket.on('canvas', (canvas, callback) => {
            try {
                const user = Users.getUser(socket.id);
                console.log(user!.name + " Sent a canvas")
                socket.broadcast.to(user!.room).emit('canvas', canvas)
            }catch(e) {
                if(callback) callback(e)
            }
        })

        socket.on('disconnect', () => {
            const user = Users.getUser(socket.id)
            if (user?.room) socket.broadcast.to(user.room).emit('leave', { name: user.name})
            Users.removeUser(socket.id)
            console.log(`User Disconnected ${socket.id}`);
        })
    })
}

export default socket