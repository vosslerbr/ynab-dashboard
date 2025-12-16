/*
  Warnings:

  - Added the required column `ynabId` to the `budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "budget" ADD COLUMN     "ynabId" TEXT NOT NULL;
