const  mongoose =require('mongoose');
const OtpSchema = new mongoose.Schema({
    otp:{
        type:Number
    },
    userId:{
        type:String
    },
    createdAt:{
        type:Date,
        default:Date.now,
        index:{expires:'3m'}
    }
});
const Otp = mongoose.model('otp',OtpSchema);
module.exports = Otp;