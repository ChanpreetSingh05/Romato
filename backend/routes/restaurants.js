const express = require("express");

const multer = require("multer");

const bodyParser = require("body-parser");

const RestaurantModel = require("../models/RestaurantModel");
const CartModel = require("../models/cart");
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
    cb(error, "backend/Data/Restaurant_Photo");
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

const upload = multer({
  storage: storage
  // storage: storage1
});

router.post("",
upload.fields([{ name: 'image' }, { name: 'cover' }])
, (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

    // imagePath: url + "/Data/Review_images/" + req.file.filename,
    const RestaurantMode = new RestaurantModel({
    name: req.body.name,
    status: false,
    active_stts: "Pending",
    // cover: 'helo',
    email: req.body.email,
    cuisines: req.body.cuisine,
    contact: req.body.contact,
    house_no: req.body.house,
    st_name: req.body.street,
    city: req.body.city,
    province: req.body.province,
    postal_code: req.body.postal,
    cost: req.body.cost,
    imagePath: url + "/Data/Restaurant_Photo/" + req.files.image[0].filename,
    cover: url + "/Data/Restaurant_Photo/" + req.files.cover[0].filename,
    additional: req.body.additional
  });
  // res.status(201).json({
  //   message: req.body.name});
  RestaurantMode.save()
    .then((result) => {
      res.status(201).json({
        message: "Restaurant created!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("", (req, res, next) => {
  RestaurantModel.find({status: true}).then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      restaurant: documents,
    });
  });
});

router.get("/adminrestdetails", checkAuth, (req, res, next) => {
  RestaurantModel.findById(req.userData.restId).then((restaurant) => {
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: "Restaurant Not found!" });
    }
  });
});

//For Refresh Fetching
router.get("/details/:id", (req, res, next) => {
  RestaurantModel.findById(req.params.id).then((restaurant) => {
    if (restaurant) {
      res.status(200).json(restaurant);
    } else {
      res.status(404).json({ message: "Restaurant Not found!" });
    }
  });
});

router.post("/cart", checkAuth, (req, res, next) => {
  const ZomatoCart = new CartModel({
    restid: req.body.restid,
    userid: req.userData.userId,
    restname: req.body.restname,
    orders: {
      itemid: req.body.itemid,
      name: req.body.name,
      cost: req.body.cost,
    },
  });
  //  console.log('edt'+ZomatoCart);
  // return res.status(200).json({ZomatoCart});
  ZomatoCart.save()
    .then((result) => {
      res.status(201).json({
        message: "Cart created!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.put("/updatecart", checkAuth, (req, res, next) => {
  CartModel.updateOne(
    {
      userid: req.userData.userId
    },
    {
      $push:{
        "orders":
        {
          name: req.body.name,
          cost: req.body.cost,
          itemid: req.body.itemid
        }
    }
  }).then((result) => {
    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not Authorized !" });
    }
  });
});

//For Deletion
router.put("/cart/:id", checkAuth, (req, res, next) => {
  CartModel.updateOne(
    {
      userid: req.userData.userId,
      "orders._id": req.params.id,
    },
    { $pull: { orders: { _id: req.params.id } } }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });

  // .deleteOne({ _id: req.params.id }).then((result) => {
  //   if (result.n > 0) {
  //     res.status(200).json({ message: "Deleted Successfully" });
  //   } else {
  //     res.status(401).json({ message: "Not Deleted" });
  //   }
  // });
});

router.get("/cart", checkAuth, (req, res, next) => {
  CartModel.find({ userid: req.userData.userId }).then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      cart: documents,
    });
  });
});

//Empty Cart
router.delete("/cart", checkAuth, (req, res, next) => {
  CartModel.deleteOne({userid: req.userData.userId }).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message: "Empty successful!" });
    }else{
      res.status(401).json({ message: "Not Authorized !" });
    }
  });
});

module.exports = router;
