import mongoose from "mongoose";
import normalize from 'normalize-mongoose';


const cardProfileSchema = new mongoose.Schema({
      name: {
          type: String
      },
      designation : {
          type: String
      },
      company: {
          type: String
      },
      profilePic: {
       type : String
      },
      contact: {
          type: String
      },
      userId: {
          type: mongoose.Schema.Types.ObjectId
      },
      email: {
          type: String
      },
      facebookId : {
          type: String
      },
      instaId : {
          type: String
      },
      twitterId : {
          type: String
      },
      linkendinId: {
          type: String
      },
      type: {
          type: String
      },
      method: {
          type: String
      }
},
{
    timestamps: true,
});

cardProfileSchema.plugin(normalize);

const CardProfile = mongoose.model("cardProfile",cardProfileSchema);

export default CardProfile;
