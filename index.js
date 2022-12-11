import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import fs from "fs";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
  commentValidation,
} from "./validations.js";
import {
  UserController,
  PostController,
  CommnetController,
} from "./controllers/index.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB ERROR", err);
  });

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/upload", express.static("uploads"));

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) =>
  res.json({
    url: `/upload/${req.file.originalname}`,
  })
);

app.get("/tags", PostController.getLastTags);

app.get("/comments", CommnetController.getAllComments);
app.get("/comments/:id", CommnetController.getCommentsPost);
app.post("/comment", checkAuth, commentValidation, CommnetController.create);

app.get("/posts", PostController.getAll);
app.get("/posts/popular", PostController.getAllPopular);
app.get("/posts/tag/:tag", PostController.getAllPostTags);
app.get("/posts/tags", PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
app.delete("/posts/:id", PostController.remove);
app.patch(
  "/posts/:id",
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

app.listen(process.env.PORT || 3001, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK, http://localhost:3001/");
});
