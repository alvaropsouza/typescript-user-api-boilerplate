import express, { Router, Request, Response } from 'express'
import { makeUserController } from '@factories/UserControllerFactory'
import {
    validateUserRegister,
    validateUserLogin,
    validateFindUserById,
    validateUserUpdate,
    defaultUserValidator,
    validateUserDeletion
} from '@validators/User/userRoutesValidator'
import { checkJwt } from '@helpers/jwt'

export const userRouter: Router = express.Router()
const userController = makeUserController()

userRouter.post(
    '/user/signup',
    [...validateUserRegister, defaultUserValidator],
    async (req: Request, res: Response) => {
        return await userController.signup(req, res)
    }
)

userRouter.post(
    '/user/login',
    [...validateUserLogin, defaultUserValidator],
    async (req: Request, res: Response) => {
        return await userController.login(req, res)
    }
)

userRouter.get(
    '/user/:email',
    validateFindUserById,
    [checkJwt, defaultUserValidator],
    async (req: Request, res: Response) => {
        return await userController.findOne(req, res)
    }
)

userRouter.get('/user/confirm/:email', async (req: Request, res: Response) => {
    return await userController.confirmEmail(req, res)
})

userRouter.get('/users', [checkJwt, defaultUserValidator], async (req: Request, res: Response) => {
    return await userController.findAll(res)
})

userRouter.put(
    '/user/:email',
    [checkJwt, ...validateUserUpdate, defaultUserValidator],
    async (req: Request, res: Response) => {
        return await userController.updatePassword(req, res)
    }
)

userRouter.delete(
    '/user/:email',
    [checkJwt, ...validateUserDeletion, defaultUserValidator],
    async (req: Request, res: Response) => {
        return await userController.deleteUser(req, res)
    }
)
