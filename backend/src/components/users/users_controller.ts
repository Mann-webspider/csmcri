import { NextFunction, Request, Response } from "express";
import UserService from "./users_service";
import { CustomError } from "../../middleware/errors/CustomError";
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { sendResetEmail } from "../../utils/emailSender";
import { StatusCodes } from "http-status-codes";



// Reuse the same interface for requests
interface AuthRequest extends Request {
    user?: { user_id: string };
}

// CONST VARIALBLE 
const EXPIRETOKEN = 1000 * 60 * 60 * 24;
const SECRET_KEY = process.env.JWT_SECRET;





class UserController {


    async register(req: Request, res: Response, next: NextFunction) {

        try {
            // grab details from request body
            let { email, password } = req.body


            // 🔹 Check if user already exists
            const existingUser = await UserService.getUserByEmail(email);

            if (existingUser) {
                throw new CustomError("user already exists", StatusCodes.CONFLICT)
            }


            // 🔹 Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            // store the User in database and respond back
            let response = await UserService.createUser(email, hashedPassword)

            res.status(StatusCodes.CREATED).json(response)


        } catch (error) {

            next(error)

        }

    }


    async login(req: Request, res: Response, next: NextFunction) {

        try {
            // grab details from request body
            let { email, password } = req.body


            // 🔹 Check if user already exists 
            let user = await UserService.getUserByEmail(email)
            if (!user) {
                throw new CustomError("user not found", StatusCodes.NOT_FOUND)
            }


            // Check the password from user and hashed password from database
            let checkPass = bcrypt.compareSync(password, user.hashed_password)
            if (!checkPass) {
                throw new CustomError("Unauthorized", StatusCodes.UNAUTHORIZED)
            }

            // create a oken and send it to user
            let token = jwt.sign({ user_id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: EXPIRETOKEN })

            //store jwt token in database
            user.jwt_token = token;
            let result = await UserService.updateUserById(user.user_id, user);
            res.cookie("session_token", token).status(StatusCodes.OK).json({ status: "Login Successfull" })
        } catch (error) {


            next(error)

        }
    }

    async getUser(req: Request, res: Response, next: NextFunction) {

        const user = (req as AuthRequest).user;
        
        res.json({ message: "User profile accessed!",user });
    }
    async getUserProfile(req: Request, res: Response, next: NextFunction) {
        try {
        const user = (req as AuthRequest).user;
        if(!user){
            throw new CustomError("User not found in request object",500)
        }
        let profile = await UserService.getUserProfile(user.user_id);
        if(!profile){
            throw new CustomError("Profile not found",StatusCodes.BAD_REQUEST)
        }
        res.json({ message: "User profile accessed!", profile });
        } catch (error) {
            next(error)
        }
        
    }

    async updateUserProfile(req:Request,res:Response,next:NextFunction){
        try {
            let userData = req.body;
            const user = (req as AuthRequest).user;
            if(!user){
                throw new CustomError("User not found in request object",500)
            }
            let result = await UserService.updateProfileById(user.user_id,userData)
            res.status(StatusCodes.CREATED).json(result)
        } catch (error) {
            next(error)
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("heelo i am in forget");

            // grab email from user
            let { email } = req.body;
            console.log(email);

            // check email is already exists
            let user = await UserService.getUserByEmail(email)
            if (!user) {
                throw new CustomError("user not found", StatusCodes.NOT_FOUND)
            }


            // generate a reset token and having expire of 2 min
            const resetToken: string = jwt.sign({ email: user.email, user_id: user.user_id },
                SECRET_KEY, {
                expiresIn: 1000 * 60 * 2, // expires in 2 min
            });


            // generate reset link with frontendUrl + forgot-password path + ?token=$resetToken
            //send email to user
            let isSend = await sendResetEmail(user.email, resetToken)
            if (!isSend) {
                throw new CustomError("Forget message didnt send", StatusCodes.INTERNAL_SERVER_ERROR)
            }


            // add reset token to the user row
            user.reset_token = resetToken
            let result = await UserService.updateUserById(user.user_id, user)

            //send success message
            res.status(StatusCodes.OK).json({ statusCode: 200, status: "successful", message: "reset email sended", token: resetToken })
        } catch (error) {
            next(error)
        }

    }

    public async changePassword(req: Request, res: Response, next: NextFunction):
        Promise<void> {
        try {
            // grab details from req
            const { oldPassword, newPassword } = req.body;
            const sessionUser = (req as AuthRequest).user


            // get user from database by session userId
            const findUserResult = await UserService.getUserById(sessionUser.user_id);
            if (!findUserResult) {

                throw new CustomError("User Not Found", StatusCodes.NOT_FOUND);
            }


            const user = findUserResult;
            // check requested user_id and session user_id is same
            if (user?.user_id !== sessionUser.user_id) {

                throw new CustomError("User can Change Only Own Password", StatusCodes.NO_CONTENT);
            }


            // verify old password is valid
            const comparePasswords = bcrypt.compareSync(oldPassword, user.hashed_password);
            if (!comparePasswords) {
                throw new CustomError("oldPassword is not matched", StatusCodes.UNAUTHORIZED)

            }


            // 🔹 Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);



            // Encrypt the user's new password
            user.hashed_password = hashedPassword
            const result = await UserService.updateUserById(sessionUser.user_id, user);
            if (result) {
                res.status(StatusCodes.OK).json({
                    statusCode: StatusCodes.OK, status: 'success',
                    message: 'Password is updated successfully'
                });
                return;
            } else {
                throw new CustomError(result.toString(), StatusCodes.INTERNAL_SERVER_ERROR)
            }
        } catch (error) {
            next(error)
        }

    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            // grab token from query and grab password and confirm password 
            let token: any = req.query.token
            let { password, confirmPassword } = req.body;


            // decode the reset token and extract user-id
            let tokenDecode: any = jwt.decode(token)
            console.log(tokenDecode);

            if (tokenDecode.exp < (new Date().getTime() + 1) / 1000) {
                throw new CustomError("Token is expired", StatusCodes.BAD_REQUEST)
            }

            // get user from database with user-id
            let user = await UserService.getUserById(tokenDecode.user_id);


            // 🔹 Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);


            // make a jwt token and assign to user object
            let jwtToken = jwt.sign(user, SECRET_KEY)



            // store the hashed password in user document
            user.hashed_password = hashedPassword;
            user.jwt_token = jwtToken;


            // save it to database
            let result = await UserService.updateUserById(user.user_id, user);
            if (!result) {
                throw new CustomError("Something went wrong", StatusCodes.INTERNAL_SERVER_ERROR)
            }

            res.status(StatusCodes.OK).cookie('session_token', jwtToken).json({ status: "Successful", message: "Password reset Successfully" })

        } catch (error) {
            next(error);
        }
    }


    async getUsersProfile(req: Request, res: Response,next:NextFunction) {
        try {
            const users = await UserService.getAllUsersProfile();
            res.json(users);
        } catch (error) {
            next(error)
        }
    }
    async deleteUser(req: Request, res: Response,next:NextFunction){
        try {
            let {user_id} = req.body;

            let isDelete = await UserService.softDeleteUser(user_id);
            if(!isDelete){
                throw new CustomError("Something went wrong", 500   )
            }
            res.status(StatusCodes.ACCEPTED).json({message:"user Deleted Successfully", status:"Successful"})
        } catch (error) {
            next(error)
        }
    }
    async profile(req: Request, res: Response, next: NextFunction):Promise<void> {
        try {

            // extract fields from req.body 
            let profile = req.body

            // get userId from req.user
            let user = (req as AuthRequest).user
            if (!user || !user.user_id) {
                throw new CustomError("Unauthorized. User ID is missing.",StatusCodes.UNAUTHORIZED)
            }



            // ✅ Extract user_id
            const { user_id } = user;


            // search user with userId and extract email
            let userData = await UserService.getUserById(user_id)
            if (!userData) {
                throw new CustomError("User not found.",StatusCodes.NOT_FOUND);
               
            }



            // ✅ Extract email
            const { email } = userData;


            // store profile with email from user object
            let result = await UserService.createProfile({ email, user_id, ...profile }).catch((err)=>{

                throw new CustomError("User already created",StatusCodes.CONFLICT)
            })
            
            // send successfull message to user 
            res.status(StatusCodes.CREATED).json({ message: "Profile created successfully", profile: result });

        } catch (error) {

           

            // ✅ Pass unexpected errors to Express error handler
            next(error)
        }
    }

    
}

export default new UserController();
