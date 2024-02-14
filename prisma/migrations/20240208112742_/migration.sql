/*
  Warnings:

  - The `releaseTags` column on the `Log` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Project_name_key";

-- AlterTable
ALTER TABLE "Log" DROP COLUMN "releaseTags",
ADD COLUMN     "releaseTags" JSONB[];
