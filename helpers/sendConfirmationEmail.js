import nodemailer from 'nodemailer';


export function sendConfirmationEmail(name, email, confirmationCode) {
  try {
      console.log("inside confirmation mail")
      const user =  'Shanklesh.vishwakarma@hiteshi.com';
      const pass =  'smv@54321';
      const transport = nodemailer.createTransport({
       service: "Gmail",
       auth: {
           user: user,
           pass: pass
       },
   });

       transport.sendMail({
       from :user,
       to : email,
       subject: "Please confirm your account",
       html: `<div>
              <h1>E-visiting-card email confirmation</h1>
              <h2>Hello ${name}</h2>
              <p> Thank you for subscribing. Please use the below code to verify the email id.</p>
              <h3><span>Otp:</span> <span style="color:blue"> ${confirmationCode}<span></h3>
              <p style="color:black">Regards</p>
              <p style="color:black">E-visiting-card.com</p>
              </div>`
   }).catch(err => console.log(err));
  }catch (error) {
      console.log(error)
  }
}