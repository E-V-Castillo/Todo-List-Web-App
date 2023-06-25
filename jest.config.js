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
    globalTeardown: './dist/src/config/jestTeardown.js',
    bail: false,
}
module.exports = config
