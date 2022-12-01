import db from "../../../DB/config";
import { apiHandler } from "../../../helpers/api/api-handler";

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
    orderBy: {
      createdAt: "desc",
    },
    include: {
      users: {
        select: {
          user_id: true,
          email: true,
          level: true,
        },
      },
    },
  };

  if (pageSize) {
    searchQuery.take = pageSize;
  }
  if (currentPage && pageSize) {
    searchQuery.skip = (currentPage - 1) * pageSize;
  }

  let forms = await db.forms.findMany(searchQuery);


  return res.status(200).json(forms);
};
