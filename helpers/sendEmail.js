import { createTransport } from 'nodemailer';
const sendEmail = (async (email, subject, text) => {
  var transporter = createTransport({
    service: 'gmail',
    port: 25,
    debug: 0,
    host: "smtp.gmail.com",
    secure: true,
    auth: {
      user: 'zaid.ansari@hiteshi.com',
      pass: ''
    }
  });

  var mailOptions = {
    from: 'youremail@gmail.com',
    to: email,
    subject: subject,
    text: text
  };
  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return false;
      } else {
        return true;
      }
    });
  } catch (error) {
    return false;
  }

});

export default sendEmail;