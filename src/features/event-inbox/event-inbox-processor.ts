import createSubscriber from "pg-listen";

const subscriber = createSubscriber({
  connectionString: process.env.DATABASE_URL,
});

subscriber.notifications.on("app_events", (payload) => {
  console.log("Received:", payload);
});

subscriber.events.on("error", (error) => {
  console.error("Fatal listener error:", error);
  process.exit(1);
});

subscriber.events.on("reconnect", (attempt) => {
  console.log(`Reconnecting... attempt ${attempt}`);
});

export async function startEventInboxListener() {
  await subscriber.connect();
  await subscriber.listenTo("app_events");
  console.log("Listening on app_events");
}
      
// Publishing (can still use Prisma)
export async function publishEvent(payload: object) {
  await subscriber.notify("app_events", payload);
  // or with Prisma:
  // await prisma.$executeRaw`SELECT pg_notify('app_events', ${JSON.stringify(payload)})`;
}
