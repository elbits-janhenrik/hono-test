import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { registerRoutes } from './routes'

const app = new Hono()

registerRoutes(app)

serve({
  fetch: app.fetch,
  port: 3334,
})