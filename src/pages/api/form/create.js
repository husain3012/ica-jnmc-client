import db from "../../../DB/config";
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
  const firstVisit = dayjs(injuryTime).add(1.5, "month").toDate();
  const secondVisit = dayjs(injuryTime).add(3, "month").toDate();
  const thirdVisit = dayjs(injuryTime).add(6, "month").toDate();

  const newForm = await db.forms.create({
    data: {
      form: req.body,
      firstVisit,
      secondVisit,
      thirdVisit,
      userId: BigInt(req.user.id),
    },
  });

  const admins = await db.users.findMany({
    where: {
      level: 0,
    },
    select: {
      email: true,
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
  console.log(newForm);

  return res.status(201).json({
    message: "Form created",
    newForm
  });
};
