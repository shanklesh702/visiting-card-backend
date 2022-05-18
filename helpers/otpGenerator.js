import otpGenerator from "otp-generator";

export function generatorOTP() {
 const OTP = otpGenerator.generate(6,{ upperCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false })
 
 return OTP;
}