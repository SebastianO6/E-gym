import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import MembersList from "./members/MembersList";
import MemberDetails from "./members/MemberDetails";
import RevenuePage from "./RevenuePage";
import GymAdminScheduleCalendar from "./GymAdminScheduleCalendar";
import CreateSchedule from "./CreateSchedule";
import PricingSettings from "./settings/PricingSettings";
import Announcements from "./Announcements";
import TrainersList from "./trainers/TrainersList";
import GymSettings from "./settings/GymAdminSettings";
import TrainerDetails from "./trainers/TrainersDetails" 

export default function GymAdminRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />

      <Route path="members" element={<MembersList />} />
      <Route path="members/:memberId" element={<MemberDetails />} />

      <Route path="trainers" element={<TrainersList />} />
      <Route path="trainers/:trainerId" element={<TrainerDetails/>} />

      <Route path="announcements" element={<Announcements />} />

      <Route path="revenue" element={<RevenuePage />} />

      <Route path="schedules/calendar" element={<GymAdminScheduleCalendar />} />
      <Route path="schedules/create" element={<CreateSchedule />} />

      <Route path="settings" element={<GymSettings />} />
      <Route path="settings/pricing" element={<PricingSettings />} />
    </Routes>
  );
}
