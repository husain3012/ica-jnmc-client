import db from "../../../DB/config";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(async (req, res) => {
  switch (req.method) {
    case "PATCH":
      return await updateUser(req, res);
    case "DELETE":
      return await deleteUser(req, res);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});

const updateUser = async (req, res) => {
  // check if admin is trying to update a user
  if (!req.user || req.user.level !== 0) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const { id, password, level } = req.body;
  const user = await db.users.findUnique({ where: { id } });

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

const deleteUser = async (req, res) => {
  // check if admin is trying to delete a user
  if (!req.user || req.user.level !== 0) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const { id } = req.query;
  const user = await db.users.delete({ where: { id: BigInt(id) } });

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }


  return res.status(200).json({
    message: "User deleted",
    user,
  });
};
