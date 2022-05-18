import mongoose from "mongoose";
import normalize from 'normalize-mongoose';


const cardProfileSchema = new mongoose.Schema({
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
      }
},
{
    timestamps: true,
});

cardProfileSchema.plugin(normalize);

const CardProfile = mongoose.model("cardProfile",cardProfileSchema);

export default CardProfile;