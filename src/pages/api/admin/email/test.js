import db from "../../../../DB/config";
import { apiHandler } from "../../../../helpers/api/api-handler";
import { sendEmail } from "../../../../utils/sendMail";
import ejs from "ejs";
import path from "path";
import axios from "axios";
// get current host
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
    const host = req.headers.host;
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const testTemplate = await axios.get(
      `${protocol}://${host}/templates/test.ejs`
    );
    const emailTemplate = await ejs.render(testTemplate.data, {
      heading: "Test Email",
      body: "This is a test email",
    });
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
