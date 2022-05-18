import jwt from "jsonwebtoken";
import User from "../models/users.js";
const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    console.log(bearerHeader,typeof bearerHeader,"bearer")
    if (bearerHeader != undefined) {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      console.log("==",req.token)
      const verifyUser = jwt.verify(req.token, "secret");
      console.log(verifyUser.data)
      const user = await User.findOne({ _id: verifyUser.data });
      console.log(user)
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
export default auth;
