import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import Sound from 'react-sound'
import styles from './Lobby.module.css'

let socket: Socket;
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_IO_ENDPOINT!


export default function Lobby({ code, name, setPage }: {code: string, name: string, setPage: Function}) {

    const [RoomData, setRoomData] = useState<any>({mode: 0});
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isPlaying, setPlaying] = useState<boolean>(isOwner);
    const Mode = RoomData.mode;

    const changeMode = (mode: Number) => {
        setRoomData({...RoomData, ...{mode}});
        socket.emit('changeMode', mode);
    }
    
    useLayoutEffect(() => {
        //Socket.io
        socket = io(ENDPOINT)
        socket.emit('create', {code, name}, () => socket.emit('join', {code, name}))

        socket.on('roomData', data => setRoomData({...RoomData, ...data}))

        return () => {
            socket.disconnect()
            socket.off()
        }
    }, [])

    useEffect(() => {
        setIsOwner(RoomData.users?.find((u: any) => u.id == socket?.id && u.owner)? false : true);
        socket.off('roomData')
        socket.on('roomData', data => setRoomData({...RoomData, ...data}));
    }, [RoomData])


    return(
        <div className={styles.lobbyContainer}>

            <div className={styles.lobbyHead}>
                <span>Welcome {name} To room: </span>
                <span className={styles.lobbyCode}>{code}</span>

                <button className={isPlaying? styles.muteButton : styles.muteButtonMuted}  onClick={() => {setPlaying(!isPlaying)}} disabled={isOwner}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                        <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                        <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                    </svg>
                </button>
            </div>

            <div className={styles.mainContainer}>
                <button className={styles.startButton} disabled={isOwner}>Start</button>
                <ul className={styles.playerList}>
                    {//@ts-ignore
                        //creates span for each player and if owner is true create attribute
                        RoomData.users?.map((u: any) => <span key={u.id} owner={u.owner? 'EasterEgg :O' : undefined}>{u.name}</span>)
                    }
                </ul>
            </div>

            <ul className={styles.modeList}>
                <button onClick={() => changeMode(0)} className={Mode == 0? 'active' : undefined} disabled={isOwner}>Mode 0</button>
                <button onClick={() => changeMode(1)} className={Mode == 1? 'active' : undefined} disabled={isOwner}>Mode 1</button>
                <button onClick={() => changeMode(2)} className={Mode == 2? 'active' : undefined} disabled={isOwner}>Mode 2</button>
            </ul>

            <Sound url="/music.mp3" playStatus={isPlaying? 'STOPPED' : 'PLAYING'} volume={20} />
        </div>
    )
}