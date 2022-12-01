import db from "../../../DB/config";
import dayjs from "dayjs";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(
  async (req, res) => {
    switch (req.method) {
      case "GET":
        return await getAllReminders(req, res);

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  },
  { accessLevel: 0 }
);

const getAllReminders = async (req, res) => {
  const reminders = await db.reminders.findMany({});
  return res.status(200).json(reminders);
};
