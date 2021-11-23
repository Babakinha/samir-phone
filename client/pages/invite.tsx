import { NextPage } from 'next'
import { useRouter } from 'next/dist/client/router'
import React, { useEffect,useState } from 'react'
import Lobby from '../components/Lobby/Lobby'

const Invite: NextPage = () => {
    const router = useRouter()
    const { code } = router.query
    
    
    const [ThisPage, setThisPage] = useState(<div />)
    useEffect(() => {
        if(!router.isReady) return;
        if(!code) {console.log("code: ", code); router.push("/"); return;}
        const name = prompt('Please select a name:')
        console.log(name, code)

        window.history.replaceState(null, '', '/room');
        setThisPage(< Lobby name={name as string} code={code as string} setPage={setThisPage} />)
    }, [router.isReady])

  return (
    <div>
      {ThisPage}
    </div>
  )
}

export default Invite;
