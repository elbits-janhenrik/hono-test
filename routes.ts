import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { registerUserEndpoints } from './features/register-endpoints'


export function registerRoutes(app: Hono) {
  app.get('/', (c) => {
    return c.json({ message: 'Hono + Zod API is running' })
  })


  registerUserEndpoints(app)


  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }

    console.error(err)
    return c.json({ error: 'Internal Server Error' }, 500)
  })
}
