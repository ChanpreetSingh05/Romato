const express = require("express");

const router = express.Router();

const RestaurantMenuModel = require("../models/RestaurantMenu");
const checkAuth = require("../middleware/check-auth");

// Initializing model

router.post("" , (req,res, next) =>{
  const RestaurantMenuMode = new RestaurantMenuModel({
restid:"5ed6e8e672ae430bf4e55230",
restname:"The Early Bird"
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

})

// Adding Items
router.post("/dinner", checkAuth, (req, res, next) => {
  // console.log(req.userData)
  RestaurantMenuModel.updateOne(
    { restid: req.userData.restId },
    {
      $push: {
        dinner: {
          name: req.body.name,
          cost: req.body.cost,
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

router.post("/lunch", checkAuth, (req, res, next) => {
  // console.log(req.body.name);
  RestaurantMenuModel.updateOne(
    { restid: req.userData.restId },
    {
      $push: {
        lunch: {
          name: req.body.name,
          cost: req.body.cost,
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

router.post("/brkfast", checkAuth, (req, res, next) => {
  // const RestaurantMenuMode = new Model({
  //   name: req.body.name,
  //   cost: req.body.cost,
  // });
  console.log(req.body.name);
  RestaurantMenuModel.updateOne(
    { restid: req.userData.restId },
    {
      $push: {
        breakfast: {
          name: req.body.name,
          cost: req.body.cost,
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

// Edit Items

// router.get("/dinnerupdate", (req, res, next) => {
//   // console.log(req.body);
//   RestaurantMenuModel.findOne(
//     {
//       restid: "5ed6e8e672ae430bf4e55230",
//       // 5ed8a16e3f88b92d08b2e8c5
//       "dinner._id": "5edafbe6fb358c2c682dbe2d"
//       // dinner: {
//       //   _id: "5edafbe6fb358c2c682dbe2d",
//       // }
//     // },
//     // {
//     //   dinner: {
//     //     name: req.body.name,
//     //     cost: req.body.cost,
//     //   }
//     },{ "dinner.$": 1 }
//   ).then((result) => {
//     // var dinner= result.dinner;
//     // result.dinner.findOne({_id: "5edafbe6fb358c2c682dbe2d"})
//     // .exec()
//     // .then(res =>{
//     //
//     //   res.status(200).json(res)
//     // });
//         res.status(200).json(result);
//     // if (result.nModified > 0) {
//     //   res.status(200).json({ message: "Update successful!" });
//     // } else {
//     //   res.status(401).json({ message: "not" });
//     // }
//   });
// });

router.put("/dinnerupdate", checkAuth, (req, res, next) => {
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "dinner._id": req.body.id
    },
    {
      $set:{
        "dinner.$":
        {
          name: req.body.name,
          cost: req.body.cost
        }
    }
  }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.put("/lunchupdate", checkAuth, (req, res, next) => {
  // console.log(req.body.name);
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "lunch._id": req.body.id
    },
    {
      $set:{
        "lunch.$":
        {
          name: req.body.name,
          cost: req.body.cost
        }
    }
  }
  ).then((result) => {
    if (result.nModified > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "not" });
    }
  });
});

router.put("/brkfastupdate", checkAuth, (req, res, next) => {
  RestaurantMenuModel.updateOne(
    {
      restid: req.userData.restId,
      "breakfast._id": req.body.id
    },
    {
      $set:{
        "breakfast.$":
        {
          name: req.body.name,
          cost: req.body.cost
        }
    }
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
  RestaurantMenuModel.find().then((documents) => {
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
          "breakfast._id": req.params.id
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
          "lunch._id": req.params.id
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
          "dinner._id": req.params.id
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
      "breakfast._id": req.body.id
    },
    { $pull: { "breakfast" : { _id: req.body.id } } }
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
      "lunch._id": req.body.id
    },
    { $pull: { "lunch" : { _id: req.body.id } } }
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
      "dinner._id": req.body.id
    },
    { $pull: { "dinner" : { _id: req.body.id } } }
    ).then((result) => {
      if (result.nModified > 0) {
        res.status(200).json({ message: "Post Deleted!" });
      } else {
        res.status(401).json({ message: "not" });
      }
    });
});

module.exports = router;
