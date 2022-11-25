import Sequelize from "sequelize";
import sequelize from "../DB/config.js";

const Settings = sequelize.define("setting", {
  createdBy: {
    type: Sequelize.STRING,
    required: true,
  },
  emailReminders: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
  whatsappReminders: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  cronInterval: {
    type: Sequelize.STRING,
    defaultValue: "daily",
  },
  serverCrons: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

export default Settings;
