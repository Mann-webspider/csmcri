-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "UserLoginData"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
