import db from "../../../../DB/config";
import { apiHandler } from "../../../../helpers/api/api-handler";
import { sendEmail } from "../../../../utils/sendMail";
import ejs from "ejs";
import path from "path";
__dirname = path.resolve();
export default apiHandler(async (req, res) => {
  switch (req.method) {
    case "POST":
      return await testEmailService(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});

const testEmailService = async (req, res) => {
  const { email } = req.body;
  try {
    const emailTemplate = await ejs.renderFile(
      `${__dirname}/src/templates/test.ejs`,
      {
        heading: "Test Email",
        body: "This is a test email",
      }
    );
    const emailResp = await sendEmail({
      email: email,
      subject: "Test Email",
      html: emailTemplate,
    });
    return res.status(200).json({
      message: "Email sent",
      emailResp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Email not sent",
      error,
    });
  }
};
