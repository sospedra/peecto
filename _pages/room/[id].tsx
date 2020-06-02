import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import PeerVault from 'service/peer/vault'

const Peer = dynamic(() => import('service/peer'), { ssr: false })

const Room: React.FC<{}> = () => {
  const router = useRouter()
  const { isHost } = PeerVault

  return (
    <main>
      <p>id is {router.query.id}</p>
      <Peer roomID={`${router.query.id}`} isHost={isHost} />
    </main>
  )
}

export default Room
