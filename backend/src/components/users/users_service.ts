
import { Prisma } from "@prisma/client";
import { CustomError } from "../../middleware/errors/CustomError";
import prisma from "../../utils/db";
import { Profile, UserLoginData } from "./users_model";



class UserService {
  async getAllUsersProfile(): Promise<Profile[]> {
    try {
      return await prisma.profile.findMany({where:{isDelete:false}}) // ✅ Type assertion
    } catch (error) {

      throw new CustomError(error.message, 500);
    }
  }
  async getUserProfile(id: string): Promise<Profile> {
    try {
      return await prisma.profile.findFirst({ where: { user_id: id,isDelete:false } })
    } catch (error) {
      throw new CustomError(error.message, 500);
    }
  }

  async updateProfileById(id: string, data: Partial<Profile>) {
    try {
      let {dob, ...updateData } = data;
      
      
      return await prisma.profile.update({ where: { user_id: id ,isDelete:false}, data: {
        dob:new Date(dob),
        ...updateData
      } as Prisma.ProfileUpdateInput, })
    } catch (error) {
      throw new CustomError(error.message, 500)
    }
  }

  
  async softDeleteUser(userId: string) {
    try {
      await prisma.$transaction([
        // ✅ Soft delete user
        prisma.userLoginData.updateMany({
          where: { user_id: userId },
          data: { isDelete: true },
        }),
  
        // ✅ Soft delete profile
        prisma.profile.updateMany({
          where: { user_id: userId },
          data: { isDelete: true },
        }),
  
      
  
        // ✅ Soft delete other tables where user_id exists (add as needed)
      ]);
  
      return true;
    } catch (error) {
      console.error("Error soft deleting user:", error);
      throw new Error("Failed to soft delete user.");
    }
  }
  
  async restoreUser(userId: string): Promise<void> {
    await prisma.$transaction([
      prisma.userLoginData.updateMany({
        where: { user_id: userId },
        data: { isDelete: false },
      }),
      prisma.profile.updateMany({
        where: { user_id: userId },
        data: { isDelete: false },
      }),
      
    ]);
  
    console.log(`User ${userId} restored successfully.`);
  }
  
  async getUserByEmail(email: string): Promise<UserLoginData> {
    try {
      let response = await prisma.userLoginData.findFirst({
        where: { email,isDelete:false }
      })

      return response
    } catch (error) {
      throw new CustomError(error.name, 500)
    }

  }

  async getUserById(id: string): Promise<UserLoginData> {
    try {
      let response = await prisma.userLoginData.findFirst({
        where: { user_id: id,isDelete:false }
      })

      return response
    } catch (error) {
      throw new CustomError(error.name, 500)
    }

  }

  async updateUserById(id: string, data: Partial<UserLoginData>): Promise<UserLoginData> {
    try {
      // Exclude 'profile' from data as Prisma expects a specific format for relations
      const { profile, ...updateData } = data;

      // Perform the update operation
      let user = await prisma.userLoginData.update({
        where: { user_id: id,isDelete:false },
        data: updateData as Prisma.UserLoginDataUpdateInput, // ✅ Ensure proper Prisma update format
      });

      return user;
    } catch (error) {
      throw new CustomError(error.message, 500);
    }
  }
  async getUserByEmailPass(email: string, hashed_password: string): Promise<UserLoginData> {
    try {
      let res = await prisma.userLoginData.findFirst({
        where: {
          email, hashed_password,isDelete:false
        }
      })
      return res;
    } catch (error) {
      throw new CustomError(error.name, 500)
    }
  }

  async createProfile(profileData: Profile) {
    try {


      return await prisma.profile.create({
        data: {
          user_id: profileData.user_id,
          email: profileData.email,
          firstname: profileData.firstname,
          lastname: profileData.lastname,
          phone: profileData.phone,
          dob: new Date(profileData.dob), // ✅ Ensure Date format
          gender: profileData.gender,
        }
      });
    } catch (error) {

      throw new CustomError(error.message, 500);
    }
  }


  async createUser(email: string, hashed_password: string): Promise<UserLoginData> {
    try {


      return await prisma.userLoginData.create({
        data: {
          email, hashed_password
        },
      });
    } catch (error) {
      throw new CustomError(error.name, 500)

    }
  }
}

export default new UserService();
