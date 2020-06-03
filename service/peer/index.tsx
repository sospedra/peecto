import React, { useState } from 'react'
import Vault from './vault'
import { useRoom } from './use-room'
import { useHost } from './use-host'
import { usePeer } from './use-peer'
import { createMessage } from './use-chat'

const PeerProvider: React.FC<{ roomID: string }> = ({ roomID }) => {
  const [message, setMessage] = useState('')
  const room = useRoom(roomID)
  const { broadcast } = Vault.isHost ? useHost(room) : usePeer(room)

  return (
    <div>
      <p>Room ID: {room.roomID}</p>
      <p>host: {Vault.isHost.toString()}</p>
      <p>Room:</p>
      <ul>
        {room.nodes.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <button onClick={() => broadcast('message', { content: 'ping' })}>
        Ping
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          broadcast('add-message', createMessage(room.id, message))
          setMessage('')
        }}
      >
        <p>Messages:</p>
        <ul>
          {room.chat.messages.map((message) => (
            <li key={message.id}>
              <i>{message.createdAt}</i> [{message.author}]: {message.content}
            </li>
          ))}
        </ul>
        <input
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
        />
      </form>
    </div>
  )
}

export default PeerProvider
