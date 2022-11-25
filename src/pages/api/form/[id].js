import models from "../../../models";
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
  const form = await models.Form.findOne({ where: { id } });

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

  const form = await models.Form.findOne({ where: { id } });
  if (!form) {
    return res.status(404).send({
      message: "Form not found",
    });
  }
  form.destroy();
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
  const form = await models.Form.findOne({ where: { id } });
  if (!form) {
    return res.status(404).send({
      message: "Form not found",
    });
  }
  form.update({
    form: req.body,
  });
  form.save();
  return res.status(200).json({
    message: "Form updated",
    form,
  });
};
