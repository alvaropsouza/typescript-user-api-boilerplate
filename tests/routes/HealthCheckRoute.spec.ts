import request from 'supertest'
import { startApp } from '@helpers/app'
const prisma = jestPrisma.client

const app = startApp()

afterEach(async () => {
    jest.clearAllMocks()
})

describe('GET /health', () => {
    it('Should return 200', async () => {
        await request(app).get('/health').expect(200)
    })
})
