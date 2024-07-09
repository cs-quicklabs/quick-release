/*
  Warnings:

  - You are about to drop the column `releaseTags` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisationId` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MEMBER', 'USER');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_adminId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organisationId_fkey";

-- DropIndex
DROP INDEX "User_organisationId_key";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "releaseTags";

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "adminId",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "organisationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organisationId",
DROP COLUMN "role";

-- CreateTable
CREATE TABLE "OrganisationUsers" (
    "organisationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OrganisationUsers_pkey" PRIMARY KEY ("organisationId","userId")
);

-- CreateTable
CREATE TABLE "ProjectUsers" (
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "ProjectUsers_pkey" PRIMARY KEY ("userId","projectId")
);

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
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationUsers" ADD CONSTRAINT "OrganisationUsers_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganisationUsers" ADD CONSTRAINT "OrganisationUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTag" ADD CONSTRAINT "ReleaseTag_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTagOnLogs" ADD CONSTRAINT "ReleaseTagOnLogs_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTagOnLogs" ADD CONSTRAINT "ReleaseTagOnLogs_releaseTagId_fkey" FOREIGN KEY ("releaseTagId") REFERENCES "ReleaseTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
