import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ROUTES } from "@constants/routes";
import { LoginPage } from "@features/auth/login-page";
import { FeedPage } from "@/features/feed/pages/feed-page";
import { MainLayout } from "@components/layouts/main-layout";
import { CreateFeedPage } from "./features/feed/pages/create-feed-page";
import PrivateRoute from "./components/private-route";

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path={ROUTES.FEED.READ} element={<FeedPage />} />
            <Route path={ROUTES.FEED.CREATE} element={<CreateFeedPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
