import { useEffect } from 'react'
import { Map } from 'immutable'
import Peer from 'peerjs'
import { useStateRef } from 'service/use-state-ref'
import { createLog } from './log'
import { Room } from './use-room'
import { ChatAction } from './use-chat'
import { CanvasAction } from './use-canvas'

const log = createLog('use-host')
type Net = Peer.DataConnection

export const useHost = ({ peer, id, chat, canvas }: Room) => {
  const [network, setNetwork, networkRef] = useStateRef(Map<Net>({}))
  const broadcast = (action: ChatAction | CanvasAction) => {
    log('Broadcast', action)
    chat.dispatch(action as ChatAction)
    canvas.dispatch(action as CanvasAction)
    networkRef.current.forEach((net) => net.send(action))
  }

  useEffect(() => {
    if (id) {
      peer.on('connection', (connection) => {
        log('Trying to connect with', connection.peer)

        connection.on('open', () => {
          log('Established peer connection with', connection.peer)
          setNetwork((network) => {
            return network.set(connection.peer, connection)
          })
        })

        connection.on('data', (action) => {
          log('Received action', action)
          broadcast(action)
        })

        connection.on('close', () => {
          log('Close connection with', connection.peer)
          setNetwork((network) => {
            return network.set(connection.peer, connection)
          })
        })

        connection.on('error', createLog('use-host', 'error'))
      })
    }
  }, [id])

  useEffect(() => {
    chat.dispatch({
      type: 'update-nodes',
      payload: [id, ...network.keySeq().toArray()].filter((x) => x),
    })
  }, [network, id])

  useEffect(() => {
    if (chat.nodes.length) {
      broadcast({ type: 'update-nodes', payload: chat.nodes })
    }
  }, [chat.nodes])

  return { broadcast, isReady: true }
}
