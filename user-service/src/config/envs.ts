require('dotenv').config()

export default {
    nodeEnv: process.env.NODE_ENV,
    applicationName: process.env.APPLICATION_NAME,
    port: process.env.PORT || 5000,
    hostname: process.env.HOSTNAME,
    loginTokenMaxDuration: Number(process.env.LOGIN_JWT_CACHE_EXPIRATION_SECONDS),
    jwtSecret: process.env.JWT_SECRET,
    logger: {
        loggerLevel: process.env.LOGGER_LEVEL,
        dataset: process.env.LOGGER_DATASET,
        token: process.env.LOGGER_TOKEN
    },
    email: {
        sender: process.env.EMAIL_FROM,
        apiKey: process.env.SENDGRID_API_KEY,
        templateIds: {
            confirmEmail: process.env.CONFIRM_EMAIL_TEMPLATE_ID
        }
    }
}
