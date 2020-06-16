const express = require("express");

const router = express.Router();

const ZomatoOrderModel = require("../models/order");
const checkAuth = require("../middleware/check-auth");

router.post("", checkAuth, (req, res, next) => {
  const ZomatoOrderMode = new ZomatoOrderModel({
    restid: req.body.restid,
    restname: req.body.restname,
    userid: req.userData.userId,
    orders: req.body.orders,
    info: {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    },
    status: "pending",
  });
  ZomatoOrderMode.save()
    .then((result) => {
      res.status(201).json({
        message: "Order Confirmed!",
        result: result,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.get("", checkAuth, (req, res, next) => {
  ZomatoOrderModel.find({userid: req.userData.userId}).then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      orders: documents,
    });
  });
});

router.get("/admin", checkAuth, (req, res, next) => {
  ZomatoOrderModel.find({restid: req.userData.restId}).then((documents) => {
    res.status(200).json({
      message: "Posts fetched Successfully",
      orders: documents,
    });
  });
});

router.put("/admin", checkAuth, (req, res, next) => {
  // var myquery = { address: "Valley 345" };
  var newvalues = { $set: { status: req.body.status } };
  ZomatoOrderModel.updateOne({ _id: req.body.id ,restid: req.userData.restId }, newvalues).then(
    (result) => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not Authorized !" });
      }
    }
  );
});

module.exports = router;
