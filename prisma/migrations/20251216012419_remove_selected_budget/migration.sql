/*
  Warnings:

  - You are about to drop the column `selectedBudgetId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_selectedBudgetId_fkey";

-- DropIndex
DROP INDEX "user_selectedBudgetId_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "selectedBudgetId";
