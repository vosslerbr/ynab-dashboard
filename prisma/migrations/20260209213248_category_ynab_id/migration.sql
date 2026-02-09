/*
  Warnings:

  - A unique constraint covering the columns `[budgetId,ynabId]` on the table `category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ynabId` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "ynabId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "category_budgetId_ynabId_key" ON "category"("budgetId", "ynabId");
