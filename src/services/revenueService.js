import api from "../api/axios";

export const getRevenueSummary = async () => {
  const res = await api.get("/revenue/summary");
  return res.data;
};
