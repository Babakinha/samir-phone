import React, { useEffect, useLayoutEffect, useState } from 'react'
import toast, { ToastOptions } from 'react-hot-toast'
import { Socket } from 'socket.io-client'
import RandomPhrase from '../../../util/RandomPhrase'
import DrawPrompt from './DrawPrompt'
import TextPrompt from './TextPrompt'

export default function Phone({socket, setPage, isOwner}: {socket: Socket, setPage: Function, isOwner: boolean}) {

    
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
    
    const onTextDone = (text: string) => {
        socket.emit('Phone_Text', text, callbackToast);
    }

    const [thisPrompt, setPrompt] = useState(<TextPrompt onDone={onTextDone} />)

    useLayoutEffect(() => {
        console.log(socket.active)
        socket.on('Phone_RoundData', ({action, time} : {action: "Text" | "Drawing", time: number}) => {
            (action == "Text")? 
                setPrompt(<TextPrompt onDone={onTextDone} time={time} />) : 
                setPrompt(<DrawPrompt headerText='Do drawing later...' onDone={onTextDone} time={time} />);
            
            callbackToast("Type: " + action + "\nTime: " + time)
        })

        socket.on('Phone_EndGame', () => {
            callbackToast('Game Ended');
            if(isOwner)socket.emit('Phone_EndGame');
        })

    }, [])


    
    return (
        <div>
            {thisPrompt}
        </div>
    )
}
