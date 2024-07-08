/*
  Warnings:

  - Added the required column `createdById` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "releaseCategories" TEXT[],
ADD COLUMN     "schemaTime" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "updatedById" TEXT NOT NULL,
ALTER COLUMN "releaseTags" SET DATA TYPE TEXT[];

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
