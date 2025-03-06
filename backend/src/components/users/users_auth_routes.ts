import express from "express";
import UserController from "./users_controller";
import { verifyToken } from "../../middleware/authMiddleware";
import { validateRequest } from "../../middleware/validateRequest";
import { changePasswordValidation, forgotPasswordValidation, loginValidation, registerValidation, resetPasswordValidation } from "../../utils/validation";

const router = express.Router();

router.post("/login", validateRequest(loginValidation), UserController.login);
router.post("/register", validateRequest(registerValidation), UserController.register);
router.get("/test", verifyToken, UserController.getUser);
router.post("/change-password", validateRequest(changePasswordValidation), verifyToken, UserController.changePassword);
router.post("/forgot", validateRequest(forgotPasswordValidation), UserController.forgotPassword);
router.post("/reset", validateRequest(resetPasswordValidation), UserController.resetPassword);


export default router;
