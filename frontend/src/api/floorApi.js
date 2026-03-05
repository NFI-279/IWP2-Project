import api from "./apiClient";

export async function getFloors(buildingId) {
  const res = await api.get(`/buildings/${buildingId}/floors`);
  return res.data;
}