import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
// import AddCohorts from "../Pages/AddCohorts";
// import AddActivity from "../Pages/AddActivity";
// import ActivityList from "../Pages/ActivityList";
// import ParticipantsList from "../Pages/ParticipantsList";
// import CohortsList from "../Pages/CohortsList";
import Dashboard from "../layouts/dashboard";
import Auth from "../layouts/auth";
import PrivateRoute from "./PrivateRoute";
// import AddParticipants from "../Pages/AddPartcipants";

const AllRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<AddParticipants />} />
      <Route path="/add-cohort" element={<AddCohorts />} />
      <Route path="/add-activity" element={<AddActivity />} />
      <Route path="/activity-list" element={<ActivityList />} />
      <Route path="/participant-list" element={<ParticipantsList />} />
      <Route path="/cohort-list" element={<CohortsList />} /> */}

      {/* template---------------------- */}
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/mainpage/*" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
      {/* <Route element={<PrivateRoute />}>
      </Route> */}
    </Routes>
  );
};

export default AllRoutes;
