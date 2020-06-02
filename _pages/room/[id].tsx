import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Peer = dynamic(() => import('service/peer'), { ssr: false })

const Room: React.FC<{}> = () => {
  const router = useRouter()
  return (
    <main>
      <p>id is {router.query.id}</p>
      <Peer roomID='1234' />
    </main>
  )
}

export default Room
