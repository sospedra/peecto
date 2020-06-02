import React, { useEffect, useState, useRef } from 'react'
import Peer from 'peerjs'

const PeerProvider: React.FC<{ roomID: string }> = (props) => {
  const { current: peer } = useRef(new Peer())
  const [id, setID] = useState<string>()

  useEffect(() => {
    peer.on('open', (id) => setID(id))
  }, [])

  return (
    <div>
      <p>Room ID: {props.roomID}</p>
      <p>{peer ? 'peer established' : 'creating peer'}</p>
      <p>id {id}</p>
    </div>
  )
}

export default PeerProvider
