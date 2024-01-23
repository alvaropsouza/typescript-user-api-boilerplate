import { pathsToModuleNameMapper } from 'ts-jest'

import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: '@quramy/jest-prisma/environment',
    coverageProvider: 'babel',
    moduleFileExtensions: ['js', 'ts'],
    collectCoverageFrom: [
        '<rootDir>/src/**/*.ts',
        '!<rootDir>/src/main.ts',
        '!<rootDir>/src/config/envs.ts',
        '!<rootDir>/src/database/client.ts'
    ],
    moduleNameMapper: pathsToModuleNameMapper(
        {
            '@database/*': ['database/*'],
            '@helpers/*': ['helpers/*'],
            '@config/*': ['config/*'],
            '@repositories/*': ['data/repositories/*'],
            '@controllers/*': ['data/controllers/*'],
            '@validators/*': ['data/validators/*'],
            '@services/*': ['data/services/*'],
            '@factories/*': ['data/factories/*'],
            '@utils/*': ['utils/*']
        },
        { prefix: '<rootDir>/src/' }
    ),

    setupFilesAfterEnv: ['<rootDir>/tests/mock-prisma.ts'],
    testMatch: ['<rootDir>/tests/**/*.test.ts', '<rootDir>/tests/**/*.spec.ts'],
    testTimeout: 180000
}

export default jestConfig
