import { sendEmail } from "./sendMail";
import dayjs from "dayjs";
import db from "../DB/config";
import ejs from "ejs";
import path from "path";
import generateCalendarLinks from "./calendar-link";
__dirname = path.resolve();

// const cron_intervals = {
//   daily: "0 0 * * *",
//   weekly: "0 0 * * 0",
//   every_minute: "* * * * *",
//   sunday_morning: "0 0 * * 0",
//   sunday_random_between_8_and_10: "0 0 8-10 * * 0",
//   daily_random_between_8_and_10: "0 0 8-10 * * *",
//   every_third_day: "0 0 * * */3",
//   every_third_day_random_between_8_and_10: "0 0 8-10 */3 * *",
// };

export const findAndSendReminders = async () => {
  const reminders = await db.reminders.findMany({
    where: {
      sendAt: {
        lte: new Date(), // for testing
        // gte: dayjs().subtract(3, "day").startOf("day").toDate(),
        // lte: dayjs().add(3, "day").endOf("day").toDate(),
      },
    },
    include: {
      forms: true,
    },
  });
  // send email to each user and delete reminder
  for (let reminder of reminders) {
    const { email, phoneNumber, subject, message } = reminder;

    const emailPage = await ejs.renderFile(
      `${__dirname}/src/templates/reminder-email.ejs`,
      {
        heading: subject,
        body: message,
        buttonText: "Add Reminder",
      }
    );
    sendEmail({
      email,
      subject,
      html: emailPage,
    });
  }
  // delete reminders
  await db.reminders.deleteMany({
    where: {
      id: {
        in: reminders.map((r) => r.id),
      },
    },
  });

  return reminders;
};

// export const emailReminders = cron.schedule(
//   // send email reminder every sunday at random time between 8am and 10am
//   cron_intervals.every_third_day_random_between_8_and_10,
//   // run every minute for testing
//   // cron_intervals.every_minute,
//   async () => {
//     await findAndSendReminders();
//   },
//   {
//     scheduled: false,
//   }
// );
