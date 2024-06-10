import { Router } from 'express'
import { createReact, findReact, downloadReact } from '../controllers/react.controller'
import { uploadReacted } from '../middlewares/uploadFile.middleware'

export const reactRouter = Router()

reactRouter.post('/react', uploadReacted.single('reactedFiles'), createReact)
reactRouter.get('/react/:id', findReact)
reactRouter.get('/download/:id', downloadReact)
