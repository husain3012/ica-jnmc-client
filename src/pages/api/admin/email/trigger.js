import db from "../../../../DB/config";
import { apiHandler } from "../../../../helpers/api/api-handler";
import { findAndSendReminders } from "../../../../utils/reminderMail";

export default apiHandler(async (req, res) => {
  switch (req.method) {
    case "POST":
      return await triggerEmails(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});

const triggerEmails = async (req, res) => {
  const sentReminders = await findAndSendReminders();
  return res.status(200).json(sentReminders);
};
