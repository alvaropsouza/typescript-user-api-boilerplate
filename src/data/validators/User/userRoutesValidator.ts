import { body, param } from 'express-validator'
import type { Request, Response } from 'express'
import { badRequest } from '@config/errors/Responses'
import { validationResult } from 'express-validator'

export const defaultUserValidator = (req: Request, res: Response, next: any) => {
    const errors: any = validationResult(req)

    errors.isEmpty() ? next() : badRequest(res, errors)
}

export const validateUserRegister = [
    body('email').isEmail(),
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    body('name')
        .exists({ checkFalsy: true })
        .withMessage('You must type a first name')
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 chars long')
        .isAlpha('pt-BR', { ignore: 's' })
        .withMessage('First name must contain only letters')
]

export const validateUserLogin = [
    body('email').isEmail(),
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
]

export const validateUserUpdate = [
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    body('newPassword').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })
]

export const validateUserDeletion = [
    body('password').isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }),
    param('email').isEmail()
]

export const validateFindUserById = [param('email').isEmail()]
