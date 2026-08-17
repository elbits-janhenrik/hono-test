import { Hono as App } from 'hono'
import { serve } from '@hono/node-server'
import { registerRoutes } from './routes'
import { startEventProcessor } from './features/events/process-events-job';
import { registerTelemetry, stopTelemetry, startTelemetry } from './middleware/telemetry';


startTelemetry();

const app = new App();

registerTelemetry(app);


registerRoutes(app);

const eventController = startEventProcessor();

const shutdown = () => {
  console.log('Shutdown requested — stopping background jobs');
  try {
    eventController.abort();
  } catch (err) {
    console.error('Error aborting event processor', err);
  }
  stopTelemetry().catch(err => console.error('Error shutting down telemetry', err));
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

serve({
  fetch: app.fetch,
  port: 3334,
})
