import React from 'react'
import Vault from './vault'
import { useRoom } from './use-room'
import { useHost } from './use-host'
import { usePeer } from './use-peer'

const PeerProvider: React.FC<{ roomID: string }> = ({ roomID }) => {
  const room = useRoom(roomID)
  const { broadcast } = Vault.isHost ? useHost(room) : usePeer(room)

  return (
    <div>
      <p>Room ID: {roomID}</p>
      <p>host: {Vault.isHost.toString()}</p>
      <p>Room:</p>
      <ul>
        {room.nodes.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <p>id {room.id}</p>
      <button onClick={() => broadcast('message', { content: 'ping' })}>
        Ping
      </button>
    </div>
  )
}

export default PeerProvider
