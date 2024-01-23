import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import envs from '@config/envs'
import {
    ok,
    badRequest,
    notFound,
    internalServerError,
    forbidden,
    noContent,
    created
} from '@config/errors/Responses'
import logger from '@config/logger'
import { Response, Request } from 'express'
import { UserRepository } from '@repositories/UserRepository'
import { UserService } from '@services/User/UserService'

const { loginTokenMaxDuration, jwtSecret } = envs

export class UserController {
    usersRepository: UserRepository
    userService: UserService

    constructor(usersRepository: UserRepository, userService: UserService) {
        this.usersRepository = usersRepository
        this.userService = userService
    }

    public async signup(req: Request, res: Response) {
        try {
            logger.info('Starting signup attempt')

            const user = req.body
            const { email, name } = req.body

            await this.usersRepository.saveOne({ ...user })
            await this.userService.sendAccountEmailConfirmation({ email, name })

            return created(res)
        } catch (error: any) {
            logger.error(`Signup failed at some point ${error}`)

            const userAlreadyExistsCode = 'P2002'
            if (error.code === userAlreadyExistsCode) {
                return badRequest(res, 'User already exists')
            }

            return internalServerError(res)
        }
    }

    public async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body

            logger.info(`Starting login attempt Email: ${email}`)

            const user = await this.usersRepository.getUserCredentials({ email, password })
            if (!user) return badRequest(res)

            const { active, name } = await this.usersRepository.findOne(email)
            if (!active) {
                this.userService.sendAccountEmailConfirmation({ email, name })

                return forbidden(res, `Email "${email}" is not active`)
            }

            const token = jwt.sign({ user }, jwtSecret, { expiresIn: loginTokenMaxDuration })

            logger.info('Login successful')

            return ok(res, { token })
        } catch (error: any) {
            logger.error(`Login failed at some point ${error}`)

            return await internalServerError(res)
        }
    }

    public async updatePassword(req: Request, res: Response) {
        try {
            const user = req.body
            const { email } = req.params

            if (user.password === user.newPassword) return badRequest(res, 'Passwords cannot be the same')

            const authUser = await this.usersRepository.getUserCredentials({
                email,
                password: user.password
            })
            if (!authUser) return forbidden(res)

            await this.usersRepository.updatePassword({ ...user }, email)

            return ok(res)
        } catch (error: any) {
            logger.error(`Update user failed at some point: ${error}`)
            return internalServerError(res)
        }
    }

    public async findOne(req: Request, res: Response) {
        try {
            const { email } = req.params

            const findUser = await this.usersRepository.findOne(email)
            if (!findUser) return notFound(res)

            return ok(res, findUser)
        } catch (error: any) {
            logger.error(`Find one user failed at some point ${error}`)
            return internalServerError(res)
        }
    }

    public async findAll(res: Response) {
        try {
            const users = await this.usersRepository.findAll()
            return ok(res, users)
        } catch (error: any) {
            logger.error(`Find users failed at some point ${error}`)
            return internalServerError(res)
        }
    }

    public async deleteUser(req: Request, res: Response) {
        try {
            const { password } = req.body
            const { email } = req.params

            const userLogin = await this.usersRepository.getUserCredentials({ email, password })
            if (!userLogin) return forbidden(res)

            await this.usersRepository.deleteOne(email)

            return await noContent(res)
        } catch (error: any) {
            logger.error(`Inactivate user failed at some point ${error}`)

            return internalServerError(res)
        }
    }

    public async confirmEmail(req: Request, res: Response) {
        try {
            const { email } = req.params
            const { token } = req.query

            const cachedToken = await this.userService.getEmailConfirmationCache(email)
            logger.info(cachedToken, token)
            const isInvalidToken = cachedToken !== token
            if (isInvalidToken) return forbidden(res)

            await this.usersRepository.activateEmail(email)
            await this.userService.deleteEmailConfirmationCache(email)

            return await ok(res)
        } catch (error: any) {
            logger.error(`Confirm email failed at some point ${error}`)

            return internalServerError(res)
        }
    }
}
