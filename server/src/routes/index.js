import express from "express";
import authRoute from "#routes/auth-route";

const router = express.Router();
const routes = [{ path: "/auth", route: authRoute }];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
