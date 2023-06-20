const config = {
    verbose: true,
    roots: ['./src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)',
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    globalSetup: '/config/jestSetup.js',
    globalTearDown: '/config/jestTeardown.js',
}
module.exports = config
