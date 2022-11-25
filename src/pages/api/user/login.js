import db from "../../../models";
import { getToken } from "../../../utils/jwt";
import { Op } from "sequelize";
function handler(req, res) {
  switch (req.method) {
    case "POST":
      return login(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const login = async (req, res) => {
  const { username, password } = req.body;


  const user = await db.User.findOne({
    where: {
      password: password,
      [Op.or]: [
        { user_id: { [Op.eq]: username || "" } },
        { email: { [Op.eq]: username || "" } },
      ],
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
    user: {
      id: user.id,
      user_id: user.user_id,
      email: user.email,
      level: user.level,
      token,
    },
  });
};

export default handler;
