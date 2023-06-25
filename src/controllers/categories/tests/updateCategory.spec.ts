import supertest from 'supertest'
import { app } from '../../../app'
import clearTestTables from '../../../../test/test_utils/clearTestTables'

afterEach(async () => {
    await clearTestTables()
})

describe('Update category success test', () => {
    test('Valid inputs', async () => {
        const loginResponse = await supertest(app)
            .post('/profiles/login')
            .set('Content-type', 'application/json')
            .send({ email: 'user@gmail.com', password: 'password' })

        const createResponse = await supertest(app)
            .post('/categories/')
            .send({ name: 'category' })
            .set('Cookie', [loginResponse.headers['set-cookie']])

        expect(createResponse.status).toBe(201)

        const response = await supertest(app)
            .patch(`/categories/${createResponse.body.result.category_id}`)
            .send({
                newName: 'newName',
            })
            .set('Cookie', [loginResponse.headers['set-cookie']])

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            result: {
                name: 'newName',
                category_id: createResponse.body.result.category_id,
            },
        })
    })
})

describe('Update category fail test', () => {
    describe('URL Parameters related', () => {
        test('Invalid param type', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/two`)
                .send({
                    newName: 'newName',
                })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['Category ID must be a number'],
            })
        })
        test('Used 0 in params', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/0`)
                .send({
                    newName: 'newName',
                })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['0 is not a valid Category ID'],
            })
        })
    })
    describe('User related', () => {
        test('User is not logged in', async () => {
            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })

            expect(createResponse.status).toBe(401)
            expect(createResponse.body).toEqual({
                error: 'User is not logged in',
            })
        })
    })
    describe('Input related', () => {
        test('inputted name is the same', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/${createResponse.body.result.category_id}`)
                .send({
                    newName: 'category',
                })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: 'That name is already in use',
            })
        })
        test('category does not exist', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(
                    `/categories/${createResponse.body.result.category_id + 1}`
                )
                .send({
                    newName: 'category',
                })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(404)
            expect(response.body).toEqual({
                error: 'Resource not found',
            })
        })
        test('Input is empty', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/${createResponse.body.result.category_id}`)
                .send({})
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['Name of category is needed to create a category'],
            })
        })
        test('Input is of invalid type', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/${createResponse.body.result.category_id}`)
                .send({ newName: { invalidType: 'im invalid' } })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['Name must be a string'],
            })
        })
        test('Input is too short', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/${createResponse.body.result.category_id}`)
                .send({ newName: '' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['Name must not be empty'],
            })
        })
        test('Input is too long', async () => {
            const loginResponse = await supertest(app)
                .post('/profiles/login')
                .set('Content-type', 'application/json')
                .send({ email: 'user@gmail.com', password: 'password' })

            const createResponse = await supertest(app)
                .post('/categories/')
                .send({ name: 'category' })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(createResponse.status).toBe(201)

            const response = await supertest(app)
                .patch(`/categories/${createResponse.body.result.category_id}`)
                .send({
                    newName:
                        'b7Xj3hG98LmyE6vDAW2tRSsP0VNOZU4zQoJfMe1gKrcilCqnYBHTwxu5aFLpkasdwasdwasdwa',
                })
                .set('Cookie', [loginResponse.headers['set-cookie']])

            expect(response.status).toBe(400)
            expect(response.body).toEqual({
                error: ['Name must be below 64 characters'],
            })
        })
    })
})
