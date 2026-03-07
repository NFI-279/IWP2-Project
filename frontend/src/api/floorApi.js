import api from "./apiClient";

export async function getFloors(buildingId) {
  const res = await api.get(`/buildings/${buildingId}/floors`);
  return res.data;
}

export async function getFloor(id) {
  const res = await api.get(`/floors/${id}`);
  return res.data;
}