const cron = require("node-cron");
const { Reminder } = require("../models/");
const { Op } = require("sequelize");
const { sendEmail } = require("../utils/sendMail");
const dayjs = require("dayjs");
const cron_intervals = {
  daily: "0 0 * * *",
  weekly: "0 0 * * 0",
  every_minute: "* * * * *",
  sunday_morning: "0 0 * * 0",
  sunday_random_between_8_and_10: "0 0 8-10 * * 0",
  daily_random_between_8_and_10: "0 0 8-10 * * *",
  every_third_day: "0 0 * * */3",
  every_third_day_random_between_8_and_10: "0 0 8-10 */3 * *",
};

export const findAndSendReminders = async () => {
  const reminders = await Reminder.findAll({
    where: {
      sendAt: {
        // [Op.lte]: new Date(), // for testing
        [Op.between]: [dayjs().subtract(3, "day").toDate(), dayjs().add(3, "day").toDate()],
      },
    },
  });
  // send email to each user and delete reminder
  for (let reminder of reminders) {
    const { email, phoneNumber, subject, message } = reminder;
    sendEmail({
      email,
      subject,
      message,
    });
    await reminder.destroy();
  }
  return reminders;
};

export const emailReminders = cron.schedule(
  // send email reminder every sunday at random time between 8am and 10am
  cron_intervals.every_third_day_random_between_8_and_10,
  // run every minute for testing
  // cron_intervals.every_minute,
  async () => {
    await findAndSendReminders();
  },
  {
    scheduled: false,
  }
);


