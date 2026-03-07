// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/common/Unauthorized";
import NotFound from "../pages/common/NotFound";

/* ============================
   SUPERADMIN
============================ */
import SaDashboard from "../pages/superadmin/Dashboard";
import SaAllGyms from "../pages/superadmin/AllGyms";
import SaGymDetails from "../pages/superadmin/GymDetails";
import SuperAdminSettings from "../pages/superadmin/settings/SuperAdminSettings";
import SuperAdminAuditLogs from "../pages/superadmin/audit-logs/SuperAdminAuditLogs";



/* ============================
   GYM ADMIN
============================ */
import ForcePasswordChange from "../pages/auth/ForcePasswordChange"; // ✅ Changed path
import AcceptInvite from "../pages/auth/AcceptInvite";
import PricingApproval from "../pages/superadmin/PricingApproval";
import GymAdminRoutes from "../pages/gymadmin/GymAdminRoutes";


/* ============================
   TRAINER
============================ */
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerMembers from "../pages/trainer/members/TrainerMembers";
import TrainerMemberDetails from "../pages/trainer/members/TrainerMemberDetails";
import CreateTrainingPlan from "../pages/trainer/plans/CreateTrainingPlan";
import TrainerSchedule from "../pages/trainer/schedule/TrainerSchedule";
import ScheduleDetail from "../pages/trainer/schedule/ScheduleDetail";

// Trainer Messaging Structure
import TrainerMessages from "../pages/trainer/messages/TrainerMessages";

/* ============================
   CLIENT
============================ */
import ClientDashboard from "../pages/client/Dashboard";
import ClientPlan from "../pages/client/plan/ClientPlan";
import ClientProgress from "../pages/client/ClientProgress";
import ClientSchedule from "../pages/client/clientSchedule";
import Settings from "../pages/client/settings/Settings";
import ClientMessages from "../pages/client/messages/ClientMessages";
import ClientAnnouncements from "../pages/client/messages/announcements/ClientAnnouncements";

/* ============================ */

export default function AppRouter() {
  return (
    <Routes>
      {/* DEFAULT REDIRECT */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/accept-invite" element={<AcceptInvite />} />

      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* ✅ FORCE PASSWORD CHANGE (Standalone route for all roles) */}
      <Route path="/force-password-change" element={<ForcePasswordChange />} />

      <Route path="/accept-invite" element={<AcceptInvite />} />


      {/* ============================
          SUPERADMIN ROUTES
      ============================ */}
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={["superadmin"]}>
            <Layout userRole="superadmin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<SaDashboard />} />
        <Route path="gyms" element={<SaAllGyms />} />
        <Route path="gyms/:gymId" element={<SaGymDetails />} />
        <Route path="pricing" element={<PricingApproval />} />
        <Route path="settings" element={<SuperAdminSettings />} />
        <Route path="audit-logs" element={<SuperAdminAuditLogs />} />
      </Route>


      <Route
        path="/gymadmin/*"
        element={
          <ProtectedRoute allowedRoles={["gymadmin"]}>
            <Layout userRole="gymadmin" />
          </ProtectedRoute>
        }
      >
        <Route path="*" element={<GymAdminRoutes />} />
      </Route>


      {/* ============================
          TRAINER ROUTES
      ============================ */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute allowedRoles={["trainer"]}>
            <Layout userRole="trainer" />
          </ProtectedRoute>
        }
      >
        <Route index element={<TrainerDashboard />} />
        <Route path="members" element={<TrainerMembers />} />
        <Route path="members/:memberId" element={<TrainerMemberDetails />} />
        <Route path="plans/create" element={<CreateTrainingPlan />} />
        <Route path="schedule" element={<TrainerSchedule />} />
        <Route path="/trainer/schedule/:id" element={<ScheduleDetail />} />


        {/* Messaging */}
        <Route path="messages" element={<TrainerMessages />}>
        </Route>
        
        {/* ✅ You might want to add trainer settings later */}
        {/* <Route path="settings" element={<TrainerSettings />} /> */}
      </Route>

      {/* ============================
          CLIENT ROUTES
      ============================ */}
      <Route
        path="/client"
        element={
          <ProtectedRoute allowedRoles={["client"]}>
            <Layout userRole="client" />
          </ProtectedRoute>
        }
      >
        <Route index element={<ClientDashboard />} />
        <Route path="plan" element={<ClientPlan />} />
        <Route path="progress" element={<ClientProgress />} />
        <Route path="messages" element={<ClientMessages />} />
        <Route path="announcements" element={<ClientAnnouncements />} />
        <Route path="schedule" element={<ClientSchedule />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}