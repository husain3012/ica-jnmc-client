import db from "../../../DB/config";
import { apiHandler } from "../../../helpers/api/api-handler";

export default apiHandler(async (req, res) => {
  switch (req.method) {
    case "GET":
      return await getForm(req, res);
    case "PATCH":
      return await updateForm(req, res);
    case "DELETE":
      return await deleteForm(req, res);
    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
});

const getForm = async (req, res) => {
  const { id } = req.query;
  const form = await db.forms.findUnique({
    where: { id: BigInt(id) },
    include: {
      users: {
        select: {
          id: true,
          user_id: true,
          email: true,
          level: true,
        },
      },
    },
  });

  if (!form) {
    return res.status(404).send({
      message: "Form not found",
    });
  }

  return res.status(200).json(form);
};

const deleteForm = async (req, res) => {
  if (!req.user || req.user.level > 0) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  const { id } = req.query;

  const form = await db.forms.delete({ where: { id: BigInt(id) } });
  if (!form) {
    return res.status(404).send({
      message: "Form not found",
    });
  }

  return res.status(200).json({
    message: "Form deleted",
  });
};

const updateForm = async (req, res) => {
  if (!req.user || req.user.level > 1) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }
  const { id } = req.query;
  const form = await db.forms.update({ where: { id }, data: req.body });
  if (!form) {
    return res.status(404).send({
      message: "Form not found",
    });
  }
  return res.status(200).json({
    message: "Form updated",
    form,
  });
};
