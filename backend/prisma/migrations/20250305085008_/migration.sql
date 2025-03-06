/*
  Warnings:

  - You are about to drop the column `DOB` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "DOB",
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
