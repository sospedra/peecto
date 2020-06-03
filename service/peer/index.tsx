import React, { useEffect, useState } from 'react'
import Peer from 'peerjs'
import Immutable from 'immutable'
import Vault from './vault'

const PeerProvider: React.FC<{ roomID: string }> = (props) => {
  const [peer, setPeer] = useState<Peer>()
  const [id, setID] = useState<string>()
  const [network, setNetwork] = useState(Immutable.Map<Peer.DataConnection>({}))
  const [host, setHost] = useState<Peer.DataConnection>()
  const [room, setRoom] = useState<{ members: string[] }>({ members: [] })
  const broadcast = (payload: { [key: string]: any }) => {
    if (!Vault.isHost) return
    network.forEach((net) => net.send(payload))
  }
  const emit = () => {
    const data = {
      type: 'message',
      content: 'ping',
    }

    if (host) {
      console.log('SSS' + JSON.stringify(data))
      host.send(data)
    }

    if (!network.isEmpty()) {
      broadcast(data)
      // update data
    }
  }

  useEffect(() => {
    const peer = new Peer(Vault.isHost ? props.roomID : null, {
      host: 'peecto-handshake.herokuapp.com',
      port: 443,
      path: '/myapp',
      secure: true,
    })

    peer.on('open', (id) => {
      setID(id)
    })

    peer.on('disconnected', () => {
      setTimeout(() => peer.reconnect(), 5000)
    })

    peer.on('connection', (connection) => {
      console.log('Candidate connection', connection.peer)
      connection.on('open', () => {
        console.log('Established peer connection with', connection.peer)
        setNetwork(network.set(connection.peer, connection))
      })

      connection.on('data', (data) => {
        console.log('Data ▼', data)
        broadcast(data)
      })

      connection.on('close', () => {
        console.log('Close connection with', connection.peer)
        setNetwork(network.delete(connection.peer))
      })

      connection.on('error', console.error)
    })

    setPeer(peer)

    return () => {
      peer.destroy()
    }
  }, [])

  useEffect(() => {
    if (!!id && !Vault.isHost) {
      const host = peer.connect(props.roomID)
      console.log('[peer] Trying to connect with room', props.roomID)

      host.on('open', () => {
        console.log(`[peer] Connection to ${host.peer} established.`)
      })

      host.on('data', (data) => {
        console.log('[peer] Data ▼', data)
        switch (data.type) {
          case 'room-update': {
            console.log('set room', data.room)
            setRoom(data.room)
          }
        }
      })

      host.on('close', () => {
        console.log(`[peer] Connection to ${host.peer} is closed.`)
        peer.destroy()
      })

      setHost(host)
    }
  }, [id])

  useEffect(() => {
    const members = [id, ...network.keySeq().toArray()].filter((x) => x)
    setRoom({ ...room, members })
  }, [network, id])

  useEffect(() => {
    broadcast({
      type: 'room-update',
      room,
    })
  }, [room])

  return (
    <div>
      <p>Room ID: {props.roomID}</p>
      <p>host: {Vault.isHost.toString()}</p>
      <p>Room:</p>
      <ul>
        {room.members.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
      <p>id {id}</p>
      <button onClick={emit}>Ping</button>
    </div>
  )
}

export default PeerProvider
