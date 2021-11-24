import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import RandomPhrase from '../../../util/RandomPhrase'
import CanvasDraw from 'react-canvas-draw'; '../Pictionary/DrawingCanvas';

export default function DrawPrompt({headerText = "Write Something for others to draw!", onDone = (drawingData: string) => {}, time = 0}) {
    const [isDone, setDone] = useState(false);
    const [text, setText] = useState<string>('');

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
        if(time > 0)
            setTimeout(() => {
                onDone(drawCanvas.current!.getSaveData());
            }, 1000 * (time - 3));
    }, [])
    
    return (
        <div>
            <h1>{headerText}</h1>
            <CanvasDraw ref={drawCanvas} hideGrid disabled={isDone} />
            <button ref={submitButton} type="submit" onClick={onSubmit}>Done</button>
        </div>
    )
}
