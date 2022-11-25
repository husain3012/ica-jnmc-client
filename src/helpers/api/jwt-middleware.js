import { expressjwt } from "express-jwt";
import util from "util";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

export const jwtMiddleware = (req, res) => {
  const middleware = expressjwt({
    secret: process.env.APP_SECRET,
    algorithms: ["HS256"],
  }).unless({
    path: [
      // public routes that don't require authentication
      "/api/user/login",
    ],
  });
  console.log("req.auth", req.auth);

  return util.promisify(middleware)(req, res);
};
