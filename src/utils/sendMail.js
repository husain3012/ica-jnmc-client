import nodeMailer from "nodemailer";
export const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

// function to send email
export const sendEmail = async ({ email, subject, message, html }) => {
  const msg = {
    to: email,
    from: process.env.GMAIL_USER,
    subject: subject,
    text: message,
    html: html,
  };
  try {
    const resp = await transporter.sendMail(msg);
    return resp;
  } catch (error) {
    console.log(error);
    return error;
  }
};
