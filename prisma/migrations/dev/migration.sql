-- STEP:1 Creating new tables without dropping the old tables

CREATE TABLE "UsersRoles" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE "Organizations" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,
    "name" TEXT NOT NULL
);

CREATE TABLE "OrganizationsUsers" (
    "organizationsId" INTEGER NOT NULL,
    "usersId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    PRIMARY KEY ("organizationsId", "usersId")
);

CREATE TABLE "Projects" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "createdById" INTEGER,
    "organizationsId" INTEGER
);

CREATE TABLE "ProjectsUsers" (
    "projectsId" INTEGER NOT NULL,
    "usersId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT false,
    PRIMARY KEY ("usersId", "projectsId", "roleId")
);

CREATE TABLE "Changelogs" (
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

CREATE TABLE "ReleaseTags" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationsId" INTEGER NOT NULL
);

CREATE TABLE "ChangelogReleaseTags" (
    "logId" INTEGER NOT NULL,
    "releaseTagId" INTEGER NOT NULL,
    PRIMARY KEY ("logId", "releaseTagId")
);

CREATE TABLE "ReleaseCategories" (
    "id" SERIAL PRIMARY KEY,
    "cuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "organizationsId" INTEGER NOT NULL
);

CREATE TABLE "ChangelogReleaseCategories" (
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
    org."id"::text AS "cuid", org."createdAt", org."updatedAt", u."id", org."name"
FROM "Organisation" org
JOIN "Users" u ON org."createdById" = u."cuid";

-- Copy data from OrganisationUsers table to new OrganizationsUsers table
INSERT INTO "OrganizationsUsers" (
    "organizationsId", "usersId", "isActive"
)
SELECT
    org."id", u."id", false
FROM "OrganisationUsers" orgUser
JOIN "Organizations" org ON orgUser."organisationId" = org."cuid"
JOIN "Users" u ON orgUser."userId" = u."cuid";

-- Copy data from old Project table to new Projects table
INSERT INTO "Projects" (
    "cuid", "createdAt", "updatedAt", "name", "createdById", "organizationsId"
)
SELECT
    p."id"::text AS "cuid", p."createdAt", p."updatedAt", p."name", u."id", org."id"
FROM "Project" p
JOIN "Users" u ON p."createdById" = u."cuid"
JOIN "Organizations" org ON p."organisationId" = org."cuid";

-- Copy data from ProjectsUsers table to new ProjectsUsers table
INSERT INTO "ProjectsUsers" (
    "projectsId", "usersId", "roleId", "isActive"
)
SELECT
    p."id", u."id", 1, false
FROM "ProjectUsers" pu
JOIN "Projects" p  ON pu."projectId" = p."cuid"
JOIN "Users" u ON pu."userId" = u."cuid";

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

-- Copy data from old ReleaseTag table to new ReleaseTags table
INSERT INTO "ReleaseTags" (
    "cuid", "createdAt", "updatedAt", "name", "code", "organizationsId"
)
SELECT
    rt."id"::text AS "cuid", rt."createdAt", rt."updatedAt", rt."name", rt."code", org."id"
FROM "ReleaseTag" rt
JOIN "Organizations" org ON rt."organisationId" = org."cuid";

-- Copy data from old ReleaseTagOnLogs table to new ChangeLogReleaseTags table
INSERT INTO "ChangelogReleaseTags" (
    "logId", "releaseTagId"
)
SELECT
    ch."id", rt."id"
FROM "ReleaseTagOnLogs" rtlogs
JOIN "Changelogs" ch ON rtlogs."logId" = ch."cuid"::text
JOIN "ReleaseTags" rt ON rtlogs."releaseTagId" = rt."id";

-- Copy data from old ReleaseCategory table to new ReleaseCategories table
INSERT INTO "ReleaseCategories" (
    "cuid", "createdAt", "updatedAt", "name", "code", "organizationsId"
)
SELECT
    rc."id"::text AS "cuid", rc."createdAt", rc."updatedAt", rc."name", rc."code", org."id"
FROM "ReleaseCategory" rc
JOIN "Organizations" org ON rc."organisationId" = org."cuid";

-- Copy data from old ReleaseCategoryOnLogs table to new ChangelogReleaseCategories table
INSERT INTO "ChangelogReleaseCategories" (
    "logId", "releaseCategoryId"
)
SELECT
    ch."id", rc."id"
FROM "ReleaseCategoryOnLogs" rclogs
JOIN "Changelogs" ch ON rclogs."logId" = ch."cuid"::text
JOIN "ReleaseCategories" rc ON rclogs."releaseCategoryId" = rc."id";


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
