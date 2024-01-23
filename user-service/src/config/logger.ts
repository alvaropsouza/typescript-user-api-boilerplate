import envs from './envs'
import { transports, format, createLogger } from 'winston'
import { WinstonTransport as AxiomTransport } from '@axiomhq/winston'

let date = new Date().toISOString()

const logFormat = format.printf((info) => {
    const { message, level } = info

    return `${date} [${level}]: ${JSON.stringify(message, null, 4)}`
})

const { applicationName, nodeEnv } = envs
const { loggerLevel, dataset, token } = envs.logger

const logger = createLogger({
    level: loggerLevel,

    format: format.combine(format.colorize(), logFormat),
    defaultMeta: { service: applicationName },
    transports: [
        new AxiomTransport({
            dataset,
            token
        })
    ]
})

if (nodeEnv !== 'production') {
    logger.add(
        new transports.Console({
            format: format.combine(format.colorize(), logFormat)
        })
    )
}

export default logger
