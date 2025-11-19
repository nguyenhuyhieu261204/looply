import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "./auth-sclice";
import { ROUTES } from "@/constants/routes";

export const useLogin = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const { isAuthenticated, accessToken, user } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createOAuthLoginHandler = React.useCallback(
    (provider) => {
      return async () => {
        setIsLoading(true);
        setError(null);

        const apiOrigin = new URL(import.meta.env.VITE_API_URL).origin;
        const popupUrl = `${apiOrigin}/auth/${provider}`;

        const popupWindow = window.open(
          popupUrl,
          "_blank",
          "width=600,height=500"
        );

        if (!popupWindow) {
          const errMessage =
            "Popup blocked. Please allow popups for this site.";
          setError(errMessage);
          setIsLoading(false);
          toast.error(errMessage);
          return;
        }

        const messageHandler = (event) => {
          if (event.origin !== apiOrigin) {
            console.warn(
              "⛔ Blocked message from invalid origin:",
              event.origin
            );
            return;
          }

          const eventData = event.data;

          if (eventData.type === "OAUTH_SUCCESS") {
            dispatch(setCredentials(eventData.payload));
            toast.success("Login successful!");
            cleanup();
            navigate(ROUTES.FEED);
            return;
          }

          if (eventData.type === "OAUTH_FAILED") {
            toast.error(eventData.payload.message);
            setError(eventData.payload.message);
            cleanup();
            return;
          }
        };

        const interval = setInterval(() => {
          if (popupWindow.closed) {
            cleanup();
          }
        }, 500);

        const cleanup = () => {
          setIsLoading(false);
          window.removeEventListener("message", messageHandler);
          clearInterval(interval);
          if (!popupWindow.closed) popupWindow.close();
        };

        window.addEventListener("message", messageHandler);
      };
    },
    [dispatch, navigate]
  );

  return {
    isLoading,
    error,
    isAuthenticated,
    accessToken,
    user,
    actions: {
      loginWithGoogle: createOAuthLoginHandler("google"),
      loginWithFacebook: createOAuthLoginHandler("facebook"),
    },
  };
};
