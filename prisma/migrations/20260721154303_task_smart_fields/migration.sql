/*
  Warnings:

  - You are about to drop the column `date` on the `Task` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropIndex
DROP INDEX "Task_date_idx";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "date",
ADD COLUMN     "dueDate" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Task_dueDate_idx" ON "Task"("dueDate");
