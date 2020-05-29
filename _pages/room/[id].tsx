import React from 'react'
import { useRouter } from 'next/router'

const Room: React.FC<{}> = () => {
  const router = useRouter()
  return (
    <main>
      <p>id is {router.query.id}</p>
    </main>
  )
}

export default Room
