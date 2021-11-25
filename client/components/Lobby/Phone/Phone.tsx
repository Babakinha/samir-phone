import React, { useEffect, useLayoutEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw'
import toast, { ToastOptions } from 'react-hot-toast'
import { Socket } from 'socket.io-client'
import RandomPhrase from '../../../util/RandomPhrase'
import DrawPrompt from './Prompts/DrawPrompt'
import EndList from './EndList/EndList'
import TextPrompt from './Prompts/TextPrompt'

import styles from './Phone.module.css'

export default function Phone({socket, setPage, isOwner, roomData}: {socket: Socket, setPage: Function, isOwner: boolean, roomData: any}) {

    
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
    
    const onDone = (text: string) => {
        socket.emit('Phone_Text', text, callbackToast);
    }

    const [thisPrompt, setPrompt] = useState(<TextPrompt onDone={onDone} />)

    useLayoutEffect(() => {
        socket.on('Phone_RoundData', ({action, time, data} : {action: "Text" | "Drawing", time: number, data?: string}) => {

            if(action == "Text")
                setPrompt(<TextPrompt onDone={onDone} time={time} data={data} />) 
            ;else
                setPrompt(<DrawPrompt onDone={onDone} time={time} data={data} />);
            
            callbackToast("Type: " + action + "\nTime: " + time)
        })

        socket.on('Phone_EndGame', (gameData) => {
            callbackToast('Game Ended');
            setPrompt(<EndList roomData={roomData} gameData={gameData} socket={socket}/>)
            if(isOwner)socket.emit('Phone_EndGame');
        })

    }, [])


    
    return (
        <div className={styles.iLoveEasterEggs}>
            <div className={styles.outerPrompt}>
                {thisPrompt}
            </div>
        </div>
    )
}
