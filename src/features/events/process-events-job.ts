export function startEventProcessor(): AbortController {
  const controller = new AbortController();
  const { signal } = controller;

  const sleep = (ms: number, signal?: AbortSignal) =>
    new Promise<void>((resolve) => {
      const t = setTimeout(() => {
        cleanup();
        resolve();
      }, ms);
      const onAbort = () => {
        clearTimeout(t);
        cleanup();
        resolve();
      };
      function cleanup() {
        signal?.removeEventListener('abort', onAbort);
      }
      signal?.addEventListener('abort', onAbort);
    });

  void (async () => {
    while (!signal.aborted) {
      try {
        await processPendingJobs();
      } catch (err) {
        console.error('Error in event processor', err);
      }
      if (signal.aborted) break;
      await sleep(10000, signal);
    }
    console.log('Event processor stopped');
  })();

  return controller;
}

async function processPendingJobs() {
    console.log("Processing pending jobs...");
}
