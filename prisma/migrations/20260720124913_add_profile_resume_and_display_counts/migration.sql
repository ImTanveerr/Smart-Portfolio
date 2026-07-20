-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "postsCount" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "projectsCount" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "resumeUrl" TEXT;
