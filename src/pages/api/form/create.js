import models from "../../../models";
import dayjs from "dayjs";
import { sendEmail } from "../../../utils/sendMail";
import { apiHandler } from "../../../helpers/api/api-handler";
export default apiHandler(async (req, res) => {
  if (req.method === "POST") {
    return await createForm(req, res);
  }
  return res.status(405).end(`Method ${req.method} Not Allowed`);
});

const createForm = async (req, res) => {
  const { name, injuryTime } = req.body;

  // next visit date
  const firstVisit = dayjs(injuryTime).add(1.5, "month").format("YYYY-MM-DD");
  const secondVisit = dayjs(injuryTime).add(3, "month").format("YYYY-MM-DD");
  const thirdVisit = dayjs(injuryTime).add(6, "month").format("YYYY-MM-DD");

  const newForm = await models.Form.create({
    form: req.body,
    firstVisit,
    secondVisit,
    thirdVisit,
  });
  const findUser = await models.User.findOne({
    where: {
      id: req.user.id,
    },
  });
  await newForm.setUser(findUser);

  const admins = await models.User.findAll({
    attributes: ["email"],
    where: {
      level: 0,
    },
  });
  const adminEmails = admins.map((admin) => admin.email);
  try {
    await sendEmail({
      email: adminEmails,
      subject: `New Needle Stick Injury form by ${name}`,
      html: `
          <h1>New Needle Stick Injury form by ${name}</h1>
          <p>${name} (${req.user.email}) has submitted a new Needle Stick Injury form. Please login to the application to view the form, or <a target='_blank' rel='noreferrer' href='${process.env.APP_URL}/forms/needle-stick/${newForm.id}'>click here.</a></p>
          `,
    });
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({
    message: "Form created",
    newForm,
  });
};
