import express, { Router, Request, Response } from 'express'
import { prisma } from '@database/client'
import { server } from '../main'
import logger from '@config/logger'

export const healthRouter: Router = express.Router()

healthRouter.get('/health', async (req: Request, res: Response) => {
    try {
        await prisma.$queryRaw`SELECT 1`

        return res.send(`All good chief!`)
    } catch (error: any) {
        process.exit(0)
    }
})
