import { useEffect, useState } from 'react'
import Peer from 'peerjs'
import { createLog } from './log'
import { Room } from './use-room'
import { ChatAction } from './use-chat'

const log = createLog('use-peer')

export const usePeer = ({ peer, roomID, id, chat, canvas }: Room) => {
  const [host, setHost] = useState<Peer.DataConnection>()
  const broadcast = (action: ChatAction) => {
    log('broadcast', action)
    host.send(action)
  }

  useEffect(() => {
    if (id) {
      const host = peer.connect(roomID)
      log('Trying to connect with room', roomID)

      host.on('open', () => {
        log(`Connection to ${host.peer} established.`)
      })

      host.on('data', (data) => {
        log('Received data', data)
        chat.dispatch(data)
        canvas.dispatch(data)
      })

      host.on('close', () => {
        log(`Connection to ${host.peer} is closed.`)
        peer.destroy()
      })

      setHost(host)
    }
  }, [id])

  return { broadcast, isReady: !!host }
}
