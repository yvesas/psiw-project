import { Router } from 'express'
import { createPsiw, findPsiw } from '../controllers/psiw.controller'
import { uploadViewed } from '../middlewares/uploadFile.middleware'

export const psiwRouter = Router()

psiwRouter.post('/psiw', uploadViewed.single('viewedFile'), createPsiw)

psiwRouter.get('/psiw/:id', findPsiw)
