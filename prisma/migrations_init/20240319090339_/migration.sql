/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "isArchived",
ADD COLUMN     "archivedAt" TIMESTAMP(3);
