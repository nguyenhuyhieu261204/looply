/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { api } from "@/axios";
import { setCredentials } from "@/features/auth/auth-slice";
import { Loading } from "./loading";
import { ROUTES } from "@/constants/routes";

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, accessToken } = useSelector(
    (state) => state.auth
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");

        if (res.data.success) {
          const currentUser = res.data.data.user;
          dispatch(
            setCredentials({
              accessToken,
              user: currentUser,
            })
          );
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  if (!loading && error && (!user || !isAuthenticated)) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
