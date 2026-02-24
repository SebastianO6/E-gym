import api from "../api/axios";

export const createSchedule = (data) =>
  api.post("/schedules", data);

export const listTrainerSchedules = async () => {
  const res = await api.get("/schedules/trainer");
  return res.data;   
};

export const updateSchedule = (id, data) =>
  api.put(`/schedules/${id}`, data);

export const getMySchedule = () =>
  api.get("/schedules/client").then(res => res.data);

