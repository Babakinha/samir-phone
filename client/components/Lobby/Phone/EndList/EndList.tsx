import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw';
import { Socket } from 'socket.io-client';
import DrawPrompt from '../Prompts/DrawPrompt';
import EndListRounds from './EndListRounds';

export default function EndList({roomData, gameData, socket}: {roomData: any, gameData: any, socket: Socket}) {
    let roundIndex = 0;
    const [currentRounds, setRounds] = useState<any>()

    const router = useRouter();

    const emid = () => {
        router.push('/')
    }

    
    useEffect(() => {
        const onNextRound = () => {
            console.log(roundIndex)
            roundIndex++;
            setRounds(null)
            setRounds(<EndListRounds roomData={roomData} index={roundIndex} gameData={gameData} time={5} onNext={onNextRound} />)
        }
        socket.on('Phone_EndGame', onNextRound)
        socket.on('Phone_EndRound', onNextRound)
        setRounds(<EndListRounds roomData={roomData} index={roundIndex} gameData={gameData} time={5} onNext={onNextRound} />)
    }, [])



    return (
        <div>
            {gameData.PlayerRounds.map((pRound: any, index:number) => {
                return <EndListRounds key={index} roomData={roomData} index={index} gameData={gameData} time={5} onNext={() => {}} />
            })}
            {currentRounds}
            <button onClick={emid}>Next</button>
        </div>
    )
}
