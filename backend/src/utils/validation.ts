import Joi from "joi";

// ✅ Validation schema for user registration
export const registerValidation = Joi.object({
  
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
  confirmPassword: Joi.ref('password'),
});

// ✅ Validation schema for user login
export const loginValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().trim().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "any.required": "Password is required",
  }),
});

// ✅ Validation schema for changing password
export const changePasswordValidation = Joi.object({
  oldPassword: Joi.string().trim().min(6).required().messages({
    "string.min": "Old password must be at least 6 characters",
    "any.required": "Old password is required",
  }),
  newPassword: Joi.string().trim().min(6).required().messages({
    "string.min": "New password must be at least 6 characters",
    "any.required": "New password is required",
  }),
});

// ✅ Validation schema for password reset request
export const forgotPasswordValidation = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
});

// ✅ Validation schema for password reset request
export const resetPasswordValidation = Joi.object({
    password: Joi.string().trim().min(6).required().messages({
        "string.min": "Old password must be at least 6 characters",
        "any.required": "password is required",
      }),
    confirmPassword: Joi.string().trim().min(6).required().messages({
        "string.min": "New password must be at least 6 characters",
        "any.required": "confirm password is required",
      }),
  });


  export const profileSubmitValidation = Joi.object({

  })