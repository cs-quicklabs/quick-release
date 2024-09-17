-- Check if the ENUM type 'FeedbackStatus' exists, and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FeedbackStatus') THEN
        CREATE TYPE "FeedbackStatus" AS ENUM ('IN_REVIEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');
    END IF;
END $$;

-- Create the enum type VisibilityStatus if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'VisibilityStatus') THEN
        CREATE TYPE "VisibilityStatus" AS ENUM ('public', 'private');
    END IF;
END $$;

-- CreateTable FeedbackBoards if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FeedbackBoards') THEN
        CREATE TABLE "FeedbackBoards" (
            "id" SERIAL NOT NULL,
            "cuid" TEXT NOT NULL,
            "name" TEXT NOT NULL,
            "isDefault" BOOLEAN NOT NULL DEFAULT false,
            "projectsId" INTEGER,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            CONSTRAINT "FeedbackBoards_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable FeedbackPosts if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FeedbackPosts') THEN
        CREATE TABLE "FeedbackPosts" (
            "id" SERIAL NOT NULL,
            "cuid" TEXT NOT NULL,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL,
            "title" TEXT NOT NULL,
            "description" TEXT NOT NULL,
            "status" "FeedbackStatus" NOT NULL,
            "releaseETA" TIMESTAMP(3),
            "createdById" INTEGER,
            "deletedAt" TIMESTAMP(3),
            "feedbackBoardsId" INTEGER,
            "visibilityStatus" "VisibilityStatus" NOT NULL DEFAULT 'private',
            CONSTRAINT "FeedbackPosts_pkey" PRIMARY KEY ("id")
        );
    END IF;
END $$;

-- CreateTable FeedbackPostReleaseTags if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FeedbackPostReleaseTags') THEN
        CREATE TABLE "FeedbackPostReleaseTags" (
            "feedbackPostId" INTEGER NOT NULL,
            "releaseTagId" INTEGER NOT NULL,
            CONSTRAINT "FeedbackPostReleaseTags_pkey" PRIMARY KEY ("feedbackPostId", "releaseTagId")
        );
    END IF;
END $$;

-- CreateTable FeedbackPostVotes if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'FeedbackPostVotes') THEN
        CREATE TABLE "FeedbackPostVotes" (
            "feedbackPostId" INTEGER NOT NULL,
            "userId" INTEGER NOT NULL,
            CONSTRAINT "FeedbackPostVotes_pkey" PRIMARY KEY ("feedbackPostId", "userId")
        );
    END IF;
END $$;

-- CreateIndex FeedbackPosts_cuid_key if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'FeedbackPosts_cuid_key') THEN
        CREATE UNIQUE INDEX "FeedbackPosts_cuid_key" ON "FeedbackPosts"("cuid");
    END IF;
END $$;

-- CreateIndex FeedbackBoards_cuid_key if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'FeedbackBoards_cuid_key') THEN
        CREATE UNIQUE INDEX "FeedbackBoards_cuid_key" ON "FeedbackBoards"("cuid");
    END IF;
END $$;

-- Add 'slug' column if it does not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Projects' AND column_name = 'slug') THEN
        ALTER TABLE "Projects" ADD COLUMN "slug" TEXT;
    END IF;
END $$;

-- Copy data from 'name' to 'slug' for all records
DO $$
BEGIN
    UPDATE "Projects" SET "slug" = "name" WHERE "slug" IS NULL;
END $$;

-- Add a unique constraint on the 'slug' column if it doesn't already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'Projects_slug_unique') THEN
        ALTER TABLE "Projects" ADD CONSTRAINT "Projects_slug_unique" UNIQUE ("slug");
    END IF;
END $$;

-- Add new column 'projectImgUrl' to Projects if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Projects' AND column_name = 'projectImgUrl') THEN
        ALTER TABLE "Projects" ADD COLUMN "projectImgUrl" TEXT;
    END IF;
END $$;

-- AddForeignKey constraints if not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPosts_createdById_fkey') THEN
        ALTER TABLE "FeedbackPosts" ADD CONSTRAINT "FeedbackPosts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPosts_feedbackBoardsId_fkey') THEN
        ALTER TABLE "FeedbackPosts" ADD CONSTRAINT "FeedbackPosts_feedbackBoardsId_fkey" FOREIGN KEY ("feedbackBoardsId") REFERENCES "FeedbackBoards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackBoards_projectsId_fkey') THEN
        ALTER TABLE "FeedbackBoards" ADD CONSTRAINT "FeedbackBoards_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPostReleaseTags_feedbackPostId_fkey') THEN
        ALTER TABLE "FeedbackPostReleaseTags" ADD CONSTRAINT "FeedbackPostReleaseTags_feedbackPostId_fkey" FOREIGN KEY ("feedbackPostId") REFERENCES "FeedbackPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPostReleaseTags_releaseTagId_fkey') THEN
        ALTER TABLE "FeedbackPostReleaseTags" ADD CONSTRAINT "FeedbackPostReleaseTags_releaseTagId_fkey" FOREIGN KEY ("releaseTagId") REFERENCES "ReleaseTags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPostVotes_feedbackPostId_fkey') THEN
        ALTER TABLE "FeedbackPostVotes" ADD CONSTRAINT "FeedbackPostVotes_feedbackPostId_fkey" FOREIGN KEY ("feedbackPostId") REFERENCES "FeedbackPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPostVotes_userId_fkey') THEN
        ALTER TABLE "FeedbackPostVotes" ADD CONSTRAINT "FeedbackPostVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;

