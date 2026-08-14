import { Hono as App } from 'hono'
import { serve } from '@hono/node-server'
import { registerRoutes } from './routes'
import { startEventProcessor } from './features/events/process-events-job';

const app = new App();

registerRoutes(app);

startEventProcessor();

serve({
  fetch: app.fetch,
  port: 3334,
})