import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import CanvasDraw from 'react-canvas-draw'

let socket: Socket;

export default function GetRoom()  {
    const router = useRouter();
    const { code, name } = router.query

    const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_IO_ENDPOINT!
    
    const [players, setPlayers] = useState<{name: string}[]>([]);

    const [drawCanvas, setDrawCanvas] = useState<CanvasDraw>();
    const [peopleCanvas, setPeopleCanvas] = useState<CanvasDraw>();

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('join', {name, room: code}, console.log)

        socket.on('join', player => setPlayers(oldArray => [...oldArray, player]))
        socket.on('leave', player => setPlayers(oldArray => oldArray.filter((user) => user.name != player.name)))


        socket.on('canvas', (canvas) => peopleCanvas!.loadSaveData(canvas))

        return () => {
            socket.disconnect()
            socket.off()
        }
    }, [code, name, ENDPOINT, peopleCanvas])

    useEffect(() => {
        console.log(players)
    }, [players])

    const sendCanvas = () => {
        const data = drawCanvas!.getSaveData();
        socket.emit('canvas', data, console.log)
        peopleCanvas!.loadSaveData(data)
    }
    

    return (
        <div>
            <ul style={{position: 'absolute', flexDirection: 'column'}}>
                {players.map(player => <li key={players.indexOf(player)}>{player.name}</li>)}
            </ul>
            <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                <CanvasDraw ref={canvasDraw => {setDrawCanvas(canvasDraw!)}} style={{border: '2px solid'}} hideGrid />
                <CanvasDraw ref={canvasDraw => {setPeopleCanvas(canvasDraw!)}} style={{border: '2px solid'}} hideGrid disabled />
            </div>
            <div style={{display: 'flex', alignContent: 'center', justifyContent: 'center'}}>
                <button onClick={() => drawCanvas!.clear()}>Clear</button>
                <button onClick={sendCanvas}>Send</button>
            </div>
        </div>
    )
}
