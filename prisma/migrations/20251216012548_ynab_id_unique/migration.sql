/*
  Warnings:

  - A unique constraint covering the columns `[ynabId]` on the table `budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "budget_ynabId_key" ON "budget"("ynabId");
