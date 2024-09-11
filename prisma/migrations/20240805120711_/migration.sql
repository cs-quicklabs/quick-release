-- Check if the ENUM type 'FeedbackStatus' exists, and create if not
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'FeedbackStatus') THEN
        CREATE TYPE "FeedbackStatus" AS ENUM ('IN_REVIEW', 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');
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
            "visibilityStatus" TEXT NOT NULL DEFAULT 'private',
            CONSTRAINT "FeedbackPosts_pkey" PRIMARY KEY ("id")
        );
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

-- CreateTable ReleaseTagsOnFeedbacks if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'ReleaseTagsOnFeedbacks') THEN
        CREATE TABLE "ReleaseTagsOnFeedbacks" (
            "feedbackId" INTEGER NOT NULL,
            "releaseTagId" INTEGER NOT NULL,
            CONSTRAINT "ReleaseTagsOnFeedbacks_pkey" PRIMARY KEY ("feedbackId", "releaseTagId")
        );
    END IF;
END $$;

-- CreateTable UpvotedFeedbacksByUsers if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'UpvotedFeedbacksByUsers') THEN
        CREATE TABLE "UpvotedFeedbacksByUsers" (
            "feedbackId" INTEGER NOT NULL,
            "usersId" INTEGER NOT NULL,
            CONSTRAINT "UpvotedFeedbacksByUsers_pkey" PRIMARY KEY ("feedbackId", "usersId")
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

-- AlterTable Projects (rename column and add unique constraint) if needed
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Projects' AND column_name = 'slug') THEN
        ALTER TABLE "Projects" ADD COLUMN "slug" TEXT;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Projects' AND column_name = 'slug') THEN
        UPDATE "Projects" SET "slug" = "name";
    END IF;
END $$;

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

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackPosts_feedbackBoardsId_fkey') THEN
        ALTER TABLE "FeedbackPosts" ADD CONSTRAINT "FeedbackPosts_feedbackBoardsId_fkey" FOREIGN KEY ("feedbackBoardsId") REFERENCES "FeedbackBoards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'FeedbackBoards_projectsId_fkey') THEN
        ALTER TABLE "FeedbackBoards" ADD CONSTRAINT "FeedbackBoards_projectsId_fkey" FOREIGN KEY ("projectsId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'ReleaseTagsOnFeedbacks_feedbackId_fkey') THEN
        ALTER TABLE "ReleaseTagsOnFeedbacks" ADD CONSTRAINT "ReleaseTagsOnFeedbacks_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "FeedbackPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'ReleaseTagsOnFeedbacks_releaseTagId_fkey') THEN
        ALTER TABLE "ReleaseTagsOnFeedbacks" ADD CONSTRAINT "ReleaseTagsOnFeedbacks_releaseTagId_fkey" FOREIGN KEY ("releaseTagId") REFERENCES "ReleaseTags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'UpvotedFeedbacksByUsers_feedbackId_fkey') THEN
        ALTER TABLE "UpvotedFeedbacksByUsers" ADD CONSTRAINT "UpvotedFeedbacksByUsers_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "FeedbackPosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'UpvotedFeedbacksByUsers_usersId_fkey') THEN
        ALTER TABLE "UpvotedFeedbacksByUsers" ADD CONSTRAINT "UpvotedFeedbacksByUsers_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
