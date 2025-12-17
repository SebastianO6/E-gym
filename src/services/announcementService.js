// src/services/announcementService.js
import api from "../api/axios";

export async function listAnnouncements(gymId) {
  // gymId optional - server will resolve based on current user when omitted
  const url = gymId ? `/gymadmin/announcements?gym_id=${gymId}` : "/gymadmin/announcements";
  const res = await api.get(url);
  return res.data;
}

export async function createAnnouncement(payload) {
  const res = await api.post("/gymadmin/announcements", payload);
  return res.data;
}
