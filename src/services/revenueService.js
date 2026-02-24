import api from "../api/axios";

export const getRevenueSummary = async () => {
  const res = await api.get("/gymadmin/revenue");
  return res.data;
};
