import models from "../../../models";
import dayjs from "dayjs";

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      return await addReminder(req, res);

    default:
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const addReminder = async (req, res) => {
  const { id } = req.params;
  const { email, phoneNumber } = req.body;
  const form = await models.Form.findOne({ where: { id } });
  if (!form) {
    return res.status(404).send({
      message: "Form not found",
    });
  }
  if (!email || email === "") {
    return res.status(400).send({
      message: "Email is required",
    });
  }
  // add reminder to form
  const firstVisit = await Reminder.create({
    email,
    phoneNumber,
    sendAt: new Date() || form.firstVisit,
    subject: "Needle Stick Injury, First Visit",
    message: `Hi, ${
      form.form.name
    }! This is a reminder to attend your first visit, on ${dayjs(
      form.firstVisit
    ).format("ddd, DD-MMM-YYYY")}.`,
  });
  await form.addReminder(firstVisit);

  const secondVisit = await Reminder.create({
    email,
    phoneNumber,
    sendAt: form.secondVisit,
    subject: "Needle Stick Injury, Second Visit",
    message: `Hi, ${
      form.form.name
    }! This is a reminder to attend your second visit, on ${dayjs(
      form.secondVisit
    ).format("ddd, DD-MMM-YYYY")}.`,
  });
  await form.addReminder(secondVisit);
  const thirdVisit = await Reminder.create({
    email,
    phoneNumber,
    sendAt: form.thirdVisit,
    subject: "Needle Stick Injury, Third Visit",
    message: `Hi, ${
      form.form.name
    }! This is a reminder to attend your third visit, on ${dayjs(
      form.thirdVisit
    ).format("ddd, DD-MMM-YYYY")}`,
  });
  await form.addReminder(thirdVisit);
  return res.status(200).json({
    message: "Reminders created",
    firstVisit,
    secondVisit,
    thirdVisit,
  });
};
export default handler;
