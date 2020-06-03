import { useState, useEffect } from 'react'
import { Map } from 'immutable'
import Peer from 'peerjs'
import { createLog } from './log'
import { Room } from './use-room'

const log = createLog('use-host')
type Net = Peer.DataConnection

export const useHost = ({ peer, id, setNodes, nodes }: Room) => {
  const [network, setNetwork] = useState(Map<Net>({}))
  const broadcast = (type: string, payload: JSONObject) => {
    log('broadcast', type, payload)
    network.forEach((net) => net.send({ type, payload }))
  }

  useEffect(() => {
    peer.on('connection', (connection) => {
      connection.on('open', () => {
        log('Established peer connection with', connection.peer)
        log('\tCurrent network', network.keySeq().toArray())
        setNetwork(network.set(connection.peer, connection))
      })

      connection.on('data', (data) => {
        log('Received data', data)
        broadcast(data.type, data.payload)
      })

      connection.on('close', () => {
        log('Close connection with', connection.peer)
        setNetwork(network.delete(connection.peer))
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
