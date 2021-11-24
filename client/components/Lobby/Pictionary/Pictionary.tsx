import React, { useLayoutEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import CanvasDraw from "react-canvas-draw";

export default function Pictionary({ socket, setPage }: {socket: Socket, setPage: Function}) {
    const canvasDraw = useRef<CanvasDraw>(null);
    
    useLayoutEffect(() => {
        console.log(canvasDraw.current)
    }, [])

    return (
        <div>
            <CanvasDraw ref={canvasDraw} />        
        </div>
    )
}
