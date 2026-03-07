import api from "./apiClient";

export async function createBuilding(name) {
  const res = await api.post("/admin/buildings", { name });
  return res.data;
}

export async function deleteBuilding(id) {
  await api.delete(`/admin/buildings/${id}`);
}

export async function uploadFloor(buildingId, formData) {
  const res = await api.post(
    `/admin/floors/${buildingId}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
}

export async function deleteFloor(id) {
  await api.delete(`/admin/floors/${id}`);
}

export async function createClassroom(floorId, data) {
  const res = await api.post(`/admin/classrooms/${floorId}`, data);
  return res.data;
}

export async function deleteClassroom(id) {
  await api.delete(`/admin/classrooms/${id}`);
}

export async function updateClassroomCoordinates(id, coords) {
  const res = await api.put(`/admin/classrooms/${id}/coordinates`, coords);
  return res.data;
}