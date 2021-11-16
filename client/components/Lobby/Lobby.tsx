import React, { useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import styles from './Lobby.module.css'

let socket: Socket;
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_IO_ENDPOINT!


export default function Lobby({ code, name }: {code: string, name: string}) {

    const [RoomData, setRoomData] = useState<any>({mode: 0})
    const Mode = RoomData.mode
    
    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('create', {code, name}, () => socket.emit('join', {code, name}))

        socket.on('roomData', data => setRoomData({...RoomData, ...data}))

        return () => {
            socket.disconnect()
            socket.off()
        }
    }, [])

    useEffect(() => {
        socket.off('roomData')
        socket.on('roomData', data => setRoomData({...RoomData, ...data}));
    }, [RoomData])

    const isOwner = RoomData.users?.find((u: any) => u.id == socket?.id && u.owner)? false : true;
    const changeMode = (mode: Number) => {
        console.log(RoomData)
        setRoomData({...RoomData, ...{mode}});
        console.log({...RoomData, ...{mode}})
        socket.emit('changeMode', mode)
    }

    return(
        <div>
            <ul className={styles.playerList}>
                {//@ts-ignore
                    //creates span for each player and if owner is true create attribute
                    RoomData.users?.map((u: any) => <span key={u.id} owner={u.owner? 'EasterEgg :O' : undefined}>{u.name}</span>)
                }
            </ul>
            <ul className={styles.modeList}>
                <button onClick={() => changeMode(0)} className={Mode == 0? 'active' : undefined} disabled={isOwner}>Mode 0</button>
                <button onClick={() => changeMode(1)} className={Mode == 1? 'active' : undefined} disabled={isOwner}>Mode 1</button>
                <button onClick={() => changeMode(2)} className={Mode == 2? 'active' : undefined} disabled={isOwner}>Mode 2</button>
            </ul>
        </div>
    )
}