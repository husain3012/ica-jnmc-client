import Sequelize from "sequelize";
import sequelize from "../DB/config.js";

const Form = sequelize.define("form", {
  form: {
    type: Sequelize.JSONB,
    allowNull: false,
  },
  firstVisit: {
    type: Sequelize.DATE,
  },
  secondVisit: {
    type: Sequelize.DATE,
  },
  thirdVisit: {
    type: Sequelize.DATE,
  },
});

export default Form;
