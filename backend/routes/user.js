const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const ZomatoUser = new User({
      email: req.body.email,
      password: hash,
      isadmin: false,
      isrest: req.body.isrest,
      isuser: req.body.isuser,
      name: req.body.name,
      restid: req.body.restid,
    });
    ZomatoUser
      .save()
      .then(result => {
        res.status(201).json({
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
        message: "Account Already Exists"
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Invalid UserName"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Invalid Password"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id , restId: fetchedUser.restid, name: fetchedUser.name, isadmin: fetchedUser.isadmin, isrest: fetchedUser.isrest, isuser: fetchedUser.isuser  },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id,
        isadmin: fetchedUser.isadmin,
        isrest: fetchedUser.isrest,
        restid: fetchedUser.restid
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid Credentials",
        error: err
      });
    });
});

module.exports = router;
