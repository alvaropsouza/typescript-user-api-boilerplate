import { UserController } from '@controllers/User/UserController'
import { UserRepository } from '@repositories/UserRepository'
import { prisma } from '@database/client'
import { Mailer } from '@controllers/Mailer/Mailer'
import { Cache } from '@helpers/cache'
import { UserService } from '@services/User/UserService'

const userService = new UserService(new Cache(), new Mailer())

export const makeUserController = () => {
    return new UserController(new UserRepository(prisma), userService)
}
