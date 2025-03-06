import express from "express";
import UserController from "./users_controller";
import { verifyToken } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import { changePasswordValidation } from "../../utils/validation";
const router = express.Router();


router.post("/profile", verifyToken, UserController.profile) // create profile of user 
router.get("/me", verifyToken, UserController.getUserProfile) // get user profile
router.put("/me",verifyToken,UserController.updateUserProfile)
router.patch("/me/change-password", validateRequest(changePasswordValidation), verifyToken, UserController.changePassword);

router.delete("/delete",verifyToken,UserController.deleteUser) // admin only task
router.get("/profiles", verifyToken, UserController.getUsersProfile) // admin only get all users profile
export default router;
