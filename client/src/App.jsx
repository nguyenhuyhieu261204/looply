import { Route, Routes } from "react-router-dom";
import { ROUTES } from "@constants/routes";
import { LoginPage } from "@features/auth/login-page";
import { FeedPage } from "@features/feed/feed-page";

const App = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.FEED} element={<FeedPage />} />
    </Routes>
  );
};

export default App;
