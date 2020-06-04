import { useState, useEffect } from 'react'
import Peer from 'peerjs'
import Vault from './vault'
import { createLog } from './log'
import { useChat } from './use-chat'
import { useCanvas } from './use-canvas'

const log = createLog('use-peer')

export type Room = ReturnType<typeof useRoom>

export const useRoom = (roomID: string) => {
  const [id, setID] = useState<string>()
  const [peer, setPeer] = useState<Peer>()
  const chat = useChat()
  const canvas = useCanvas()

  useEffect(() => {
    const p = new Peer(Vault.isHost ? roomID : null, {
      host: 'peecto-handshake.herokuapp.com',
      port: 443,
      path: '/myapp',
      secure: true,
    })

    p.on('open', (id) => {
      log('Open peer', id)
      setID(id)
    })
    p.on('disconnected', () => {
      log('Disconnected peer', id)
      setTimeout(() => p.reconnect(), 5000)
    })

    setPeer(p)

    return () => {
      log('Destroy peer', id)
      p.destroy()
    }
  }, [])

  return { peer, id, roomID, chat, canvas }
}
