import { UserRegisterType, UserUpdateType, GetUserResponseType } from '@validators/User/UserTypes'
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const getUserQuery = {
    name: true,
    email: true,
    active: true,
    updatedAt: true,
    createdAt: true
}

export class UserRepository {
    private prisma: PrismaClient

    constructor(database: PrismaClient) {
        this.prisma = database
    }

    async saveOne(user: UserRegisterType): Promise<void> {
        const { name, email, password, active } = user
        await this.prisma.user.create({
            data: { name, email, password: await argon2.hash(password), active }
        })
    }

    async getUserCredentials({ email, password }): Promise<boolean> {
        const getUser = await this.prisma.user.findUnique({
            where: { email }
        })
        if (!getUser) return false

        const passwordMatches = await argon2.verify(getUser.password, password)

        return passwordMatches ? Boolean(getUser) : false
    }

    async findOne(email: string): Promise<GetUserResponseType> {
        return await this.prisma.user.findUnique({
            where: { email },
            select: getUserQuery
        })
    }

    async findAll(): Promise<GetUserResponseType[]> {
        return await this.prisma.user.findMany({
            select: getUserQuery
        })
    }

    async updatePassword(user: UserUpdateType, currentEmail: string): Promise<void> {
        const { newPassword } = user

        await this.prisma.user.update({
            where: { email: currentEmail },
            data: { password: await argon2.hash(newPassword) }
        })
    }

    async activateEmail(email: string): Promise<void> {
        await this.prisma.user.update({
            where: { email },
            data: { active: true }
        })
    }

    async deleteOne(email: string): Promise<void> {
        await this.prisma.user.delete({ where: { email } })
    }
}
