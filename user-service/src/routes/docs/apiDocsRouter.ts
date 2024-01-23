import swaggerUi from 'swagger-ui-express'
import express, { Router } from 'express'
import * as swaggerDocument from './swagger.json'

export const docsRouter: Router = express.Router()

docsRouter.use('/api-docs', swaggerUi.serve)
docsRouter.get('/api-docs', swaggerUi.setup(swaggerDocument))
