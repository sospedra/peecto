import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const Peer = dynamic(() => import('service/peer'), { ssr: false })

const Room: React.FC<{}> = () => {
  const router = useRouter()

  return (
    <main>
      <Peer roomID={`${router.query.id}`}>
        {({ room, broadcast }) => {
          return (
            <div>
              <p>Room ID: {room.roomID}</p>
              <p>Peer ID: {room.id}</p>
              <p>Nodes:</p>
              <ul>
                {room.chat.nodes.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>

              <canvas ref={room.canvas.ref} {...room.canvas.dimensions} />
              <p>history {room.canvas.history.length}</p>
              <button
                onClick={() => {
                  broadcast({ type: 'undo' })
                }}
              >
                undo
              </button>
            </div>
          )
        }}
      </Peer>
    </main>
  )
}

export default Room
