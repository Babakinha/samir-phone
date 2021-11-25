import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import RandomPhrase from '../../../../util/RandomPhrase'
import CanvasDraw from 'react-canvas-draw'; '../Pictionary/DrawingCanvas';

import styles from './DrawPrompt.module.css'
import toast from 'react-hot-toast';

export default function DrawPrompt({headerText = "Draw!", onDone = (drawingData: string) => {}, time = 0, data = ''}) {
    const [isDone, setDone] = useState(false);
    const [text, setText] = useState<any>();

    const submitButton = useRef<HTMLButtonElement>(null)
    const drawCanvas = useRef<CanvasDraw>(null)

    const onSubmit = (e: any) => {
        console.log(!isDone)
        if(isDone)
        submitButton.current!.innerText = "Done";
        else{
            submitButton.current!.innerText = "Edit";
            onDone(drawCanvas.current!.getSaveData());
        }
        setDone(!isDone);

    }

    useLayoutEffect(() => {

        if(data)
            setText(<span className={styles.textData}>{data}</span>)
        if(time > 0)
            setTimeout(() => {
                const data = drawCanvas.current?.getSaveData() 
                if(data)onDone(data);
            }, 1000 * (time - 3));
    }, [])
    
    return (
        <div className={styles.outerPrompt}>
            <div className={styles.outerHeader}>
                <h1 className={styles.headerText}>{headerText}</h1>
                {text}
            </div>
            <CanvasDraw className={styles.canvasData} ref={drawCanvas} hideGrid disabled={isDone} />
            <button className={styles.submitButton} ref={submitButton} type="submit" onClick={onSubmit}>Done</button>
        </div>
    )
}
