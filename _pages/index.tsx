import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Router from 'next-translate/Router'
import uuid from 'short-uuid'

const Home: NextPage = () => {
  const { t } = useTranslation()

  return (
    <main>
      <button
        onClick={() => {
          Router.pushI18n(`/room/${uuid.generate()}`)
        }}
      >
        {t('home:create-room')}
      </button>
    </main>
  )
}

export default Home
