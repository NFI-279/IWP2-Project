import api from "./apiClient";

export async function getBuildings() {
  const res = await api.get("/buildings");
  return res.data;
}