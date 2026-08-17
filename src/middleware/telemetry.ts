import { Hono as App } from 'hono'
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { trace } from '@opentelemetry/api';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

export const tracerName = process.env.OTEL_SERVICE_NAME || 'hono-test';


const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
});

export async function registerTelemetry(app: App) {
  const tracer = trace.getTracer(tracerName);
  app.use("*", async (c, next) => {
    const span = tracer.startSpan(`${c.req.method} ${c.req.url}`);
    const start = Date.now();
    try {
      await next();
      span.setAttribute("http.status_code", c.res.status || 200);
    } catch (err) {
      span.recordException(err as Error);
      span.setAttribute("error", true);
      throw err;
    } finally {
      span.setAttribute("http.duration_ms", Date.now() - start);
      span.end();
    }
  });
}

export async function startTelemetry() {
  try {
    await sdk.start();
    console.log('OpenTelemetry started');
  } catch (err) {
    console.error('Failed to start OpenTelemetry', err);
  }
}

export async function stopTelemetry() {
  try {
    await sdk.shutdown();
    console.log('OpenTelemetry shut down');
  } catch (err) {
    console.error('Error shutting down OpenTelemetry', err);
  }
}

