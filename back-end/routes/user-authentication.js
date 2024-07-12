const express = require("express"); 
const mongoose = require("mongoose");
const User = require("../models/User.js");

// a method that constains code to handle authentication-specific routes
const authenticationRouter = () => {
  // create a new router that we can customize
  const router = express.Router();

  // a route to handle user signup requests to /api/register
  router.post("/register", async (req, res, next) => {
    // console.log(`Incoming signup data: ${JSON.stringify(req.body, null, 0)}`)
    // grab the email and password from the POST body
      const email = req.body.email;
      const password = req.body.password;

    if (!email || !password) {
      // no email or password received in the POST body... send an error
      res.status(401).json({
        success: false,
        message: `No username or password supplied.`,
      });
      next();
    }

    // try to create a new user
    try {
      const user = await new User({ email, password}).save();
      // user saved successfully... send a success response
      console.error(`New user: ${user}`);
      const token = user.generateJWT(); // generate a signed token
      res.json({
        success: true,
        message: "User saved successfully.",
        token: token,
        email: user.email,
      }); // send the token to the client to store
      next();
    } catch (err) {
      // error saving user to database... send an error response
      console.error(`Failed to save user: ${err}`);
      res.status(500).json({
        success: false,
        message: "Error saving user to database.",
        error: err,
      });
      next();
    }
  });

  // a route to handle login attempts requested to /api/login
  router.post("/login", async function (req, res, next) {
    // grab the name and password that were submitted as POST body data
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      // no username or password received in the POST body... send an error
      res
        .status(401)
        .json({ success: false, message: `No email or password supplied.` });
      next();
    }

    // find this user in the database
    try {
      const user = await User.findOne({ email: email }).exec();
      // check if user was found
      if (!user) {
        console.error(`User not found.`);
        res.status(401).json({
          success: false,
          message: "User not found in database.",
        });
        next();
      }
      // if user exists, check if password is correct
      else if (!user.validPassword(password)) {
        console.error(`Incorrect password.`);
        res.status(401).json({
          success: false,
          message: "Incorrect password.",
        });
        next();
      }
      // user found and password is correct... send a success response
      console.log("User logged in successfully.");
      const token = user.generateJWT(); // generate a signed token
      res.json({
        success: true,
        message: "User logged in successfully.",
        token: token,
        email: user.email,
      }); // send the token to the client to store
      next();
    } catch (err) {
      // check error
      console.error(`Error looking up user: ${err}`);
      res.status(500).json({
        success: false,
        message: "Error looking up user in database.",
        error: err,
      });
      next();
    }
  });

  // a route to handle logging out requests to /api/logout
  router.get("/logout", function (req, res, next) {
    // nothing really to do here... logging out with JWT authentication is handled entirely by the front-end by deleting the token from the browser's memory
    res.json({
      success: true,
      message:
        "There is actually nothing to do on the server side... you simply need to delete your token from the browser's local storage!",
    });
    next();
  });

  return router;
};

// export the router
module.exports = authenticationRouter;

