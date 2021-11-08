import { version } from '../package.json'
import { createServer } from 'http';
import { Server } from 'socket.io';
import express from 'express';
import socket from './socket';
import config from 'config'

const port = config.get<number>("port");
const host = config.get<string>("host");
const corsOrigin = config.get<string>("corsOrigin");

const app = express()

const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: corsOrigin,
        credentials: true
    }
});

socket({io});

app.get('/', (_req, res) => res.send(`[${version}] Hewwo World!`));

httpServer.listen(port, host, () => {
    console.log(`[${version}] Server is listening at => http://${host}:${port}`)
})