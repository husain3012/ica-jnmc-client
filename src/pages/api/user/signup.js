import models from "../../../models";

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return await signupUser(req, res);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const signupUser = async (req, res) => {
  // check if admin is trying to create a new user
  // if (!req.user || req.user.level !== 0) {
  //   return res.status(401).send({
  //     message: "Unauthorized",
  //   });
  // }

  const { user_id, email, password, level } = req.body;
  const user = await models.User.create({
    user_id,
    email,
    password,
    level,
  });

  return res.status(201).json({
    message: "User created",
    user,
  });
};

export default handler;
