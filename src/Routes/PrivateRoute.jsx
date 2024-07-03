// PrivateRoute.js
import React from "react";
import { Route, Navigate, Outlet, useParams } from "react-router-dom";
import { getLocalData } from "../Utils/localStorage";

function PrivateRoute({ element, ...rest }) {
  const auth = getLocalData("token");

  return  (
    auth ? <Outlet/> : <Navigate to={"/auth/sign-in"}/>
  )
}

export default PrivateRoute;
