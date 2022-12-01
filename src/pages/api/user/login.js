import db from "../../../DB/config";
import { getToken } from "../../../utils/jwt";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(
  async (req, res) => {
    switch (req.method) {
      case "POST":
        return login(req, res);
      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  },
  { auth: false }
);

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await db.users.findFirst({
    where: {
      password: password,
      OR: [
        { user_id: { equals: username || "" } },
        { email: { equals: username || "" } },
      ],
    },
    select: {
      id: true,
      user_id: true,
      email: true,
      level: true,
    },
  });

  if (!user) {
    return res.status(404).send({
      message: "Invalid credentials",
    });
  }

  const token = await getToken({
    id: user.id,
    user_id: user.user_id,
    email: user.email,
    level: user.level,
  });
  return res.json({
    message: "User logged in",
    user,
    token,
  });
};
