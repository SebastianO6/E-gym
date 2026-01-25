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
import SA_Dashboard from "../pages/superadmin/Dashboard";
import SA_AllGyms from "../pages/superadmin/AllGyms";
import SA_GymDetails from "../pages/superadmin/GymDetails";

/* ============================
   GYM ADMIN
============================ */
import GA_Dashboard from "../pages/gymadmin/Dashboard";
import MembersList from "../pages/gymadmin/members/MembersList";
import MemberDetails from "../pages/gymadmin/members/MemberDetails";
import TrainersList from "../pages/gymadmin/trainers/TrainersList";
import TrainerDetails from "../pages/gymadmin/trainers/TrainersDetails";
import Announcements from "../pages/gymadmin/Announcements";
import CreateSchedule from "../pages/gymadmin/CreateSchedule";
import TrainerSchedules from "../pages/gymadmin/TrainerSchedules";
import ForcePasswordChange from "../pages/auth/ForcePasswordChange"; // ✅ Changed path
import GymAdminSettings from "../pages/gymadmin/settings/GymAdminSettings"; // ✅ Added
import RevenueDashboard from "../pages/gymadmin/RevenueDashboard"; // ✅ Keep this
import AcceptInvite from "../pages/auth/AcceptInvite";

/* ============================
   TRAINER
============================ */
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerMembers from "../pages/trainer/members/TrainerMembers";
import TrainerMemberDetails from "../pages/trainer/members/TrainerMemberDetails";
import CreateTrainingPlan from "../pages/trainer/plans/CreateTrainingPlan";
import TrainerSchedule from "../pages/trainer/schedule/TrainerSchedule";

// Trainer Messaging Structure
import TrainerMessages from "../pages/trainer/messages/TrainerMessages";
import MessagesList from "../pages/trainer/messages/MessagesList";
import ChatWindow from "../pages/trainer/messages/ChatWindow";

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
        <Route index element={<SA_Dashboard />} />
        <Route path="gyms" element={<SA_AllGyms />} />
        <Route path="gyms/:gymId" element={<SA_GymDetails />} />
        {/* ✅ You might want to add superadmin settings later */}
        {/* <Route path="settings" element={<SuperadminSettings />} /> */}
      </Route>

      {/* ============================
          GYM ADMIN ROUTES
      ============================ */}
      <Route
        path="/gymadmin"
        element={
          <ProtectedRoute allowedRoles={["gymadmin"]}>
            <Layout userRole="gymadmin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<GA_Dashboard />} />

        {/* Member management */}
        <Route path="members" element={<MembersList />} />
        <Route path="members/:memberId" element={<MemberDetails />} />

        {/* Trainer management */}
        <Route path="trainers" element={<TrainersList />} />
        <Route path="trainers/:trainerId" element={<TrainerDetails />} />

        {/* Announcements */}
        <Route path="announcements" element={<Announcements />} />
        
        {/* Schedule management */}
        <Route path="schedules" element={<TrainerSchedules />} />
        <Route path="schedules/new" element={<CreateSchedule />} />
        <Route path="schedules/create" element={<CreateSchedule />} />
        
        {/* ✅ GYM ADMIN SETTINGS (moved inside Layout) */}
        <Route path="settings" element={<GymAdminSettings />} />
        
        {/* ✅ REVENUE (moved inside Layout) */}
        <Route path="revenue" element={<RevenueDashboard />} />
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

        {/* Messaging */}
        <Route path="messages" element={<TrainerMessages />}>
          <Route index element={<MessagesList />} />
          <Route path=":memberId" element={<ChatWindow />} />
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