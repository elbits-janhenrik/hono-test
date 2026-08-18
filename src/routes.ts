import { Hono as App } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { registerUserEndpoints, registerFileEndpoints, registerScalarDocs } from './features/register-endpoints'


export function registerRoutes(app: App) {
  app.get('/', (c) => {
    return c.json({ message: 'Hono + Zod API is running' })
  })


  registerUserEndpoints(app);

  registerFileEndpoints(app);

  registerScalarDocs(app);

  app.onError((err, c) => {
    if (err instanceof HTTPException) {
      return err.getResponse()
    }

    console.error(err)
    return c.json({ error: 'Internal Server Error' }, 500)
  })
}
