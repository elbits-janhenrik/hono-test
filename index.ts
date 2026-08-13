import { Hono as App } from 'hono'
import { serve } from '@hono/node-server'
import { registerRoutes } from './routes'

const app = new App()

registerRoutes(app)

serve({
  fetch: app.fetch,
  port: 3334,
})