jest.mock('../src/database/client', () => {
  return {
    prisma: jestPrisma.client
  }
})
