import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import socket from './socket';

const port: number = parseInt(process.env.PORT!);
const host = process.env.HOST;
const corsOrigin = process.env.CORS_ORIGIN;

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: corsOrigin,
        credentials: true
    }
});

socket({io});

app.get('/', (_req, res) => res.send(`Hewwo World!`));

httpServer.listen(port, host, () => {
    console.log(`Server is listening at => http://${host}:${port}`)
})
