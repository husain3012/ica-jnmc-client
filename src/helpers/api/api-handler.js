import { errorHandler } from "./error-handler";
import { jwtMiddleware } from "./jwt-middleware";

function apiHandler(handler, protectedRoute = true) {
  return async (req, res) => {
    console.log("apiHandler");

    try {
      // global middleware
      if (protectedRoute) {
        await jwtMiddleware(req, res);
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
