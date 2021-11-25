import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import CanvasDraw from 'react-canvas-draw';
import RandomPhrase from '../../../../util/RandomPhrase'

import styles from './TextPrompt.module.css'

export default function TextPrompt({headerText = "Write Something for others to draw!", placeholder = '', onDone = (text: string) => {}, time = 0, data = ''}) {
    const [isDone, setDone] = useState(false);
    const [text, setText] = useState<string>('');
    const [realPlaceholder, setPlaceholder] = useState<string>('');
    const [drawData, setDrawData] = useState<any>();

    const submitButton = useRef<HTMLButtonElement>(null)

    const onTextChange = (e : any) => {
        if(!e.target.value)
            setText(realPlaceholder)
        else
            setText(e.target.value)
    }

    const onSubmit = (e: any) => {
        console.log(!isDone)
        if(isDone)
        submitButton.current!.innerText = "Done";
        else{
            submitButton.current!.innerText = "Edit";
            onDone(text);
        }
        setDone(!isDone);
    }

    useLayoutEffect(() => {
        console.log(data)

        if(data)
            setDrawData(<CanvasDraw className={styles.dataCanvas} ref={c => c?.loadSaveData(data)} disabled hideGrid />)

        setPlaceholder(placeholder? placeholder : RandomPhrase())
        if(time > 0)
            setTimeout(() => {
                if(text) 
                    onDone(text);
                else 
                    onDone(realPlaceholder);
            }, 1000 * (time - 3));
    }, [])
    
    useLayoutEffect(() => {
        setText(realPlaceholder)
    }, [realPlaceholder])

    return (
        <div>
            <h1>{headerText}</h1>
            {drawData}
            <input placeholder={realPlaceholder} style={{width: '75%'}} disabled={isDone} type="text" onChange={onTextChange} />
            <button ref={submitButton} type="submit" onClick={onSubmit}>Done</button>
        </div>
    )
}
