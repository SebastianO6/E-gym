import api from "../api/axios";

export const createSchedule = (data) =>
  api.post("/schedules", data);

export const listTrainerSchedules = () =>
  api.get("/schedules").then(res => res.data);

export const getMySchedule = () =>
  api.get("/schedules/my").then(res => res.data);

/* 🆕 UPDATE / CANCEL */
export const updateSchedule = (id, data) =>
  api.put(`/schedules/${id}`, data);
