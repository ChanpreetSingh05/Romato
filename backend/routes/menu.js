const express = require("express");
const multer = require("multer");
const router = express.Router();

const RestaurantMenuModel = require("../models/RestaurantMenu");
const checkAuth = require("../middleware/check-auth");

// Initializing model

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/Data/Menu_Photo");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post("", (req, res, next) => {
  const RestaurantMenuMode = new RestaurantMenuModel({
    restid: req.body.restid,
    restname: req.body.name,
  });
  RestaurantMenuMode.save()
    .then((result) => {
      res.status(201).json({
        message: "Restaurant Menu created!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Adding Items
router.post("/dinner", checkAuth,
multer({ storage: storage }).single("image"),
(req, res, next) => {
  let imagePath = '';
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/Data/Menu_Photo/" + req.file.filename;
  }
  console.log('edr '+ imagePath);
  RestaurantMenuModel.updateOne(
    { restid: req.userData.restId },
    {
      $push: {
        dinner: {
          name: req.body.name,
          cost: req.body.cost,
          imagepath: imagePath,
        },
      },
    }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.post("/lunch", checkAuth,
multer({ storage: storage }).single("image"),
(req, res, next) => {
  let imagePath = '';
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/Data/Menu_Photo/" + req.file.filename;
  }
  RestaurantMenuModel.updateOne(
    { restid: req.userData.restId },
    {
      $push: {
        lunch: {
          name: req.body.name,
          cost: req.body.cost,
          imagepath : imagePath,
        },
      },
    }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.post(
  "/brkfast",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = '';
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/Data/Menu_Photo/" + req.file.filename;
    }
    RestaurantMenuModel.updateOne(
      { restid: req.userData.restId },
      {
        $push: {
          breakfast: {
            name: req.body.name,
            cost: req.body.cost,
            imagepath: imagePath,
          },
        },
      }
    ).then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "not" });
      }
    });
  }
);

// Edit Items

router.put("/dinnerupdate", checkAuth,
multer({ storage: storage }).single("image"),
(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/Data/Menu_Photo/" + req.file.filename;
  }

  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "dinner._id": req.body.id,
    },
    {
      $set: {
        "dinner.$": {
          name: req.body.name,
          cost: req.body.cost,
          imagepath: imagePath,
        },
      },
    }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.put("/lunchupdate", checkAuth,
multer({ storage: storage }).single("image"),
(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/Data/Menu_Photo/" + req.file.filename;
  }
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "lunch._id": req.body.id,
    },
    {
      $set: {
        "lunch.$": {
          name: req.body.name,
          cost: req.body.cost,
          imagepath: imagePath,
        },
      },
    }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.put("/brkfastupdate", checkAuth,
multer({ storage: storage }).single("image"),
(req, res, next) => {
  let imagePath = '';
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/Data/Menu_Photo/" + req.file.filename;
  }else{
    imagePath = req.body.imagePath;
  }

  console.log('edr' + req.body.id);
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "breakfast._id": req.body.id,
    },
    {
      $set: {
        "breakfast.$": {
          name: req.body.name,
          cost: req.body.cost,
          imagepath: imagePath,
        },
      },
    }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.get("", checkAuth, (req, res, next) => {
  RestaurantMenuModel.find({ restid: req.userData.restId }).then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      menu: documents,
    });
  });
});

router.get("/:id", checkAuth, (req, res, next) => {
  RestaurantMenuModel.find({ restid: req.params.id }).then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      menu: documents,
    });
  });
});

//For Particular data Fetching
router.get("/breakfastdetails/:id", checkAuth, (req, res, next) => {
  RestaurantMenuModel.findOne(
    {
      restid: req.userData.restId,
      "breakfast._id": req.params.id,
    },
    { "breakfast.$": 1 }
  ).then((restaurant) => {
    if (restaurant) {
      console.log(restaurant);
      res.status(200).json(restaurant.breakfast[0]);
    } else {
      res.status(404).json({ message: "Restaurant Menu Not found!" });
    }
  });
});

router.get("/lunchdetails/:id", checkAuth, (req, res, next) => {
  RestaurantMenuModel.findOne(
    {
      restid: req.userData.restId,
      "lunch._id": req.params.id,
    },
    { "lunch.$": 1 }
  ).then((restaurant) => {
    if (restaurant) {
      res.status(200).json(restaurant.lunch[0]);
    } else {
      res.status(404).json({ message: "Restaurant Menu Not found!" });
    }
  });
});

router.get("/dinnerdetails/:id", checkAuth, (req, res, next) => {
  RestaurantMenuModel.findOne(
    {
      restid: req.userData.restId,
      "dinner._id": req.params.id,
    },
    { "dinner.$": 1 }
  ).then((restaurant) => {
    if (restaurant) {
      res.status(200).json(restaurant.dinner[0]);
    } else {
      res.status(404).json({ message: "Restaurant Menu Not found!" });
    }
  });
});

// Deleting items

router.put("/brkfastdelete", checkAuth, (req, res, next) => {
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "breakfast._id": req.body.id,
    },
    { $pull: { breakfast: { _id: req.body.id } } }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.put("/lunchdelete", checkAuth, (req, res, next) => {
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "lunch._id": req.body.id,
    },
    { $pull: { lunch: { _id: req.body.id } } }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.put("/dinnerdelete", checkAuth, (req, res, next) => {
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "dinner._id": req.body.id,
    },
    { $pull: { dinner: { _id: req.body.id } } }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

module.exports = router;
