import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ROUTES } from "@constants/routes";
import { LoginPage } from "@features/auth/login-page";
import { FeedPage } from "@features/feed/feed-page";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.FEED} element={<FeedPage />} />
      </Routes>
    </div>
  );
};

export default App;
