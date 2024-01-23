import request from 'supertest'
import { startApp } from '@helpers/app'
import { faker } from '@faker-js/faker'
const prisma = jestPrisma.client
import { UserRepository } from '@repositories/UserRepository'
import sgMail from '@sendgrid/mail'
import { Cache } from '@helpers/cache'

jest.mock('@sendgrid/mail')

const app = startApp()

const defaultUser = {
    name: 'Homer',
    password: '21Jtti2%r',
    email: faker.internet.email(),
    active: true
}

async function loginDefaultUser() {
    const userRepo = new UserRepository(prisma)
    await userRepo.saveOne({ ...defaultUser })

    const {
        body: { token }
    } = await request(app)
        .post('/user/login')
        .send({ email: defaultUser.email, password: defaultUser.password })

    return { token }
}

beforeEach(async () => {
    sgMail.send = jest.fn().mockImplementationOnce(() => true)
})

afterEach(async () => {
    jest.clearAllMocks()
})

describe('POST /user/signup', () => {
    it('Should return 201 created and confirm email', async () => {
        const token = 'token'
        const email = 'testeEmail@gmail.com'

        jest.spyOn(Cache.prototype, 'get').mockImplementationOnce(() => Promise.resolve(token))
        jest.spyOn(Cache.prototype, 'del').mockImplementationOnce(() => Promise.resolve(undefined))

        await request(app)
            .post('/user/signup')
            .send({ ...defaultUser, email })
        expect(201)

        await request(app).get(`/user/confirm/${email}?token=${token}`).expect(200)
        expect(jest.spyOn(Cache.prototype, 'del')).toHaveBeenCalled()
    })

    it('Should error invalid email token confirmation', async () => {
        const token = 'token'
        const email = 'testeEmail@gmail.com'

        await request(app)
            .post('/user/signup')
            .send({ ...defaultUser, email })
        expect(201)

        jest.spyOn(Cache.prototype, 'get').mockImplementationOnce(() => Promise.resolve('wrong_token'))

        await request(app).get(`/user/confirm/${email}?token=${token}`).expect(403)
    })

    it('Should error signup email send and still display 201 status', async () => {
        sgMail.send = jest.fn().mockRejectedValueOnce(new Error('Email send error'))
        await request(app)
            .post('/user/signup')
            .send({ ...defaultUser })
        expect(201)
    })

    it('Should return 400 for invalid payloads', async () => {
        const invalidFields = {
            password: 'simplePass',
            name: 'vi',
            email: ''
        }

        for (const key in invalidFields) {
            let user = { ...defaultUser }
            user[key] = invalidFields[key]
            await request(app)
                .post('/user/signup')
                .send({ ...user })
                .expect(400)
        }
    })

    it('Should return 400 duplicated', async () => {
        await request(app)
            .post('/user/signup')
            .send({ ...defaultUser })

        await request(app)
            .post('/user/signup')
            .send({ ...defaultUser })
        expect(400)
    })

    it('Should return 500 internal server error', async () => {
        prisma.user.create = jest.fn().mockRejectedValueOnce(new Error('Repository generic error'))
        await request(app)
            .post('/user/signup')
            .send({ ...defaultUser })
            .expect(500)
    })
})

describe('POST /user/login', () => {
    it('Should return 200 ok', async () => {
        const userRepo = new UserRepository(prisma)
        await userRepo.saveOne({ ...defaultUser })

        const res = await request(app)
            .post('/user/login')
            .send({ email: defaultUser.email, password: defaultUser.password })

        expect(res.body.token).toBeDefined()
    })

    it('Should Error 403 not active user login', async () => {
        const userRepo = new UserRepository(prisma)
        await userRepo.saveOne({ ...defaultUser, active: false })

        const res = await request(app)
            .post('/user/login')
            .send({ email: defaultUser.email, password: defaultUser.password })
            .expect(403)

        expect(res.body.token).toBe(undefined)
    })

    it('Should return 400 bad request', async () => {
        const { email, password } = defaultUser

        await request(app).post('/user/login').send({ email, password }).expect(400)

        const userRepo = new UserRepository(prisma)
        await userRepo.saveOne({ ...defaultUser })

        await request(app)
            .post('/user/login')
            .send({ email: defaultUser.email, password: `${defaultUser.password}dif` })
            .expect(400)
    })

    it('Should return 500 internal server error', async () => {
        const { email, password } = defaultUser
        prisma.user.findUnique = jest.fn().mockRejectedValueOnce(new Error('Repository generic error'))
        await request(app).post('/user/login').send({ email, password }).expect(500)
    })
})

describe('POST /user/confirm/:email', () => {
    it('Should return 500 internal server error', async () => {
        const { email } = defaultUser
        const token = 'token'
        jest.spyOn(Cache.prototype, 'get').mockImplementationOnce(() => Promise.reject(token))
        await request(app).get(`/user/confirm/${email}?token=${token}`).expect(500)
    })
})

describe('PUT /user/{email}', () => {
    it('Should return 200 ok', async () => {
        const { token } = await loginDefaultUser()

        const passwordChange = {
            newPassword: 'X#y5e$W^p$',
            password: defaultUser.password
        }

        const { email } = defaultUser

        await request(app)
            .put(`/user/${email}`)
            .set('Authorization', token)
            .send({
                ...passwordChange
            })
            .expect(200)

        await request(app)
            .post('/user/login')
            .send({ email, password: passwordChange.newPassword })
            .expect(200)
    })

    it('Should return 403 forbidden', async () => {
        const passwordChange = {
            password: defaultUser.password,
            newPassword: 'X#y5e$W^p$'
        }

        const { email } = defaultUser

        const { token } = await loginDefaultUser()

        await request(app)
            .put(`/user/dif${email}`)
            .set('Authorization', token)
            .send({
                ...passwordChange
            })
            .expect(403)
    })

    it('Should return 400 bad request same password', async () => {
        const { password } = defaultUser
        const passwordChange = {
            password,
            newPassword: password
        }

        const { token } = await loginDefaultUser()

        const { email } = defaultUser

        await request(app)
            .put(`/user/${email}`)
            .set('Authorization', token)
            .send({
                ...passwordChange
            })
            .expect(400)
    })

    it('Should return 500 internal server error', async () => {
        const { password } = defaultUser

        const { token } = await loginDefaultUser()

        prisma.user.findUnique = jest.fn().mockRejectedValueOnce(new Error('Repository generic error'))

        await request(app)
            .put(`/user/${defaultUser.email}`)
            .set('Authorization', token)
            .send({ password, newPassword: `${password}!` })
            .expect(500)
    })
})

describe('GET /user/{email}', () => {
    it('Should return 200 ok', async () => {
        const { name, email } = defaultUser

        const { token } = await loginDefaultUser()

        const res = await request(app)
            .get(`/user/${defaultUser.email}`)
            .set('Authorization', token)
            .expect(200)

        expect(res.body).toEqual(
            expect.objectContaining({
                name,
                email,
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            })
        )
    })

    it('Should return 404 not found', async () => {
        const { token } = await loginDefaultUser()

        await request(app).get(`/user/${defaultUser.email}dif`).set('Authorization', token).expect(404)
    })

    it('Should return 500 internal server error', async () => {
        const { email } = defaultUser

        const { token } = await loginDefaultUser()

        prisma.user.findUnique = jest.fn().mockRejectedValueOnce(new Error('Repository generic error'))
        await request(app)
            .get(`/user/${defaultUser.email}`)
            .set('Authorization', token)
            .send({ email })
            .expect(500)
    })
})

describe('GET /users', () => {
    it('Should return 200 ok', async () => {
        const { token } = await loginDefaultUser()

        const res = await request(app).get('/users').set('Authorization', token).expect(200)

        res.body.map((user) => {
            const { name, email } = user
            expect(user).toEqual(
                expect.objectContaining({
                    name,
                    email,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            )
        })

        expect(res.body.length >= 1).toBeTruthy()
    })

    it('Should return 500 internal server error', async () => {
        const { token } = await loginDefaultUser()

        const { email } = defaultUser

        prisma.user.findMany = jest.fn().mockRejectedValueOnce(new Error('Repository generic error'))

        await request(app).get('/users').set('Authorization', token).send({ email }).expect(500)
    })
})

describe('DELETE /user/{email}', () => {
    it('Should return 204 no content', async () => {
        const { token } = await loginDefaultUser()

        await request(app)
            .delete(`/user/${defaultUser.email}`)
            .set('Authorization', token)
            .send({
                password: defaultUser.password
            })
            .expect(204)
    })

    it('Should return 403 forbidden', async () => {
        const { token } = await loginDefaultUser()

        await request(app)
            .delete(`/user/${defaultUser.email}`)
            .send({ password: `${defaultUser.password}wrong` })
            .set('Authorization', token)
            .expect(403)
    })

    it('Should return 500 internal server error', async () => {
        const { token } = await loginDefaultUser()

        prisma.user.delete = jest.fn().mockRejectedValueOnce(new Error('Repository generic error'))
        await request(app)
            .delete(`/user/${defaultUser.email}`)
            .set('Authorization', token)
            .send({ password: defaultUser.password })
            .expect(500)
    })
})

describe('JWT login middleware', () => {
    it('Should 403 forbidden on jwt verify', async () => {
        const res = await request(app).get('/users').set('Authorization', 'invalid_token').expect(403)
    })
})
