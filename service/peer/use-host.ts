import { useEffect, useState } from 'react'
import { Map } from 'immutable'
import Peer from 'peerjs'
import { createLog } from './log'
import { Room } from './use-room'
import { useStateRef } from 'service/use-state-ref'

const log = createLog('use-host')
type Net = Peer.DataConnection

export const useHost = ({ peer, id, setNodes, nodes, chat }: Room) => {
  const [network, setNetwork, networkRef] = useStateRef(Map<Net>({}))
  const broadcast = (type: string, payload: JSONObject) => {
    log('broadcast', type, payload, networkRef.current.keySeq().toArray())
    networkRef.current.forEach((net) => net.send({ type, payload }))
  }

  useEffect(() => {
    peer.on('connection', (connection) => {
      log('Trying to connect with', connection.peer)
      connection.on('open', () => {
        log('Established peer connection with', connection.peer)
        setNetwork((network) => {
          log('\tCurrent network', network.keySeq().toArray())
          return network.set(connection.peer, connection)
        })
      })

      connection.on('data', (data) => {
        log('Received data', data)
        chat.dispatch(data)
        broadcast(data.type, data.payload)
      })

      connection.on('close', () => {
        log('Close connection with', connection.peer)
        setNetwork((network) => {
          log('\tCurrent network', network.keySeq().toArray())
          return network.set(connection.peer, connection)
        })
      })

      connection.on('error', createLog('use-host', 'error'))
    })
  }, [])

  useEffect(() => {
    const n = [id, ...network.keySeq().toArray()].filter((x) => x)
    log('set nodes', n)
    setNodes(n)
  }, [network, id])

  useEffect(() => {
    if (nodes.length) broadcast('nodes-update', { nodes })
  }, [nodes])

  return { broadcast }
}
