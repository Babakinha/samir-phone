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
            Users.removeUser(socket.id)
            console.log(`User Disconnected ${socket.id}`);
        })
    })
}

export default socket