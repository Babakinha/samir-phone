import { useRouter } from 'next/dist/client/router';
import React, { useEffect, useState } from 'react'

import styles from './GetRoom.module.css'

export default function GetRoom()  {
    const router = useRouter();
    //const [name, setName] = useState('');
    //const [code, setCode] = useState('');
    let name: string, code: string;
    const nameCheck = (): boolean => {
        return Boolean(name)
    }
    const joinRoom = () => {
        //setCode(prompt('Enter The Room Code')!);
        if(!nameCheck()) return;
        code = prompt('Enter The Room Code')!;
        router.push(`/room?code=${code}&name=${name}`);
    }

    const createRoom = () => {
        // TODO: Actually create room here
        //setCode(Math.floor(1000 + Math.random() * 9000).toString())
        if(!nameCheck()) return;
        code = Math.floor(1000 + Math.random() * 9000).toString();
        router.push(`/room?code=${code}&name=${name}`);
    }

    return (
        <div className={styles.menuContainer}>
            <div className={styles.inputContainer}>
                <input placeholder='samir' className='playerNameInput' type='text' onChange={(e) => name = e.target.value} />
            </div>

            <div className={styles.buttonContainer}>
                <button className={styles.button} type='submit'  onClick={createRoom}>Create Room</button>
                <button className={styles.button} type='submit' onClick={joinRoom}>Join Room</button>
            </div>
        </div>
    )
}