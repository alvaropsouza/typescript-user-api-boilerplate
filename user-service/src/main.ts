import { startApp } from '@helpers/app'
import envs from '@config/envs'
import logger from '@config/logger'
import { prisma } from '@database/client'

const app = startApp()

const { port } = envs
export const server = app.listen(port, async () => logger.info(`App listening on port ${port}`))

process.on('uncaughtExceptionMonitor', (error) => {
    logger.error(`Uncaught Exception: ${error}`)
})

process.on('SIGTERM', () => {
    logger.error('SIGTERM signal received: closing HTTP server')

    prisma.$disconnect()
    logger.error('Database disconnected')

    server.close(() => {
        logger.error('HTTP server closed')
    })
})
