-- STEP:1 Craeting new tables without droping the old tables
CREATE TABLE "UserRoles" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create new Users table
CREATE TABLE "Users" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profilePicture" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiry" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "isVerified" BOOLEAN DEFAULT false,
    "verificationToken" TEXT,
    "verificationTokenExpiry" TEXT
);

-- Create new Organizations table
CREATE TABLE "Organizations" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "name" TEXT NOT NULL
);

-- Create OrganizationUsers table
CREATE TABLE "OrganizationUsers" (
    "organisationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    PRIMARY KEY ("organisationId", "userId")
);

-- Create new Projects table
CREATE TABLE "Projects" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "createdById" INTEGER,
    "organisationId" INTEGER
);

-- Create ProjectUsers table
CREATE TABLE "ProjectUsers" (
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    PRIMARY KEY ("userId", "projectId", "roleId")
);

-- Create new ChangeLogs table
CREATE TABLE "ChangeLogs" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseVersion" TEXT NOT NULL,
    "projectId" INTEGER,
    "scheduledTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3)
);

-- Create ReleaseTags table
CREATE TABLE "ReleaseTags" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organisationId" INTEGER NOT NULL
);

-- Create ChangeLogReleaseTags table
CREATE TABLE "ChangeLogReleaseTags" (
    "logId" INTEGER NOT NULL,
    "releaseTagId" INTEGER NOT NULL,
    PRIMARY KEY ("logId", "releaseTagId")
);

-- Create ReleaseCategories table
CREATE TABLE "ReleaseCategories" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organisationId" INTEGER NOT NULL
);

-- Create ChangeLogReleaseCategories table
CREATE TABLE "ChangeLogReleaseCategories" (
    "logId" INTEGER NOT NULL,
    "releaseCategoryId" INTEGER NOT NULL,
    PRIMARY KEY ("logId", "releaseCategoryId")
);






INSERT INTO "UserRoles" ("name", "code")
VALUES
    ('SuperAdmin', 'SUPER_ADMIN'),
    ('Admin', 'ADMIN'),
    ('Member', 'MEMBER');

-- STEP:2 Copy data from old User table to new User table
INSERT INTO "Users" (
    "cuid", "createdAt", "updatedAt", "firstName", "lastName", "profilePicture",
    "email", "password", "resetToken", "resetTokenExpiry", "isActive", "isVerified",
    "verificationToken", "verificationTokenExpiry"
)
SELECT
    "id"::text AS "cuid", "createdAt", "updatedAt", "firstName", "lastName", "profilePicture",
    "email", "password", "resetToken", "resetTokenExpiry", "isActive", "isVerified",
    "verificationToken", "verificationTokenExpiry"
FROM "User";

-- Copy data from old Organisation table to new Organizations table
INSERT INTO "Organizations" (
    "cuid", "createdAt", "updatedAt", "createdById", "name"
)
SELECT
    org."id"::text AS "cuid", org."createdAt", org."updatedAt", u."id", org."name"
FROM "Organisation" org
JOIN "Users" u ON org."createdById" = u."cuid";

-- Copy data from OrganisationUsers table to new OrganizationUsers table
INSERT INTO "OrganizationUsers" (
    "organisationId", "userId", "isActive"
)
SELECT
    org."id", u."id", false
FROM "OrganisationUsers" orgUser
JOIN "Organizations" org ON orgUser."organisationId" = org."cuid"
JOIN "Users" u ON orgUser."userId" = u."cuid";

-- Copy data from old Project table to new Projects table
INSERT INTO "Projects" (
    "cuid", "createdAt", "updatedAt", "name", "createdById", "organisationId"
)
SELECT
    p."id"::text AS "cuid", p."createdAt", p."updatedAt", p."name", u."id", org."id"
FROM "Project" p
JOIN "Users" u ON p."createdById" = u."cuid"
JOIN "Organizations" org ON p."organisationId" = org."cuid";

-- Copy data from ProjectUsers table to new ProjectsUsers table
INSERT INTO "ProjectUsers" (
    "projectId", "userId", "roleId", "isActive"
)
SELECT
    "Projects"."id", "Users"."id", 1, false
FROM "ProjectUsers"
JOIN "Projects" ON "ProjectUsers"."projectId" = "Projects"."cuid"
JOIN "Users" ON "ProjectUsers"."userId" = "Users"."cuid";


-- Copy data from old Log table to new ChangeLogs table
INSERT INTO "ChangeLogs" (
    "cuid", "createdAt", "updatedAt", "title", "description", "releaseVersion",
    "projectsId", "scheduledTime", "status", "createdById", "updatedById", "deletedAt", "archivedAt"
)
SELECT
    l."id"::text AS "cuid", l."createdAt", l."updatedAt", l."title", l."description", l."releaseVersion",
    p."id", l."scheduledTime", l."status", u."id", u."id", "deletedAt", "archivedAt"
FROM "Log" l
JOIN "Projects" p ON l."createdById" = p."cuid";
JOIN "Users" u ON l."createdById" = u."cuid";

-- Copy data from old ReleaseTag table to new ReleaseTags table
INSERT INTO "ReleaseTags" (
    "cuid", "createdAt", "updatedAt", "name", "code", "organizationsId"
)
SELECT
    rt."id"::text AS "cuid", rt."createdAt", rt."updatedAt", rt."name", rt."code", org."id"
FROM "ReleaseTag" rt
JOIN "Organizations" org ON rt."organisationId" = org."cuid";

-- Copy data from old ReleaseTagOnLogs table to new ChangeLogReleaseTags table
INSERT INTO "ChangeLogReleaseTags" (
    "logId", "releaseTagId"
)
SELECT
    "ChangeLogs"."id", "ReleaseTags"."id"
FROM "ReleaseTagOnLog"
JOIN "ChangeLogs" ON "ReleaseTagOnLog"."logId" = "ChangeLogs"."cuid"
JOIN "ReleaseTags" ON "ReleaseTagOnLog"."releaseTagId" = "ReleaseTags"."cuid";

-- Copy data from old ReleaseTag table to new ReleaseTags table
INSERT INTO "ReleaseCategories" (
    "cuid", "createdAt", "updatedAt", "name", "code", "organizationsId"
)
SELECT
    rt."id"::text AS "cuid", rt."createdAt", rt."updatedAt", rt."name", rt."code", org."id"
FROM "ReleaseCategory" rt
JOIN "Organizations" org ON rt."organisationId" = org."cuid";

-- Copy data from old ReleaseTagOnLogs table to new ChangeLogReleaseTags table
INSERT INTO "ChangeLogReleaseCategories" (
    "logId", "releaseCategoryId"
)
SELECT
    "ChangeLogs"."id", "ReleaseCategories"."id"
FROM "ReleaseCategoryOnLogs"
JOIN "ChangeLogs" ON "ReleaseCategoryOnLogs"."logId" = "ChangeLogs"."cuid"
JOIN "ReleaseCategories" ON "ReleaseCategoryOnLogs"."releaseCategoryId" = "ReleaseCategories"."cuid";






-- Add constraints and foreign keys to the new tables

-- Users table constraints
ALTER TABLE "Users" ADD CONSTRAINT "Users_email_key" UNIQUE ("email");
ALTER TABLE "Users" ADD CONSTRAINT "Users_resetToken_key" UNIQUE ("resetToken");
ALTER TABLE "Users" ADD CONSTRAINT "Users_verificationToken_key" UNIQUE ("verificationToken");

-- Organizations table constraints
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Projects table constraints
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ChangeLogs table constraints
ALTER TABLE "ChangeLogs" ADD CONSTRAINT "ChangeLogs_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ChangeLogs" ADD CONSTRAINT "ChangeLogs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChangeLogs" ADD CONSTRAINT "ChangeLogs_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- OrganizationUsers table constraints
ALTER TABLE "OrganizationUsers" ADD CONSTRAINT "OrganizationUsers_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrganizationUsers" ADD CONSTRAINT "OrganizationUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ProjectUsers table constraints
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectUsers" ADD CONSTRAINT "ProjectUsers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON

