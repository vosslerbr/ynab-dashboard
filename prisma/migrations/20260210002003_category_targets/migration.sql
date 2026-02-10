/*
  Warnings:

  - Added the required column `goal_overall_funded` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `goal_target` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "goal_overall_funded" BIGINT NOT NULL,
ADD COLUMN     "goal_target" BIGINT NOT NULL;
