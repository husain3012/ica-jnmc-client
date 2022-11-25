import models from "../../../models";

const handler = async (req, res) => {
  switch (req.method) {
    case "PATCH":
      return await updateUser(req, res);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const updateUser = async (req, res) => {
  // check if admin is trying to update a user
  if (!req.user || req.user.level !== 0) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const { id, password, level } = req.body;
  const user = await models.User.findOne({ where: { id } });

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  user.update({
    password: password ? password : user.password,
    level: level ? level : user.level,
  });

  return res.status(200).json({
    message: "User updated",
    user,
  });
};

export default handler;
