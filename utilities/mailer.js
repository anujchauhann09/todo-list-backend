const nodemailer = require('nodemailer');

// console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  console.log(process.env.EMAIL_USER)
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response); 
    return 'Email sent';
  } catch (error) {
    console.error('Error sending email:', error.message); 
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
