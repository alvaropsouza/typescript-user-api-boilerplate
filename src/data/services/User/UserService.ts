import { Cache } from '@helpers/cache'
import { Mailer } from '@controllers/Mailer/Mailer'
import { ConfirmEmailParams } from './UserServiceTypes'
import crypto from 'crypto'

export class UserService {
    cache: Cache
    mailer: Mailer

    constructor(cache: Cache, mailer: Mailer) {
        this.cache = cache
        this.mailer = mailer
    }

    async sendAccountEmailConfirmation({ email, name }: ConfirmEmailParams) {
        const token = crypto.randomUUID()
        this.cache.set(email, token, 60 * 15)
        await this.mailer.sendConfirmationEmail({ email, name, token })
    }

    async deleteEmailConfirmationCache(email: string) {
        await this.cache.del(email)
    }

    async getEmailConfirmationCache(email: string) {
        return await this.cache.get(email)
    }
}
