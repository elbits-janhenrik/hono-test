import { Hono } from 'hono'
import { getUsers, PaginationQuerySchema } from './user/get-users'
import { createUser, CreateUserSchema } from './user/create-user'
import { getUser, UserIdParamSchema } from './user/get-user'
import { zValidator } from '@hono/zod-validator'


// const UpdateUserSchema = CreateUserSchema.partial()



export function registerUserEndpoints(app: Hono) {
    // app.get('/api/user', (c) => {
    //     return c.json({
    //     id: 1,
    //     name: 'Jane Doe',
    //     active: true
    //     })
    // })

    // app.get('/users1', (c) => { 
    //     return c.json(
    //         {
    //             data: [
    //             { id: '1', name: 'Alice', email: 'alice@example.com' },
    //             { id: '2', name: 'Bob', email: 'bob@example.com' },
    //             ]
    //         }
    //     )
    // })

    app.get('/users', zValidator('query', PaginationQuerySchema), getUsers);

    app.post('/users', zValidator('json', CreateUserSchema), createUser);

    app.get('/users/:id', zValidator('param', UserIdParamSchema), getUser);

    // app.patch(
    //     '/users/:id',
    //     zValidator('param', UserIdParamSchema),
    //     zValidator('json', UpdateUserSchema),
    //     async (c) => {
    //     const { id } = c.req.valid('param')
    //     const updates = c.req.valid('json')

    //     return c.json({
    //         id,
    //         ...updates,
    //         updatedAt: new Date().toISOString(),
    //     })
    //     }
    // )

    // app.post(
    //     '/users/strict',
    //     zValidator('json', CreateUserSchema, (result, c) => {
    //     if (!result.success) {
    //         return c.json(
    //         {
    //             error: 'Validation failed',
    //             issues: result.error,
    //         },
    //         422
    //         )
    //     }
    //     }),
    //     async (c) => {
    //     const body = c.req.valid('json')
    //     return c.json({ success: true, data: body }, 201)
    //     }
    // )
}
