import jwt from "jsonwebtoken";

export const getToken = async function (data) {
  let jwtSecretKey = process.env.APP_SECRET;

  const token = await jwt.sign(data, jwtSecretKey);
  return token;
};

export const Authenticate = async function (req, res) {
  let token = req.cookies.token;
  let jwtSecretKey = process.env.APP_SECRET;

  try {
    const verified = await jwt.verify(token, jwtSecretKey);
    if (verified) {
      req.user = verified;
      return res.status(200).json({ message: "Authenticated", user: verified });
    } else {
      return res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
