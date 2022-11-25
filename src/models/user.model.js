import Sequelize from "sequelize";
import sequelize from "../DB/config.js";

const User = sequelize.define("user", {
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  level: {
    type: Sequelize.INTEGER,
    defaultValue: 2,
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: "default",
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

export default User;
