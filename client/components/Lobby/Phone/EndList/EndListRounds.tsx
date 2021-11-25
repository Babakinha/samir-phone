import React, { useLayoutEffect, useState } from 'react'
import CanvasDraw from 'react-canvas-draw';

import styles from './EndListRounds.module.css';

export default function EndListRounds({roomData, gameData, index, time, onNext}: {roomData: any, gameData: any, index: number,  time: number, onNext: Function}) {
    let roundIndex = 0;
    const [Rounds, setRounds] = useState<any>()

    const getRound = (round: any) => {
        const user = roomData.users.find((u: any) => u.id == round.userId);
        let presentableData;
        
        if(!round.data) {
            presentableData = <span className={styles.nothing}></span>
        }else if(round.action == "Text"){
            presentableData = <span className={styles.dataText}>{round.data}</span>
        }else {
            presentableData = <CanvasDraw className={styles.dataCanvas} disabled hideGrid ref={(c) => c?.loadSaveData(round.data)} />
        }

        return(
            <div key={round.userId} className={styles.outerMessage}>
                <h3 className={styles.name}>{user.name}</h3>
                {presentableData}
            </div>
        )
    }

    const showRound = () => {
        const rounds = gameData.PlayerRounds[index].rounds
        setRounds((old: any) => {if(old) return [...old, getRound(rounds[roundIndex])]; else return [getRound(rounds[roundIndex])]})
        roundIndex++;
        if((roundIndex + 1) <= rounds.length)
            setTimeout(showRound, 1000 * time) 
    }

    useLayoutEffect(() => {
        
        showRound()
    }, [])
    
    return (
        <div className={styles.outerThingy}>
            {Rounds}
        </div>
    )
}
