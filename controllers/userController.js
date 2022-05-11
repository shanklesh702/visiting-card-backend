const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const joi = require("joi");
const User = require("../models/users");
const Otp = require("../models/otp");
const sendEmail = require("../helpers/sendEmail");
const { response } = require("express");
const upload = require('../middlewares/upload')
const saltRounds = 10;
module.exports = {
  register: async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
      const schema = joi.alternatives(
        joi.object({
          email: joi.string().email().required(),
          password: joi.string().required().min(5).max(10),
          fullName: joi.string().required(),
        })
      );
      const result = schema.validate(req.body);
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.join({
          status: 400,
          success: false,
          message: message,
        });
      } else {
        User.findOne({ email: email }).then((user) => {
          if (user) {
            return res.json({
              message: "Email already exist",
              status: 400,
              success: false,
            });
          } else {
            bcrypt.genSalt(saltRounds, function (err, salt) {
              bcrypt.hash(password, salt, function (err, hash) {
                let data = new User({
                  email: email,
                  fullName: fullName,
                  password: hash,
                });
                data.save().then((user_data) => {
                  if (user_data !== null) {
                    return res.json({
                      message: "user register success",
                      status: 200,
                      success: true,
                    });
                  } else {
                    return res.json({
                      message: "failed to add user",
                    });
                  }
                });
              });
            });
          }
        });
      }
    } catch (error) {
      return res.json({
        message: "Internal server error",
        status: 500,
        success: false,
      });
    }
  },
  login: (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body);
      const schema = joi.alternatives(
        joi.object({
          email: joi.string().email().required(),
          password: joi.string().required().min(5).max(10),
        })
      );
      const result = schema.validate(req.body);
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          status: 400,
          success: false,
          message: message,
        });
      } else {
        User.findOne({ email: email }).then((user) => {
          if (user) {
            bcrypt.compare(password, user.password).then((data) => {
              if (data) {
                const token = jwt.sign(
                  {
                    data: user._id,
                  },
                  "secret"
                );
                return res.json({
                  message: "User successfuly login",
                  token,
                  status: 200,
                  success: true,
                });
              } else {
                return res.json({
                  message: "Wrong password entered",
                  status: 400,
                  success: false,
                });
              }
            });
          } else {
            return res.json({
              message: "Email not found",
              status: 400,
              success: false,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      return res.json({
        message: "Internal server error",
        status: 500,
        success: false,
      });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const { id, email, fullName } = req.body;
      const schema = joi.alternatives(
        joi.object({
          id: joi.string().required(),
          email: joi.string().email().required(),
          fullName: joi.string().required(),
        })
      );
      const result = schema.validate(req.body);
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          status: 400,
          success: false,
          message: message,
        });
      } else {
        User.findOneAndUpdate(
          { _id: id },
          { $set: { email: email, fullName: fullName } }
        ).then((data) => {
          if (data !== null) {
            return res.json({
              message: "Profile update success",
              status: 200,
              success: true,
            });
          } else {
            return res.json({
              message: "Profile updated failed",
              status: 400,
              success: false,
            });
          }
        });
      }
    } catch (error) {
      return res.json({
        message: "Internal server error",
        status: 500,
        success: false,
      });
    }
  },
  uploadProfileImage: async (req, res) => {
    try {
      const { id } = req.body;
      upload(req, res, err => {
        if (err instanceof multer.MulterError) {
          console.log("multer error when uploading file:", err);
          return res.sendStatus(500);
        } else if (err) {
          console.log("unknown error when uploading file:", err);
          return res.sendStatus(500);
        }
      })
      const file = req.file;
      const schema = joi.alternatives(
        joi.object({
          id: joi.string().required(),
        })
      );
      const result = schema.validate(req.body);
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          status: 400,
          success: false,
          message: message,
        });
      } else {
        User.findByIdAndUpdate(
          { _id: id },
          { $set: { profile: __baseDir + "/upload/" + file.filename } }
        ).then((data) => {
          if (data !== null) {
            return res.json({
              message: "upload profile success",
              status: 200,
              success: true,
            });
          } else {
            return res.json({
              message: "upload profle failed",
              status: 400,
              success: false,
            });
          }
        });
      }
    } catch (error) {
      return res.json({
        message: "Internal server error",
        status: 500,
        success: false,
      });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { otp, userId } = req.body;
      const schema = joi.alternatives(
        joi.object({
          otp: joi.number().empty().required(),
          userId: joi.string().required(),
        })
      );
      const result = schema.validate(req.body);
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          status: 400,
          success: false,
          message: message,
        });
      } else {
        User.findOne({ _id: userId }).then((user_data) => {
          if (user_data !== null) {
            Otp.findOne({ userId: userId }).then((data) => {
              if (data !== null) {
                if (data.otp === parseInt(otp)) {
                  Otp.findOneAndDelete({ _id: data._id }).then((data) => {
                    if (data !== null) {
                      console.log("otp delete");
                    }
                  });
                  User.findOneAndUpdate(
                    { _id: userId },
                    { $set: { isVerified: true } }
                  ).then((user) => {
                    if (user !== null) {
                      let text = "otp verified success";
                      sendEmail(
                        user_data.email,
                        "E-Visiting Account Verification",
                        text
                      );
                      return res.json({
                        message: "otp verified success",
                        status: 200,
                        success: true,
                      });
                    } else {
                      return res.json({
                        message: "otp not verified",
                      });
                    }
                  });
                } else {
                  Otp.deleteMany({ userId: userId });
                  return res.json({
                    message: "Otp does not match",
                    status: 400,
                    success: false,
                  });
                }
              } else {
                return res.json({
                  message: "otp expired",
                  status: 400,
                  success: false,
                });
              }
            });
          } else {
            return res.json({
              message: "user not found on this email",
              status: 400,
              success: false,
            });
          }
        });
      }
    } catch (error) {
      return res.json({
        message: "Internal server error",
        status: 500,
        success: false,
      });
    }
  },
  resendOtp: async (req, res) => {
    try {
      const { userId } = req.body;
      const schema = joi.alternatives(
        joi.object({
          userId: joi.string().required(),
        })
      );
      const result = schema.validate(req.body);
      if (result.error) {
        const message = result.error.details.map((i) => i.message).join(",");
        return res.json({
          status: 400,
          success: false,
          message: message,
        });
      } else {
        User.findOne({ _id: userId }).then(async (data) => {
          if (data !== null) {
            let otp = Math.random();
            otp = otp * 1000000;
            otp = parseInt(otp);
            Otp.findOne({ _id: userId }).then((user_otp) => {
              if (user_otp !== null) {
                Otp.deleteMany({ userId: userId }).then((user) => {
                  if (user !== null) {
                    let newOtp = new Otp({
                      userId: userId,
                      otp: otp,
                    });
                    const result = newOtp.save();
                  }
                });
              } else {
                let newOtp = new Otp({
                  userId: userId,
                  otp: otp,
                });
                const result = newOtp.save();
              }
            });
            let text = `resend otp ${otp}`;
            let result = sendEmail(
              data.email,
              "E-Visiting otp verification",
              text
            );
            if (result) {
              return res.json({
                message: "otp resend on your mail successfully",
                status: 200,
                success: true,
              });
            }
          } else {
            return res.json({
              message: "user not found",
              status: 400,
              success: false,
            });
          }
        });
      }
    } catch (error) {
      return res.json({
        message: "Internal server error",
        status: 500,
        success: false,
      });
    }
  },
  // register: async (req, res) => {
  //   try {
  //     const { fullName, email, password } = req.body;
  //     const schema = joi.alternatives(
  //       joi.object({
  //         email: joi.string().email().required(),
  //         password: joi.string().required().min(5).max(10),
  //         fullName: joi.string().required(),
  //       })
  //     );
  //     const result = schema.validate(req.body);
  //     if (result.error) {
  //       const message = result.error.details.map((i) => i.message).join(",");
  //       return res.join({
  //         status: 400,
  //         success: false,
  //         message: message,
  //       });
  //     } else {
  //       User.findOne({ email: email }).then((user) => {
  //         if (user) {
  //           return res.json({
  //             message: "Email already exist",
  //             status: 400,
  //             success: false,
  //           });
  //         } else {
  //           bcrypt.genSalt(saltRounds, function (err, salt) {
  //             bcrypt.hash(password, salt, function (err, hash) {
  //               let data = new User({
  //                 email: email,
  //                 fullName: fullName,
  //                 password: hash,
  //               });
  //               data.save().then((user_data) => {
  //                 let otp = Math.random();
  //                 otp = otp * 1000000;
  //                 otp = parseInt(otp);
  //                 Otp.findOne({ userId: data._id }).then((data) => {
  //                   if (data !== null) {
  //                     Otp.deleteMany({ userId: response._id }).then((user) => {
  //                       if (user !== null) {
  //                         let newOtp = new Otp({
  //                           userId: data._id,
  //                           otp: otp,
  //                         });
  //                         newOtp.save().then((new_otp) => {
  //                           if (new_otp !== null) {
  //                             let text = `E-Visiting otp  is ${otp}`;
  //                             let subject = "E-Visiting otp";
  //                             let result = sendEmail(email, subject, text);
  //                             if (result) {
  //                               return res.json({
  //                                 message: "otp send on your email success",
  //                                 status: 200,
  //                                 success: true,
  //                               });
  //                             } else {
  //                               return res.json({
  //                                 message: "otp sending failed",
  //                                 status: 400,
  //                                 success: false,
  //                               });
  //                             }
  //                           } else {
  //                           }
  //                         });
  //                       } else {
  //                         let newOtp = new Otp({
  //                           userId: data._id,
  //                           otp: otp,
  //                         });
  //                         newOtp.save().then((new_otp) => {
  //                           if (new_otp !== null) {
  //                             let text = `E-Visiting otp  is ${otp}`;
  //                             let subject = "E-Visiting otp";
  //                             let result = sendEmail(email, subject, text);
  //                             if (result) {
  //                               return res.json({
  //                                 message: "otp send on your email success",
  //                                 status: 200,
  //                                 success: true,
  //                               });
  //                             } else {
  //                               return res.json({
  //                                 message: "otp sending failed",
  //                                 status: 400,
  //                                 success: false,
  //                               });
  //                             }
  //                           }
  //                         });
  //                       }
  //                     });
  //                   } else {
  //                     let newOtp = new Otp({
  //                       userId: data._id,
  //                       otp: otp,
  //                     });
  //                     newOtp.save().then((new_otp) => {
  //                       if (new_otp !== null) {
  //                         let text = `E-Visiting otp  is ${otp}`;
  //                         let subject = "E-Visiting otp";
  //                         let result = sendEmail(email, subject, text);
  //                         if (result) {
  //                           return res.json({
  //                             message: "otp send on your email success",
  //                             status: 200,
  //                             success: true,
  //                           });
  //                         } else {
  //                           return res.json({
  //                             message: "otp sending failed",
  //                             status: 400,
  //                             success: false,
  //                           });
  //                         }
  //                       } else {
  //                       }
  //                     });
  //                   }
  //                 });
  //               });
  //             });
  //           });
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     return res.json({
  //       message: "Internal server error",
  //       status: 500,
  //       success: false,
  //     });
  //   }
  // },
  // login: (req, res) => {
  //   try {
  //     const { email, password } = req.body;
  //     console.log(req.body);
  //     const schema = joi.alternatives(
  //       joi.object({
  //         email: joi.string().email().required(),
  //         password: joi.string().required().min(5).max(10),
  //       })
  //     );
  //     const result = schema.validate(req.body);
  //     if (result.error) {
  //       const message = result.error.details.map((i) => i.message).join(",");
  //       return res.json({
  //         status: 400,
  //         success: false,
  //         message: message,
  //       });
  //     } else {
  //       User.findOne({ email: email }).then((user) => {
  //         if (user) {
  //           bcrypt.compare(password, user.password).then((data) => {
  //             if (data) {
  //               if(data.verified){
  //                 const token = jwt.sign(
  //                   {
  //                     data: user._id,
  //                   },
  //                   "secret"
  //                 );
  //                 return res.json({
  //                   message: "User successfuly login",
  //                   token,
  //                   status: 200,
  //                   success: true,
  //                 });
  //               }
  //               else{
  //                 let otp = Math.random();
  //                 otp = otp * 1000000;
  //                 otp = parseInt(otp);
  //                 Otp.findOne({userId:user._id}).then((data) => {
  //                 if(data!==null){
  //                 Otp.deleteMany({userId:user._id}).then((delete_data) => {
  //                 if(delete_data!==null){
  //                   let newOtp = new Otp({
  //                     userId: data._id,
  //                     otp: otp,
  //                   });
  //                   newOtp.save().then((new_otp) => {
  //                     if (new_otp !== null) {
  //                       let text = `E-Visiting otp  is ${otp}`;
  //                       let subject = "E-Visiting otp";
  //                       let result = sendEmail(email, subject, text);
  //                       if (result) {
  //                         return res.json({
  //                           message: "otp send on your email success",
  //                           status: 200,
  //                           success: true,
  //                         });
  //                       } else {
  //                         return res.json({
  //                           message: "otp sending failed",
  //                           status: 400,
  //                           success: false,
  //                         });
  //                       }
  //                     } else {
  //                     }
  //                   });
  //                 }
  //                 else {
  //                   let newOtp = new Otp({
  //                     userId: data._id,
  //                     otp: otp,
  //                   });
  //                   newOtp.save().then((new_otp) => {
  //                     if (new_otp !== null) {
  //                       let text = `E-Visiting otp  is ${otp}`;
  //                       let subject = "E-Visiting otp";
  //                       let result = sendEmail(email, subject, text);
  //                       if (result) {
  //                         return res.json({
  //                           message: "otp send on your email success",
  //                           status: 200,
  //                           success: true,
  //                         });
  //                       } else {
  //                         return res.json({
  //                           message: "otp sending failed",
  //                           status: 400,
  //                           success: false,
  //                         });
  //                       }
  //                     } else {
  //                     }
  //                   });
  //                 }
  //                 });
  //                 }
  //                 else {
  //                   let newOtp = new Otp({
  //                     userId: data._id,
  //                     otp: otp,
  //                   });
  //                   newOtp.save().then((new_otp) => {
  //                     if (new_otp !== null) {
  //                       let text = `E-Visiting otp  is ${otp}`;
  //                       let subject = "E-Visiting otp";
  //                       let result = sendEmail(email, subject, text);
  //                       if (result) {
  //                         return res.json({
  //                           message: "otp send on your email success",
  //                           status: 200,
  //                           success: true,
  //                         });
  //                       } else {
  //                         return res.json({
  //                           message: "otp sending failed",
  //                           status: 400,
  //                           success: false,
  //                         });
  //                       }
  //                     } else {
  //                     }
  //                   });
  //                 }

  //                 });
  //               }

  //             } else {
  //               return res.json({
  //                 message: "Wrong password entered",
  //                 status: 400,
  //                 success: false,
  //               });
  //             }
  //           });
  //         } else {
  //           return res.json({
  //             message: "Email not found",
  //             status: 400,
  //             success: false,
  //           });
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return res.json({
  //       message: "Internal server error",
  //       status: 500,
  //       success: false,
  //     });
  //   }
  // },
};
