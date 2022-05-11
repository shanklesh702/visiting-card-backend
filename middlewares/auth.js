const jwt = require("jsonwebtoken");
const User = require("../models/users");
const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader,typeof bearerHeader,"bearer")
    if (bearerHeader != undefined) {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      const verifyUser = jwt.verify(req.token, "secret");
      const user = await User.findOne({ _id: verifyUser.data });
      if (user !== null) {
        next();
      } else {
        return res.json({
          message: "Access Forbidden",
          status: 401,
          success: false,
        });
      }
    } else {
      return res.json({
        message: "Token not provided",
        status: 400,
        success: false,
      });
    }
  } catch (error) {
      console.log(error)
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
module.exports = auth;
