const express = require("express");

const router = express.Router();

const RestaurantModel = require("../models/RestaurantModel");
const CartModel = require("../models/cart");
const checkAuth = require("../middleware/check-auth");

router.post("", (req, res, next) => {
  const RestaurantMode = new RestaurantModel({
    name: req.body.name,
    cuisines: req.body.cuisines,
    contact: req.body.contact,
    house_no: req.body.house_no,
    st_name: req.body.st_name,
    city: req.body.city,
    province: req.body.province,
    postal_code: req.body.postal_code,
    cost: req.body.cost,
    breakfast: req.body.breakfast,
    takeout: req.body.takeout,
    alcohol: req.body.alcohol,
    parking: req.body.parking,
    indoor_seating: req.body.indoor_seating,
    outdoor_seating: req.body.outdoor_seating,
    kids: req.body.kids,
    wifi: req.body.wifi,
    imagePath: req.body.imagePath,
    status: req.body.status,
  });
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
  RestaurantModel.find().then((documents) => {
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

module.exports = router;
