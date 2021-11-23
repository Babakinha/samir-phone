import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import GetRoom from '../components/GetRoom/GetRoom'

const Home: NextPage = () => {
  const [ThisPage, setThisPage] = useState(<div />)
  useEffect(() => {
    setThisPage(<GetRoom setPage={setThisPage} />)
  }, [])

  return (
    <div>
      {ThisPage}
    </div>
  )
}

export default Home
