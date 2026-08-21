import 'dotenv/config'
import { Hono as App } from 'hono'
import { serve } from '@hono/node-server'

import { setupApi } from './setup-api'
import { startBackgroundWorker } from './features/jobs/background-worker';
import { registerTelemetry, stopTelemetry, startTelemetry } from './middleware/telemetry';
import { startEventInboxListener } from './features/event-inbox/event-inbox-processor';


startTelemetry();

const app = new App();

registerTelemetry(app);

setupApi(app);

const backgroundWorker = startBackgroundWorker();

startEventInboxListener()

const onShutdown = () => {
  console.log('Shutdown requested — stopping background jobs');
  try {
    backgroundWorker.abort();
  } catch (err) {
    console.error('Error aborting event processor', err);
  }
  try {
    stopTelemetry();
  } catch (err) {
    console.error('Error stopping telemetry', err);
  }
};

process.on('SIGINT', onShutdown);
process.on('SIGTERM', onShutdown);

serve({
  fetch: app.fetch,
  port: 3334,
})
