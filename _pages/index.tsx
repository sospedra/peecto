import { NextPage } from 'next'
import useTranslation from 'next-translate/useTranslation'
import Router from 'next-translate/Router'

const Home: NextPage = () => {
  const { t } = useTranslation()

  return (
    <main>
      <button
        onClick={() => {
          const id = Math.random()
          Router.pushI18n(`/room/${id}`)
        }}
      >
        {t('home:create-room')}
      </button>
    </main>
  )
}

export default Home
