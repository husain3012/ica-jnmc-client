import Sequelize from "sequelize";
import sequelize from "../DB/config.js";


const Reminder = sequelize.define("reminder", {
  email: {
    type: Sequelize.STRING,
  },
  phoneNumber: {
    type: Sequelize.STRING,
  },
  sendAt: {
    type: Sequelize.DATE,
  },
  subject: {
    type: Sequelize.STRING,
  },
  message: {
    type: Sequelize.STRING,
  },
});

export default Reminder;
