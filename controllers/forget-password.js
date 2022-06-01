import { generatorOTP } from '../helpers/otpGenerator.js';
import { sendConfirmationEmail } from '../helpers/sendConfirmationEmail.js';
import User from '../models/users.js';
import Response_Obj from '../util/reponse.code.js';
import JWT from 'jsonwebtoken';
import bcrypt from "bcryptjs";

export async function sendMailToUpdatePassword(req, res) {
    try{
        console.log("===")
      const {email,newPassword} = req.body;
      if (!email) {
         
        return Response_Obj.ERROR(res,{},'Please send email id in payload');

      }
       
      // check email in database
      let user = await User.findOne({email});
    if(!user) {
        return Response_Obj.ERROR(ews,{},'Data not found with the given email id.')
    }

    //generate a otp and save in user document and send the otp in mail requesting the new password and otp
    // compare the otp with one saved in user document if match then update the password.
    

    let html = ` 
               <html><head>
               </head><body>
                <p>Please enter new password and use given otp to reset the password</p>
                <h3> Otp:<span style="color:blue">replaceotp</span></h3>
                <div>
                <form method="post" action="https://visiting-cards.herokuapp.com/forget-password/update">
                <label for="fname">New Password:</label><br>
                <input type="password" id="password" name="password" value=""><br>
                <label for="opt">Otp:</label><br>
                <input type="text" id="otp" name="otp" value=""><br><br>
                <input type="hidden" id="token" name="token" value=realToken>
                <button id="post-btn" type="submit" value="Submit">Submit</button>
                </form> 
                </div>
                </body>
                </html>`;
    // create token
    generatorOTP().then(async(otp) => {
        let token = JWT.sign({userId:user._id,otp:otp},"secret");
         
         await User.findByIdAndUpdate({_id:user._id},{otp:otp});
         html = html.replace('replaceotp',otp);
         html = html.replace('realToken',token)
         sendConfirmationEmail(email,'Link to reset password',html);
        
         return Response_Obj.OK(res,{},'Please check your email to reset password.')

    }).catch (error => {
        console.log(error)
       return Response_Obj.SERVERERROR(res,{});
    })
    
      
    } catch(error) {
       console.log(error)
       return Response_Obj.SERVERERROR(res,{});

    }
}

export async function resetPassword(req,res) {
    try {
        
      
        const { password,otp,token} = req.body;
        if (!password){
            return Response_Obj.ERROR(res,{},'Please send new password');
        }
        
        let tokenPayload =  JWT.verify(token,"secret");
       
         //get the otp from database
         let user = await User.findById({_id:tokenPayload.userId},{otp:1});
       
         if (user && user.otp === otp) {
             // update password
             bcrypt.genSalt(10,(err,salt)=>{
                  if(err){
                    return Response_Obj.SERVERERROR(res,{})
                  }
                  bcrypt.hash(password,salt,(err,hash)=>{

                  })
             })
             let salt = await bcrypt.genSalt(10);
             let hashPassword = await bcrypt.hash(password,salt);

             let result = await User.findByIdAndUpdate({_id:tokenPayload.userId},{password:hashPassword});
             if (result){
                 return Response_Obj.OK(res,{},'Password updated successfully');
              }else {
                return Response_Obj.SERVERERROR(res,{},'Something went wrong , Please try again');       
             }
         }else {

             return Response_Obj.ERROR(res,{},'Wrong otp provided');
         
            }
    } catch( error) {
        console.log(error);
        return Response_Obj.SERVERERROR(res,{})
    }
}