-- CreateEnum
CREATE TYPE "TaskRecurrence" AS ENUM ('NONE', 'DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "recurrence" "TaskRecurrence" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "seriesId" TEXT,
ADD COLUMN     "startTime" TEXT;

-- CreateIndex
CREATE INDEX "Task_seriesId_idx" ON "Task"("seriesId");
