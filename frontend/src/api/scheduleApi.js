import api from "./apiClient";

export async function getClassroomSchedule(classroomId, week) {
  const res = await api.get(`/classrooms/${classroomId}/schedule?week=${week}`);
  return res.data;
}