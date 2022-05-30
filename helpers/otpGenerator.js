import otpGenerator from "otp-generator";

export function generatorOTP() {
 let OTP = '';
 return new Promise((resolve,reject)=>{

     OTP = otpGenerator.generate(6,{ upperCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
     
     resolve (OTP);
 })
}

