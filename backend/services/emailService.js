const nodemailer = require('nodemailer');

// Set up transporter
// We use a mock configuration or read from env
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'test_user',
      pass: process.env.SMTP_PASS || 'test_pass',
    },
  });
};

const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const message = {
      from: `${process.env.FROM_NAME || 'KenzoFitness'} <${process.env.FROM_EMAIL || 'noreply@kenzofitness.com'}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html, // Optional HTML version
    };

    const info = await transporter.sendMail(message);
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
