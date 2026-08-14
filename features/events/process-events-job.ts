export async function startEventProcessor() {
  void (async () => {
    while (true) {
      await processPendingJobs();
      await new Promise(r => setTimeout(r, 10000));
    }
  })();
}

async function processPendingJobs() {
    console.log("Processing pending jobs...");
}