import { useEffect, useState } from 'react'
import Peer from 'peerjs'
import { createLog } from './log'
import { Room } from './use-room'

const log = createLog('use-peer')

export const usePeer = ({ peer, roomID, id, setNodes }: Room) => {
  const [host, setHost] = useState<Peer.DataConnection>()
  const broadcast = (type: string, payload: JSONObject) => {
    log('broadcast', type, payload)
    host.send({ type, payload })
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
        switch (data.type) {
          case 'nodes-update': {
            log('case', data)
            setNodes(data.payload.nodes)
          }
        }
      })

      host.on('close', () => {
        log(`Connection to ${host.peer} is closed.`)
        peer.destroy()
      })

      setHost(host)
    }
  }, [id])

  return { broadcast }
}
