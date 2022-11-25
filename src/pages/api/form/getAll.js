import models from "../../../models";
import { apiHandler } from "../../../helpers/api/api-handler";
import User from "../../../models/user.model";

export default apiHandler(async (req, res) => {
  if (req.method === "GET") {
    return await getAllForms(req, res);
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
});

const getAllForms = async (req, res) => {
  if (!req.user || req.user.level > 1) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  const { currentPage, pageSize } = req.query;
  const searchQuery = {
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["id", "email", "user_id", "level"],
      },
    ],
  };
  if (pageSize) {
    searchQuery.limit = pageSize;
  }
  if (currentPage && pageSize) {
    searchQuery.offset = (currentPage - 1) * pageSize;
  }

  const forms = await models.Form.findAll(searchQuery);
  return res.status(200).json(forms);
};
