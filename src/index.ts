import { Hono as App } from 'hono'
import { serve } from '@hono/node-server'
import { registerRoutes } from './routes'
import { startEventProcessor } from './features/events/process-events-job';
import { registerTelemetry, stopTelemetry, startTelemetry } from './middleware/telemetry';

const app = new App();

startTelemetry();
registerTelemetry(app);
registerRoutes(app);

const eventController = startEventProcessor();

const onShutdown = () => {
  console.log('Shutdown requested — stopping background jobs');
  try {
    eventController.abort();
  } catch (err) {
    console.error('Error aborting event processor', err);
  }
  stopTelemetry().catch(err => console.error('Error shutting down telemetry', err));
};

process.on('SIGINT', onShutdown);
process.on('SIGTERM', onShutdown);

serve({
  fetch: app.fetch,
  port: 3334,
})
