import express from "express";
import authRoute from "#routes/auth-route";
import feedRoute from "#routes/feed-route";

const router = express.Router();
const routes = [
  { path: "/auth", route: authRoute },
  { path: "/feed", route: feedRoute },
];

routes.forEach(({ path, route }) => {
  router.use(path, route);
});

export default router;
