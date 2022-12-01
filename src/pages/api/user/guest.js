import db from "../../../DB/config";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(
  async (req, res) => {
    switch (req.method) {
      case "GET":
        return getGuestCred(req, res);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  },
  { auth: false }
);

const getGuestCred = async (req, res) => {
  const guest = await db.users.findFirst({
    where: {
      user_id: "guest",
    },
    select: {
      id: true,
      user_id: true,
      email: true,
      level: true,
      password: true,
    },
  });

  return res.json({
    message: "Guest user",
    guest,
  });
};
