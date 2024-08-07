/*
  Warnings:

  - Changed the type of `contest` on the `sust_cp_lab_teams` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "sust_cp_lab_teams" DROP COLUMN "contest",
ADD COLUMN     "contest" INTEGER NOT NULL;
