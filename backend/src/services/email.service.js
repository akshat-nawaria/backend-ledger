const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});


// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"LedgerX" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail, name){
    const subject = "Welcome to LedgerX";
    const text = `Hello ${name},\n\nThank you for registering at LedgerX. We\'re excited to have you on board!\n\nBest regards,\nThe LedgerX Team`;
    const html = `<p>Hello ${name},</p><p>Thank you for registering at LedgerX. We're excited to have you on board!</p><p>Best regards,<br>The LedgerX Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount){
    const subject = "Transaction Successful - LedgerX";
    const text = `Hello ${name},\n\nYour transaction of ₹${amount} to account ${toAccount} has been completed successfully.\n\nIf you did not authorize this transaction, please contact us immediately.\n\nBest regards,\nThe LedgerX Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of <strong>₹${amount}</strong> to account <strong>${toAccount}</strong> has been completed successfully.</p><p>If you did not authorize this transaction, please contact us immediately.</p><p>Best regards,<br>The LedgerX Team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransacionFailureEmail(email, name, amount){
    const subject = "Transaction Failed - LedgerX";
    const text = `Hello ${name},\n\nYour transaction of ₹${amount} has failed. This could be due to insufficient balance or an account issue.\n\nPlease check your account and try again. If the issue persists, contact our support team.\n\nBest regards,\nThe LedgerX Team`;
    const html = `<p>Hello ${name},</p><p>Your transaction of <strong>₹${amount}</strong> has <span style="color:red;"><strong>failed</strong></span>. This could be due to insufficient balance or an account issue.</p><p>Please check your account and try again. If the issue persists, contact our support team.</p><p>Best regards,<br>The LedgerX Team</p>`;

    await sendEmail(email, subject, text, html);
}

async function sendAccountCreationEmail(email, userName, accountName, accountId){
    const subject = `New Account Opened: ${accountName} - LedgerX`;
    const text = `Hello ${userName},\n\nYou have successfully opened a new account: ${accountName} (ID ending in ${accountId.toString().slice(-4)}).\n\nIf you did not authorize this action, please contact us immediately.\n\nBest regards,\nThe LedgerX Team`;
    const html = `<p>Hello ${userName},</p><p>You have successfully opened a new account: <strong>${accountName}</strong> (ID ending in ${accountId.toString().slice(-4)}).</p><p>If you did not authorize this action, please contact us immediately.</p><p>Best regards,<br>The LedgerX Team</p>`;

    await sendEmail(email, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendTransactionEmail,
    sendTransacionFailureEmail,
    sendAccountCreationEmail
};