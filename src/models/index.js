import Sequelize from "sequelize";
import User from "./user.model.js";
import Form from "./form.model.js";
import Reminder from "./reminder.model.js";
import Settings from "./settings.model.js";

// associate the User model with the Form model
Form.belongsTo(User);
// associate the Form model with the Reminder model
Form.hasMany(Reminder);

const db = { User, Form, Reminder, Settings };
export default db;
