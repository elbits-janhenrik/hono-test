-- CreateTable
CREATE TABLE "EventInbox" (
    "id" SERIAL NOT NULL,
    "eventType" TEXT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInbox_pkey" PRIMARY KEY ("id")
);
