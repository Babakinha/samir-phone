import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import CanvasDraw from 'react-canvas-draw'

let socket: Socket;

export default function GetRoom()  {
    const router = useRouter();
    const { code, name } = router.query
    const ENDPOINT = process.env.SOCKET_IO_ENDPOINT!

    let drawCanvas: CanvasDraw | null;
    let peopleCanvas: CanvasDraw | null;

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('join', {name, room: code}, console.log)

        socket.on('canvas', (canvas) => peopleCanvas!.loadSaveData(canvas))

        return () => {
            socket.disconnect()
            socket.off()
        }
    }, [code, name, ENDPOINT])

    const sendCanvas = () => {
        const data = drawCanvas!.getSaveData();
        socket.emit('canvas', data, console.log)
        peopleCanvas!.loadSaveData(data)
    }
    

    return (
        <div>
            <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                <CanvasDraw ref={canvasDraw => {drawCanvas = canvasDraw}} style={{border: '2px solid'}} hideGrid />
                <CanvasDraw ref={canvasDraw => {peopleCanvas = canvasDraw}} style={{border: '2px solid'}} hideGrid disabled />
            </div>
            <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                <button onClick={() => drawCanvas!.clear()}>Clear</button>
                <button onClick={sendCanvas}>Send</button>
            </div>
        </div>
    )
}