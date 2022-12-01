import { errorHandler } from "./error-handler";
import { jwtMiddleware } from "./jwt-middleware";
BigInt.prototype.toJSON = function () {
  return this.toString();
};

function apiHandler(
  handler,
  options = {
    auth: true,
    errorHandler: true,
    disabled: false,
    accessLevel: Infinity,
  }
) {
  return async (req, res) => {
    if (options.disabled) {
      return res.status(404).end(`This route is disabled`);
    }
    try {
      // global middleware
      if (options.auth) {
        await jwtMiddleware(req, res);
        if (!req.auth || parseInt(req.auth.level) > options.accessLevel) {
          return res.status(401).end(`Unauthorized`);
        }
        const { id, user_id, email, level, iat } = req.auth;
        req.user = {
          id,
          user_id,
          email,
          level: parseInt(level),
          iat,
        };
      }

      // route handler
      await handler(req, res);
    } catch (err) {
      // global error handler
      errorHandler(err, res);
    }
  };
}
export { apiHandler };
