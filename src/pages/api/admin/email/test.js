import db from "../../../../DB/config";
import { apiHandler } from "../../../../helpers/api/api-handler";
import { sendEmail } from "../../../../utils/sendMail";

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
    const emailResp = await sendEmail({
      email: email,
      subject: "Test Email",
      message: `
            This is a test email from PEP JNMC webapp.
        `,
    });
    return res.status(200).json({
      message: "Email sent",
      emailResp,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Email not sent",
      error,
    });
  }
};
