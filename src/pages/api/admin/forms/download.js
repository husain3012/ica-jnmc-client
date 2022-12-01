import db from "../../../../DB/config";
import { apiHandler } from "../../../../helpers/api/api-handler";

export default apiHandler(async (req, res) => {});

const download = async (req, res) => {
  const allForms = await db.forms.findMany();
  console.log(allForms);
  //   find all keys recuresively in a form entry
  const keys = new Set();
  const columns = [
    "id",
    "name",
    "email",
    "phoneNumber",
    "firstVisit",
    "secondVisit",
    "thirdVisit",
    "createdAt",
    "updatedAt",
  ];
};
