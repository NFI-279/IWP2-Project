import api from "./apiClient";

export async function getClassrooms(floorId) {
  const res = await api.get(`/floors/${floorId}/classrooms`);
  return res.data;
}