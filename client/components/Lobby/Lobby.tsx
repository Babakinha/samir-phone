import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import Image from 'next/image'

import Sound from 'react-sound'
import styles from './Lobby.module.css'
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import Phone from './Phone/Phone'

let socket: Socket;
const ENDPOINT = process.env.NEXT_PUBLIC_SOCKET_IO_ENDPOINT!


export default function Lobby({ code, name, create = false, setPage }: {code: string, name: string, create?: boolean, setPage: Function}) {

    const [RoomData, setRoomData] = useState<any>({mode: 1});
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isPlaying, setPlaying] = useState<boolean>(true);
    const Mode = RoomData.mode;

    let isTransitioning = true;

    const defaultToast: ToastOptions = {
        position: 'bottom-right',
        style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '1rem',
        }
    }

    const callbackToast = (error: string = "Unknown Error") => toast.error(error, defaultToast)

    const changeMode = (mode: Number) => {
        setRoomData({...RoomData, ...{mode}});
        socket.emit('changeMode', mode, callbackToast);
    }

    const startGame = (mode: Number, roomData: any) => {
        isTransitioning = true;
        toast.success('Game Started: ' + mode, defaultToast)
        console.log(roomData);
        if( mode == 1)
            setPage(<Phone socket={socket} setPage={setPage} isOwner={isOwner} roomData={roomData}/>)
    }
    
    useLayoutEffect(() => {
        //Socket.io
        socket = io(ENDPOINT)
        if(create)
            socket.emit('create', {code, name}, callbackToast);
        else {
            setPlaying(false);
            socket.emit('join', {code, name}, callbackToast);
        }

        socket.on('roomData', data => setRoomData({...RoomData, ...data}))
        socket.on('start', mode => startGame(mode.mode, RoomData))

        changeMode(Mode);

        return () => {
            if(!isTransitioning){
                console.log("Killing")
                socket.disconnect()
                socket.off()
            }
        }
    }, [])

    useEffect(() => {
        setIsOwner(RoomData.users?.find((u: any) => u.id == socket?.id && u.owner)? false : true);
        socket.off('roomData')
        socket.on('roomData', data => setRoomData({...RoomData, ...data}));

        socket.off('start')
        socket.on('start', mode => startGame(mode.mode, RoomData));
    }, [RoomData])


    return(
        <div className={styles.lobbyContainer}>
            <div className={styles.lobbyHead}>
                <span>Welcome {name} To room: </span>
                <span className={styles.lobbyCode} onClick={() => {
                    if('clipboard' in navigator)
                        navigator.clipboard.writeText(window.location.origin + '/invite?code=' + code)
                    else
                        document.execCommand('copy', true, window.location.origin + '/invite?code=' + code);
                    toast.success("Invite copied to clipboard", defaultToast)
                }}>{code}</span>

                <button className={styles.muteButton + (isPlaying? '' : ' muted')}  onClick={() => {setPlaying(!isPlaying)}}>
                    {isPlaying ?
                        <Image src="/svg/sound.svg" height={64} width={64} alt='Sound'/>:
                        <Image src="/svg/muted.svg" height={64} width={64} alt='Muted'/>
                    }
                </button>
            </div>

            <div className={styles.mainContainer}>
                <button className={styles.startButton} onClick={() => socket.emit('start', {mode: Mode, options: {time: 30}}, callbackToast)} disabled={isOwner}>Start</button>
                <ul className={styles.playerList}>
                    {//@ts-ignore
                        //creates span for each player and if owner is true create attribute
                        RoomData.users?.map((u: any) => <span key={u.id} owner={u.owner? 'EasterEgg :O' : undefined}>{u.name}</span>)
                    }
                </ul>
            </div>

            <ul className={styles.modeList}>
                <button onClick={() => changeMode(0)} className={Mode == 0? 'active' : undefined} disabled>Pictionary</button>
                <button onClick={() => changeMode(1)} className={Mode == 1? 'active' : undefined} disabled={isOwner}>Phone</button>
                <button onClick={() => changeMode(2)} className={Mode == 2? 'active' : undefined} disabled>???</button>
            </ul>

            <Sound url="/music.mp3" playStatus={isPlaying? 'PLAYING' : 'STOPPED'} volume={20} loop/>
        </div>
    )
}