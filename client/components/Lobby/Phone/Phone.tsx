import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
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
        socket.emit('Phone_Text', text);
    }

    const [thisPrompt, setPrompt] = useState(<TextPrompt onDone={onDone} />)
    const [timer, setTimer] = useState(0)

    React.useEffect(() => {
        const count =
            timer > 0 && setInterval(() => setTimer(timer - 1), 1000);
        return () => clearInterval((count as NodeJS.Timer));
      }, [timer]);

    useLayoutEffect(() => {
        socket.on('Phone_RoundData', ({action, time, data} : {action: "Text" | "Drawing", time: number, data?: string}) => {

            if(action == "Text")
                setPrompt(<TextPrompt onDone={onDone} time={time} data={data} />) 
            ;else
                setPrompt(<DrawPrompt onDone={onDone} time={time} data={data} />);

            setTimer(time)


        })

        socket.on('Phone_EndGame', (gameData) => {
            setPrompt(<EndList roomData={roomData} gameData={gameData} socket={socket}/>)
            if(isOwner)socket.emit('Phone_EndGame');
        })

    }, [])


    
    return (
        <div className={styles.iLoveEasterEggs}>
            <div className={styles.outerPrompt}>
                <span className={styles.timer}>{timer}</span>
                {thisPrompt}
            </div>
        </div>
    )
}
