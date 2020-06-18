import React from 'react'
import Vault from './vault'
import { useRoom, Room } from './use-room'
import { useHost } from './use-host'
import { usePeer } from './use-peer'

const PeerProvider: React.FC<{
  roomID: string
  children: (opts: {
    room: Room
    broadcast: ReturnType<typeof useHost>['broadcast'] &
      ReturnType<typeof usePeer>['broadcast']
  }) => React.ReactElement
}> = (props) => {
  const room = useRoom(props.roomID)
  const { broadcast, isReady } = Vault.isHost ? useHost(room) : usePeer(room)

  room.canvas.useListeners(broadcast, isReady)

  return props.children({ room, broadcast })
}

export default PeerProvider
