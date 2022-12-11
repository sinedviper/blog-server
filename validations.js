import { body } from "express-validator";

export const registerValidation = [
  body("email", "Invalid mail format").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
  body("fullName", "Enter name").isLength({ min: 3 }),
  body("avatarUrl", "Invalid avatar link").optional().isURL(),
];

export const loginValidation = [
  body("email", "Invalid mail format").isEmail(),
  body("password", "Password must be at least 5 characters").isLength({
    min: 5,
  }),
];

export const postCreateValidation = [
  body("title", "Enter article title").isLength({ min: 5 }).isString(),
  body("text", "Enter article text").isLength({ min: 10 }).isString(),
  body("tags", "Invalid tag format").optional().isString(),
  body("imageUrl", "Invalid image link").optional().isString(),
];

export const commentValidation = [
  body("text", "Enter article text").isLength({ min: 10 }).isString(),
];
