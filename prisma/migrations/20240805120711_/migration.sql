/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `organizationsId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `organizations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[organisationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organisationId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('IN_REVIEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');

-- CreateTable
CREATE TABLE "UsersRoles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UsersRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpiry" TEXT,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organizations" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER,
    "name" TEXT NOT NULL,

    CONSTRAINT "Organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationsUsers" (
    "organizationsId" INTEGER NOT NULL,
    "usersId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "OrganizationsUsers_pkey" PRIMARY KEY ("organizationsId","usersId")
);

-- CreateTable
CREATE TABLE "Projects" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" INTEGER,
    "organizationsId" INTEGER,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectsUsers" (
    "projectsId" INTEGER NOT NULL,
    "usersId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProjectsUsers_pkey" PRIMARY KEY ("usersId","projectsId","roleId")
);

-- CreateTable
CREATE TABLE "Changelogs" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseVersion" TEXT NOT NULL,
    "projectsId" INTEGER,
    "scheduledTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "Changelogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReleaseTags" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationsId" INTEGER NOT NULL,

    CONSTRAINT "ReleaseTags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangelogReleaseTags" (
    "logId" INTEGER NOT NULL,
    "releaseTagId" INTEGER NOT NULL,

    CONSTRAINT "ChangelogReleaseTags_pkey" PRIMARY KEY ("logId","releaseTagId")
);

-- CreateTable
CREATE TABLE "ReleaseCategories" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationsId" INTEGER NOT NULL,

    CONSTRAINT "ReleaseCategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangelogReleaseCategories" (
    "logId" INTEGER NOT NULL,
    "releaseCategoryId" INTEGER NOT NULL,

    CONSTRAINT "ChangelogReleaseCategories_pkey" PRIMARY KEY ("logId","releaseCategoryId")
);

-- CreateTable
CREATE TABLE "FeedbackPosts" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "FeedbackStatus" NOT NULL,
    "releaseETA" TIMESTAMP(3) NOT NULL,
    "createdById" INTEGER NOT NULL,
    "feedbackBoardsId" INTEGER NOT NULL,

    CONSTRAINT "FeedbackPosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackBoards" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "projectId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeedbackBoards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_cuid_key" ON "Users"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_resetToken_key" ON "Users"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "Users_verificationToken_key" ON "Users"("verificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "Organizations_cuid_key" ON "Organizations"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "Projects_cuid_key" ON "Projects"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "Changelogs_cuid_key" ON "Changelogs"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "ReleaseTags_cuid_key" ON "ReleaseTags"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "ReleaseCategories_cuid_key" ON "ReleaseCategories"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackPosts_cuid_key" ON "FeedbackPosts"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackBoards_cuid_key" ON "FeedbackBoards"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "User_organisationId_key" ON "User"("organisationId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationsUsers" ADD CONSTRAINT "OrganizationsUsers_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationsUsers" ADD CONSTRAINT "OrganizationsUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "UsersRoles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Changelogs" ADD CONSTRAINT "Changelogs_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Changelogs" ADD CONSTRAINT "Changelogs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Changelogs" ADD CONSTRAINT "Changelogs_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseTags" ADD CONSTRAINT "ReleaseTags_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogReleaseTags" ADD CONSTRAINT "ChangelogReleaseTags_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Changelogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogReleaseTags" ADD CONSTRAINT "ChangelogReleaseTags_releaseTagId_fkey" FOREIGN KEY ("releaseTagId") REFERENCES "ReleaseTags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReleaseCategories" ADD CONSTRAINT "ReleaseCategories_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogReleaseCategories" ADD CONSTRAINT "ChangelogReleaseCategories_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Changelogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangelogReleaseCategories" ADD CONSTRAINT "ChangelogReleaseCategories_releaseCategoryId_fkey" FOREIGN KEY ("releaseCategoryId") REFERENCES "ReleaseCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackPosts" ADD CONSTRAINT "FeedbackPosts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackPosts" ADD CONSTRAINT "FeedbackPosts_feedbackBoardsId_fkey" FOREIGN KEY ("feedbackBoardsId") REFERENCES "FeedbackBoards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackBoards" ADD CONSTRAINT "FeedbackBoards_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
