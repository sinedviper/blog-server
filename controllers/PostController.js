import PostModel from "../models/Post.js";

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();

    res.send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const getAllPostTags = async (req, res) => {
  try {
    const tag = req.params.tag;
    const posts = await PostModel.find().populate("user").exec();
    let post = posts
      .map((obj) => {
        if (obj.tags.indexOf(tag) >= 0) {
          return obj;
        }
      })
      .filter((obj) => obj !== undefined);
    res.send(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const getAllPopular = async (req, res) => {
  try {
    const posts = await PostModel.find().populate("user").exec();
    let arr = [];
    const post = posts.map((obj) => {
      arr.push(obj.viewsCount);
      return obj;
    });
    for (let i = 0; i <= arr.length - 1; i++) {
      for (let j = 0; j <= arr.length - 1; j++) {
        if (arr[j + 1] > arr[j]) {
          let n = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = n;
        }
      }
    }
    let top = arr.slice(0, 5);
    let k = 1;
    const popular = post
      .map((obj) => {
        if (k <= 5) {
          if (top.indexOf(obj.viewsCount) >= 0) {
            k++;
            return obj;
          }
        }
      })
      .filter((obj) => obj !== undefined);
    popular.sort(function (a, b) {
      if (a.viewsCount > b.viewsCount) {
        return -1;
      }
      if (a.viewsCount < b.viewsCount) {
        return 1;
      }
      return 0;
    });
    res.send(popular);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.send(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to return articles",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "No found",
          });
        }

        res.json(doc);
      }
    ).populate("user");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndDelete(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Failed to find articles",
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: "No found",
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to retrieve articles",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        user: req.userId,
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update articles",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to create article",
    });
  }
};
