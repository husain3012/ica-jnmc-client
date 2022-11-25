import models from "../../../models";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getAllUsers(req, res);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});

const getAllUsers = async (req, res) => {
  // check if admin is trying to get all users
  if (!req.user || req.user.level !== 0) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  // get all users sorted by createdAt

  const users = await models.User.findAll({
    order: [["createdAt", "DESC"]],
    attributes: ["id", "user_id", "email", "level", "role", "createdAt"],
  });
  return res.status(200).json(users);
};
