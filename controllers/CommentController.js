import CommentModel from "../models/Comment.js";

export const getCommentsPost = async (req, res) => {
  try {
    const commentId = req.params.id;

    const comments = await CommentModel.find()
      .populate("user")
      .populate("post")
      .exec();

    let comment = comments.filter((obj) => obj.post._id == commentId);

    res.send(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comment = await CommentModel.find()
      .populate("user")
      .populate("post")
      .exec();

    res.send(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve comments",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new CommentModel({
      text: req.body.text,
      user: req.userId,
      post: req.body.post,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create comment",
    });
  }
};
