import nodemailer from 'nodemailer';


export function sendConfirmationEmail(email,subject='',html='') {
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
       subject: subject,
       html: html,
   }).catch(err => console.log(err));
  }catch (error) {
      console.log(error)
  }
}