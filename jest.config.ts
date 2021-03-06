import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg|ttf)$': '<rootDir>/__mocks__/fileMock.ts'
  },
  collectCoverageFrom: ['**/*.{js,ts,tsx}', '!**/*.d.ts', '!jest.**.ts'],
  coveragePathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/pages/_app.tsx',
    '<rootDir>/src/pages/_document.tsx',
    '<rootDir>/src/styles/global.ts'
  ]
}

export default config
