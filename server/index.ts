import next from 'next'
import express from 'express'
import http from 'http'
import { ExpressPeerServer } from 'peer'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const core = express()
  const server = http.createServer(core).listen(port)

  core.use(
    '/handshake',
    ExpressPeerServer(server, {
      key: 'peecto',
      path: '/',
    }),
  )

  core.all('*', (req, res) => handle(req, res))
})
