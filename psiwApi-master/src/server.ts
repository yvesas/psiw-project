import express from 'express'
import cors from 'cors'
import path from 'path'
import https from 'https'
import fs from 'fs'

import { psiwRouter } from './routes/psiw.routes'
import { reactRouter } from './routes/react.routes'

const keyPath = path.resolve(__dirname, 'certs/privkey.pem')
const certPath = path.resolve(__dirname, 'certs/fullchain.pem')

const options = {
  key: fs.readFileSync(keyPath),
  cert: fs.readFileSync(certPath)
}

const app = express()

app.use(cors({
  origin: '*'
}))
app.use(express.json())

app.use((req, res, next) => {
  if (!req.secure) {
    res.redirect(`https://${req.get('host')}${req.url}`); return
  }
  next()
})

const server = https.createServer(options, app)

app.use('/static', express.static(path.join(__dirname, '..', 'public', 'uploads', 'viewedFiles')))
app.use('/static', express.static(path.join(__dirname, '..', 'public', 'uploads', 'reactedFiles')))
app.use('/static', express.static(path.join(__dirname, '..', 'public', 'uploads', 'compiledFiles')))

app.use('/api', psiwRouter)
app.use('/api', reactRouter)

server.listen('5587', () => { console.log('listening on http://localhost:5587') })
