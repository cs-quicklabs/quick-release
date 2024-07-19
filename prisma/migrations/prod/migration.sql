-- DROP TABLE IF EXISTS "UsersRoles", "Users", "Organizations", "Projects", "OrganizationsUsers", "ProjectsUsers", "Changelogs", "ReleaseTags", "ReleaseCategories", "ChangelogReleaseTags", "ChangelogReleaseCategories" CASCADE;
CREATE TABLE IF NOT EXISTS "UsersRoles" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Users" (
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

CREATE TABLE IF NOT EXISTS "Organizations" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "name" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "OrganizationsUsers" (
    "organizationsId" INTEGER NOT NULL,
    "usersId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    PRIMARY KEY ("organizationsId", "usersId")
);

CREATE TABLE IF NOT EXISTS "Projects" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "createdById" INTEGER,
    "organizationsId" INTEGER
);

CREATE TABLE IF NOT EXISTS "ProjectsUsers" (
    "projectsId" INTEGER NOT NULL,
    "usersId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    PRIMARY KEY ("usersId", "projectsId", "roleId")
);

CREATE TABLE IF NOT EXISTS "Changelogs" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseVersion" TEXT NOT NULL,
    "projectsId" INTEGER,
    "scheduledTime" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "updatedById" INTEGER NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS "ReleaseTags" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationsId" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "ChangelogReleaseTags" (
    "logId" INTEGER NOT NULL,
    "releaseTagId" INTEGER NOT NULL,
    PRIMARY KEY ("logId", "releaseTagId")
);

CREATE TABLE IF NOT EXISTS "ReleaseCategories" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationsId" INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS "ChangelogReleaseCategories" (
    "logId" INTEGER NOT NULL,
    "releaseCategoryId" INTEGER NOT NULL,
    PRIMARY KEY ("logId", "releaseCategoryId")
);

-- Insert role data
INSERT INTO "UsersRoles" ("name", "code")
VALUES
    ('SuperAdmin', 'SUPER_ADMIN'),
    ('Admin', 'ADMIN'),
    ('Member', 'MEMBER');

-- STEP:2 Copy data from old tables to new tables

-- Copy data from old User table to new User table
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
    org."id"::text AS "cuid", org."createdAt", org."updatedAt", u2."id", org."name"
FROM "Organisation" org
JOIN "User" u ON org."id" = u."organisationId"
JOIN "Users" u2 ON u."id" = u2."cuid";

-- Copy data from OrganisationUsers table to new OrganizationsUsers table
INSERT INTO "OrganizationsUsers" (
    "organizationsId", "usersId", "isActive"
)
SELECT
    org."id", u."id", false
FROM "Organizations" org
JOIN "Users" u ON org."createdById" = u."id";

-- Copy data from old Project table to new Projects table
INSERT INTO "Projects" (
    "cuid", "createdAt", "updatedAt", "name", "createdById", "organizationsId"
)
SELECT
    p."id"::text AS "cuid", p."createdAt", p."updatedAt", p."name", u."id", org."id"
FROM "Project" p
JOIN "Users" u ON p."adminId" = u."cuid"
JOIN "Organizations" org ON u."id" = org."createdById";

-- Copy data from ProjectsUsers table to new ProjectsUsers table
INSERT INTO "ProjectsUsers" (
    "projectsId", "usersId", "roleId", "isActive"
)
SELECT
    p."id", u."id", 1, false
FROM "Projects" p
JOIN "Users" u ON p."createdById" = u."id";

-- Copy data from old Log table to new Changelogs table
INSERT INTO "Changelogs" (
    "cuid", "createdAt", "updatedAt", "title", "description", "releaseVersion",
    "projectsId", "scheduledTime", "status", "createdById", "updatedById", "deletedAt", "archivedAt"
)
SELECT
    l."id"::text AS "cuid", l."createdAt", l."updatedAt", l."title", l."description", l."releaseVersion",
    p."id", l."scheduledTime", l."status", u."id", u."id", "deletedAt", "archivedAt"
FROM "Log" l
JOIN "Projects" p ON l."projectId" = p."cuid"
JOIN "Users" u ON l."createdById" = u."cuid";

-- Create ReleaseTags with cuid
INSERT INTO "ReleaseTags" (
    "cuid", "name", "code", "organizationsId"
)
VALUES
    (gen_random_uuid()::text, 'Web', 'web', 1),
    (gen_random_uuid()::text, 'Android', 'android', 1),
    (gen_random_uuid()::text, 'IOS', 'ios', 1);

-- Create ReleaseCategories with cuid
INSERT INTO "ReleaseCategories" (
    "cuid", "name", "code", "organizationsId"
)
VALUES
    (gen_random_uuid()::text, 'New', 'new', 1),
    (gen_random_uuid()::text, 'Improvement', 'improvement', 1),
    (gen_random_uuid()::text, 'Bug Fix', 'bug_fix', 1),
    (gen_random_uuid()::text, 'Maintenance', 'maintenance', 1),
    (gen_random_uuid()::text, 'Refactor', 'refactor', 1);


-- STEP:3 Add constraints and foreign keys to the new tables

-- Users table constraints
ALTER TABLE "Users" ADD CONSTRAINT "Users_email_key" UNIQUE ("email");
ALTER TABLE "Users" ADD CONSTRAINT "Users_resetToken_key" UNIQUE ("resetToken");
ALTER TABLE "Users" ADD CONSTRAINT "Users_verificationToken_key" UNIQUE ("verificationToken");

-- Organizations table constraints
ALTER TABLE "Organizations" ADD CONSTRAINT "Organizations_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Projects table constraints
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ChangeLogs table constraints
ALTER TABLE "Changelogs" ADD CONSTRAINT "Changelogs_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Changelogs" ADD CONSTRAINT "Changelogs_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Changelogs" ADD CONSTRAINT "Changelogs_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- OrganizationsUsers table constraints
ALTER TABLE "OrganizationsUsers" ADD CONSTRAINT "OrganizationsUsers_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrganizationsUsers" ADD CONSTRAINT "OrganizationsUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ReleaseTags table constraints
ALTER TABLE "ReleaseTags" ADD CONSTRAINT "ReleaseTags_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ReleaseCategories table constraints
ALTER TABLE "ReleaseCategories" ADD CONSTRAINT "ReleaseCategories_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "Organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ProjectsUsers table constraints
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ProjectsUsers" ADD CONSTRAINT "ProjectsUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ChangelogReleaseTags table constraints
ALTER TABLE "ChangelogReleaseTags" ADD CONSTRAINT "ChangelogReleaseTags_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Changelogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChangelogReleaseTags" ADD CONSTRAINT "ChangelogReleaseTags_releaseTagId_fkey" FOREIGN KEY ("releaseTagId") REFERENCES "ReleaseTags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ChangelogReleaseCategories table constraints
ALTER TABLE "ChangelogReleaseCategories" ADD CONSTRAINT "ChangelogReleaseCategories_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Changelogs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ChangelogReleaseCategories" ADD CONSTRAINT "ChangelogReleaseCategories_releaseCategoryId_fkey" FOREIGN KEY ("releaseCategoryId") REFERENCES "ReleaseCategories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
