import logger from '@config/logger'
import jwt from 'jsonwebtoken'
import envs from '@config/envs'
import { forbidden } from '@config/errors/Responses'
import { Request, Response } from 'express'

const { jwtSecret } = envs

export const checkJwt = async (req: Request, res: Response, next) => {
    const token = req.headers['authorization']

    jwt.verify(token, jwtSecret, next, async (err, decoded) => {
        if (err) {
            logger.error(`Erro ao verificar o token: ${err.message}`)
            return await forbidden(res, 'Invalid login authentication')
        } else {
            logger.info('Authorized')
            return next()
        }
    })
}
