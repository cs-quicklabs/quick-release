/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `releaseTags` on the `Log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "isArchived",
DROP COLUMN "releaseTags",
ADD COLUMN     "archivedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ReleaseTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organisationId" TEXT NOT NULL,

    CONSTRAINT "ReleaseTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseTagOnLogs" (
    "logId" TEXT NOT NULL,
    "releaseTagId" INTEGER NOT NULL,

    CONSTRAINT "ReleaseTagOnLogs_pkey" PRIMARY KEY ("logId","releaseTagId")
);

-- AddForeignKey
ALTER TABLE "ReleaseTag" ADD CONSTRAINT "ReleaseTag_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTagOnLogs" ADD CONSTRAINT "ReleaseTagOnLogs_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTagOnLogs" ADD CONSTRAINT "ReleaseTagOnLogs_releaseTagId_fkey" FOREIGN KEY ("releaseTagId") REFERENCES "ReleaseTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
