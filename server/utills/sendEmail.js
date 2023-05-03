const nodeMailer = require("nodemailer");

const sendEmail = async (email, message) => {
  // 1) CREATE A TRANSPORT OBJ TO SEND EMAIL
  const transporter = nodeMailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const emailBody = {
    from: "Marques <marquuessmalley@gmail.com>",
    to: email,
    subject: "Forgot Password",
    text: message,
  };

  await transporter.sendMail(emailBody);
};

module.exports = sendEmail;
