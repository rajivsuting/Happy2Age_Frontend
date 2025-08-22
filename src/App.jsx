import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Pages from "./pages";
import axios from "axios";
import ActivityDetails from "./pages/ActivityDetails";
import EditActivity from "./pages/EditActivity";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";
import CenterAnalytics from "./pages/CenterAnalytics";
import ReportHistory from "./pages/reports/ReportHistory";
import ReportDetails from "./pages/reports/ReportDetails";
import Calendar from "./pages/calendar/Calendar";
import NewSession from "./pages/NewSession";

// Set axios defaults
axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            <Route path="/" element={<Pages.Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Routes>
                    <Route element={<Layout />}>
                      <Route path="dashboard" element={<Pages.Dashboard />} />
                      <Route path="members" element={<Pages.Members />} />
                      <Route path="members/new" element={<Pages.NewMember />} />
                      <Route
                        path="members/edit/:id"
                        element={<Pages.EditMember />}
                      />
                      <Route
                        path="members/:id"
                        element={<Pages.MemberDetails />}
                      />
                      <Route path="centers" element={<Pages.Centers />} />
                      <Route
                        path="centers/:id"
                        element={<Pages.CenterDetails />}
                      />
                      <Route
                        path="centers/edit/:id"
                        element={<Pages.EditCenter />}
                      />
                      <Route path="centers/new" element={<Pages.AddCenter />} />
                      <Route path="activities" element={<Pages.Activities />} />
                      <Route
                        path="activities/new"
                        element={<Pages.NewActivity />}
                      />
                      <Route
                        path="activities/:id"
                        element={<ActivityDetails />}
                      />
                      <Route
                        path="activities/edit/:id"
                        element={<EditActivity />}
                      />
                      <Route
                        path="evaluation-master"
                        element={<Pages.EvaluationMasterList />}
                      />
                      <Route
                        path="evaluation-master/new"
                        element={<Pages.NewDomain />}
                      />
                      <Route
                        path="evaluation-master/:id"
                        element={<Pages.DomainDetails />}
                      />
                      <Route
                        path="evaluation-master/edit/:id"
                        element={<Pages.EditDomain />}
                      />
                      <Route path="sessions">
                        <Route path="list" element={<Pages.SessionList />} />
                        <Route
                          path="attendance"
                          element={<Pages.Attendance />}
                        />
                        <Route path=":id" element={<Pages.SessionDetails />} />
                        <Route
                          path="edit/:id"
                          element={<Pages.EditSession />}
                        />
                      </Route>
                      <Route
                        path="evaluations"
                        element={<Pages.Evaluations />}
                      />
                      <Route
                        path="evaluations/new"
                        element={<Pages.NewEvaluation />}
                      />
                      <Route
                        path="evaluations/:id"
                        element={<Pages.EvaluationDetails />}
                      />
                      <Route
                        path="evaluations/edit/:id"
                        element={<Pages.EditEvaluation />}
                      />
                      <Route path="reports">
                        <Route
                          path="all-center"
                          element={<Pages.AllCenterReport />}
                        />
                        <Route path="center" element={<Pages.CenterReport />} />
                        <Route path="member" element={<Pages.MemberReport />} />
                        <Route path="history" element={<ReportHistory />} />
                        <Route path="history/:id" element={<ReportDetails />} />
                      </Route>
                      <Route
                        path="/analytics/performance"
                        element={<Pages.PerformanceTrends />}
                      />
                      <Route
                        path="oxford-happiness"
                        element={<Pages.OxfordHappiness />}
                      />
                      <Route
                        path="oxford-happiness/add"
                        element={<Pages.AddOxfordHappiness />}
                      />
                      <Route
                        path="oxford-happiness/edit/:id"
                        element={<Pages.EditOxfordHappiness />}
                      />
                      <Route path="casp-19" element={<Pages.Casp19 />} />
                      <Route path="casp-19/add" element={<Pages.AddCasp19 />} />
                      <Route
                        path="casp-19/edit/:id"
                        element={<Pages.EditCasp19 />}
                      />
                      <Route path="moca" element={<Pages.Moca />} />
                      <Route path="moca/add" element={<Pages.AddMoca />} />
                      <Route
                        path="moca/edit/:id"
                        element={<Pages.EditMoca />}
                      />
                      <Route
                        path="attendance/:id"
                        element={<Pages.AttendanceDetails />}
                      />
                      <Route
                        path="analytics/centers"
                        element={<CenterAnalytics />}
                      />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/session/new" element={<NewSession />} />
                      <Route
                        path="upcoming-features"
                        element={<Pages.UpcomingFeatures />}
                      />
                      <Route
                        path="caregiver-dashboard-preview"
                        element={<Pages.CaregiverDashboardPreview />}
                      />
                      <Route
                        path="family-portal-preview"
                        element={<Pages.FamilyPortalPreview />}
                      />
                      <Route
                        path="cross-community-insights"
                        element={<Pages.CrossCommunityInsights />}
                      />
                      <Route
                        path="member-domain-progress"
                        element={<Pages.MemberDomainProgress />}
                      />
                      <Route
                        path="tech-enabled-activities"
                        element={<Pages.TechEnabledActivities />}
                      />
                      <Route
                        path="tech-communication-sessions"
                        element={<Pages.TechCommunicationAndSessions />}
                      />
                      <Route
                        path="session-activity-overview"
                        element={<Pages.SessionActivityOverview />}
                      />
                      <Route
                        path="expansion-module"
                        element={<Pages.ExpansionModule />}
                      />
                      <Route
                        path="automated-data-analysis"
                        element={<Pages.AutomatedDataAnalysis />}
                      />
                      <Route
                        path="click-here-games"
                        element={<Pages.ClickHereGames />}
                      />
                    </Route>
                  </Routes>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
