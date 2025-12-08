// src/router/AppRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Unauthorized from "../pages/common/Unauthorized";
import NotFound from "../pages/common/NotFound";

// SUPER ADMIN
import SA_Dashboard from "../pages/superadmin/Dashboard";
import SA_AllGyms from "../pages/superadmin/AllGyms";
import SA_GymDetails from "../pages/superadmin/GymDetails";

// GYM ADMIN
import GA_Dashboard from "../pages/gymadmin/Dashboard";
import MembersList from "../pages/gymadmin/members/MembersList";
import MemberDetails from "../pages/gymadmin/members/MemberDetails";

// Gym Admin — Trainer Management
import TrainersList from "../pages/gymadmin/trainers/TrainersList";
import TrainerDetails from "../pages/gymadmin/trainers/TrainersDetails";

// TRAINER
import TrainerDashboard from "../pages/trainer/Dashboard";
import TrainerMembers from "../pages/trainer/members/TrainerMembers";
import TrainerMemberDetails from "../pages/trainer/members/TrainerMemberDetails";
import CreateTrainingPlan from "../pages/trainer/plans/CreateTrainingPlan";
import TrainerSchedule from "../pages/trainer/schedule/TrainerSchedule";

// Trainer Messaging Structure
import TrainerMessages from "../pages/trainer/messages/TrainerMessages";
import MessagesList from "../pages/trainer/messages/MessagesList";
import ChatWindow from "../pages/trainer/messages/ChatWindow";

// CLIENT
import ClientDashboard from "../pages/client/Dashboard";
import ClientPlan from "../pages/client/plan/ClientPlan";
import ClientProgress from "../pages/client/ClientProgress";
import ClientMessages from "../pages/client/messages/ClientMessages";
import Announcements from "../pages/client/messages/announcements/ClientAnnouncements";


export default function AppRouter() {
  return (
    <Routes>
      {/* DEFAULT REDIRECT */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* SUPERADMIN ROUTES */}
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
      </Route>

      {/* GYM ADMIN ROUTES */}
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
      </Route>

      {/* TRAINER ROUTES */}
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

        {/* Messaging structure with nested routes */}
        <Route path="messages" element={<TrainerMessages />}>
          <Route index element={<MessagesList />} />
          <Route path=":memberId" element={<ChatWindow />} />
        </Route>
      </Route>

      {/* CLIENT ROUTES */}
      {/* CLIENT ROUTES */}
      {/* CLIENT ROUTES */}
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
        <Route path="announcements" element={<Announcements />} />
      </Route>




      {/* NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
