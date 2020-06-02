import { NextPage } from 'next'
import uuid from 'short-uuid'
import useTranslation from 'next-translate/useTranslation'
import Router from 'next-translate/Router'
import PeerVault from 'service/peer/vault'

const Home: NextPage = () => {
  const { t } = useTranslation()

  return (
    <main>
      <a
        href='/room/[id]'
        onClick={(e) => {
          e.preventDefault()
          PeerVault.markAsHost()
          Router.pushI18n('/room/[id]', `/room/${uuid.generate()}`)
        }}
      >
        {t('home:create-room')}
      </a>
    </main>
  )
}

export default Home
