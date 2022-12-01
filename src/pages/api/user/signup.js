import db from "../../../DB/config";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(
  async (req, res) => {
    switch (req.method) {
      case "POST":
        return await signupUser(req, res);

      default:
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  },
  {
    auth: false,
    disabled: false,
  }
);

const signupUser = async (req, res) => {
  // check if admin is trying to create a new user
  // if (!req.user || req.user.level !== 0) {
  //   return res.status(401).send({
  //     message: "Unauthorized",
  //   });
  // }

  const { user_id, email, password, level } = req.body;
  const user = await db.users.create({
    data: {
      user_id,
      email,
      password,
      level,
    },
  });

  return res.status(201).json({
    message: "User created",
    user,
  });
};
