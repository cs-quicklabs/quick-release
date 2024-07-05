/*
  Warnings:

  - You are about to drop the column `schemaTime` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "schemaTime",
ADD COLUMN     "scheduledTime" TIMESTAMP(3);
