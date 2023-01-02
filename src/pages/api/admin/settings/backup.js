import db from "../../../../DB/config";
import { apiHandler } from "../../../../helpers/api/api-handler";
import dayjs from "dayjs";
import { parse, unparse } from "papaparse";
export default apiHandler(async (req, res) => {
  switch (req.method) {
    case "GET":
      return await downloadBackup(req, res);
    case "POST":
      return await uploadBackup(req, res);
  }
});

const downloadBackup = async (req, res) => {
  // download whole database as a backup
  const forms = await db.forms.findMany({
    include: {
      users: true,
    },
  });

  const expandedForms = forms.map((form) => {
    const formData = form.form;
    const user = {
      user_id: form.users.id,
      email: form.users.email,
      level: form.users.level,
    };
    delete form.users;
    delete form.userId;
    delete form.form;
    return {
      ...form,
      ...formData,
      ...user,
    };
  });

  try {
    const forms_csv = unparse(expandedForms);
    const today = dayjs().format("YYYY-MM-DD");
    res.setHeader("content-type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename=${today}.csv`);
    res.send(forms_csv);
  } catch (error) {
    res.json(error);
    console.error(error);
  }
};

const uploadBackup = async (req, res) => {
  // upload whole database as a backup after converting it to json

  if (!req.user || req.user.level > 0) {
    return res.status(401).send({
      message: "Unauthorized",
    });
  }

  let csvString = req.body.split("Content-Type: text/csv")[1].trim();
  // remove last line containing the boundary
  csvString = csvString.split("\n").slice(0, -1).join("\n").trim();

  let jsonData = parse(csvString, {
    header: true,
    skipEmptyLines: true,
  });
  // convert stringified array to array
  jsonData = jsonData.data.map((entry) => {
    const investigationsSent =
      entry.investigationsSent?.split(",").filter((w) => w !== "") || [];
    return {
      ...entry,
      investigationsSent,
    };
  });

  // delete all forms
  await db.forms.deleteMany({});
  const formsData = jsonData.map((entry) => {
    const NON_FORM_FIELDS = [
      "id",
      "createdAt",
      "updatedAt",
      "user_id",
      "email",
      "level",
      "firstVisit",
      "secondVisit",
      "thirdVisit",
    ];
    const formFields = Object.keys(entry).filter(
      (key) => !NON_FORM_FIELDS.includes(key)
    );
    const form = formFields.reduce((acc, key) => {
      acc[key] = entry[key];
      return acc;
    }, {});

    return {
      form,
      firstVisit: entry.firstVisit,
      secondVisit: entry.secondVisit,
      thirdVisit: entry.thirdVisit,
      userId: BigInt(req.user.id),
      createdAt: new Date(entry.createdAt),
    };
  });

  await db.forms.createMany({
    data: formsData,
  });

  return res.status(200).json({
    message: "Backup uploaded",
  });
};
