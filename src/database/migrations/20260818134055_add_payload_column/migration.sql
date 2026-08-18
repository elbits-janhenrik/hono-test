/*
  Warnings:

  - Added the required column `Payload` to the `EventInbox` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EventInbox" ADD COLUMN     "Payload" JSONB NOT NULL;
