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
       html: `<h1>E-visiting-card email confirmation</h1>
              <h2>Hello ${name}</h2>
              <p> Thank you for subscribing. Please confirm your email by clicking on the following link</p>
              <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>`
   }).catch(err => console.log(err));
  }catch (error) {
      console.log(error)
  }
}