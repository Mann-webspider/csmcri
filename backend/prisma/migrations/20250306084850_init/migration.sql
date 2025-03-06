-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserLoginData" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;
