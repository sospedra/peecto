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
              <p>Round: {room.game.round}</p>
              <p>Turn: {room.game.turn}</p>
              <p>Scoreboard: {JSON.stringify(room.game.scoreboard)}</p>

              <div
                style={{
                  display: room.game.startAt ? 'block' : 'none',
                }}
              >
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

              <div style={{ display: room.game.startAt ? 'none' : 'block' }}>
                <p>Awaiting to start with {room.chat.nodes.length} players</p>
                {room.isHost && (
                  <button
                    onClick={() => {
                      broadcast({
                        type: 'start',
                        payload: {
                          master: room.id,
                          players: room.chat.nodes.map((x) => ({
                            playerID: x,
                            display: x,
                          })),
                        },
                      })
                    }}
                  >
                    start
                  </button>
                )}
              </div>
            </div>
          )
        }}
      </Peer>
    </main>
  )
}

export default Room
