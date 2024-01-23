import { userRouter, healthRouter, docsRouter } from '../routes'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

export function startApp() {
    const app = express()
    const routes = [docsRouter, userRouter, healthRouter]

    app.use([cors({ origin: '*' }), express.json(), helmet()])
    app.use(routes)

    return app
}
