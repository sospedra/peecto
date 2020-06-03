import { useState, useRef, useEffect } from 'react'
import Peer from 'peerjs'
import Vault from './vault'
import { createLog } from './log'
import { useChat } from './use-chat'

const log = createLog('use-peer')

export type Room = ReturnType<typeof useRoom>

export const useRoom = (roomID: string) => {
  const [id, setID] = useState<string>()
  const [nodes, setNodes] = useState<string[]>([])
  const chat = useChat()
  const { current: peer } = useRef<Peer>(
    new Peer(Vault.isHost ? roomID : null, {
      host: 'peecto-handshake.herokuapp.com',
      port: 443,
      path: '/myapp',
      secure: true,
    }),
  )

  useEffect(() => {
    peer.on('open', (id) => {
      log('Open peer', id)
      setID(id)
    })
    peer.on('disconnected', () => {
      log('Disconnected peer', id)
      setTimeout(() => peer.reconnect(), 5000)
    })

    return () => {
      log('Destroy peer', id)
      peer.destroy()
    }
  }, [])

  return { peer, id, nodes, setNodes, roomID, chat }
}
