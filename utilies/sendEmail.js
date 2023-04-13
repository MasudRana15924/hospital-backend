const nodeMailer = require("nodemailer");

const SendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
     port: 465,
     service: 'gmail',
    auth: {
      user: "masudrana15924@gmail.com",
      pass: "wgbhfruaanfqnrsr",
    },
  });

  const mailOptions = {
    from: 'masudrana15924@outlook.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};
