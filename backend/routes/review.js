const express = require("express");
const multer = require("multer");

const ReviewPost = require("../models/ReviewPost");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/Data/Review_images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const reviewpost = new ReviewPost({
      content: req.body.content,
      imagePath: url + "/Data/Review_images/" + req.file.filename,
      creator: req.userData.userId,
      postID: req.body.postID,
      name: req.userData.name,
    });
    reviewpost.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        review: createdPost
      });
    });
  }
);


// router.post(
//   "",
//   checkAuth,
//   (req, res, next) => {
//     const url = req.protocol + "://" + req.get("host");
//     console.log(req.body.name);
//     const reviewpost = new ReviewPost({
//       content: req.body.name,
//       imagePath: '' ,
//       creator: req.userData.userId,
//       postID: 'req.body.email',
//       name: req.userData.email,
//     });

//     res.status(201).json({
//       message: reviewpost
//     });
//   }
// );

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/Data/Review_images/" + req.file.filename;
    }
    const review = new ReviewPost({
      _id: req.body.id,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId,
      name: req.userData.name,
    });
    console.log(review);
    ReviewPost.updateOne({ _id: req.params.id, creator: req.userData.userId }, review).then(result => {
      if(result.nModified > 0){
        res.status(200).json({ message: "Update successful!" });
      }else{
        res.status(401).json({ message: "Not Authorized !" });
      }
    });
  });

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const reviewpostQuery = ReviewPost.find({postID: req.query.postID});
  let fetchedPosts;
  if (pageSize && currentPage) {
    reviewpostQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  reviewpostQuery
    .then(documents => {
      fetchedPosts = documents;
      return ReviewPost.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        reviews: fetchedPosts,
        maxReviews: count
      });
    });
});

router.get("/:id", (req, res, next) => {
  ReviewPost.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  ReviewPost.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message: "Update successful!" });
    }else{
      res.status(401).json({ message: "Not Authorized !" });
    }
  });
});

module.exports = router;
