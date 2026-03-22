import api from "./apiClient";

export async function getClassroomSchedule(classroomId, week, userId) {
  const res = await api.get(
    `/classrooms/${classroomId}/schedule`,
    {
      params: {
        week: week,
        userId: userId
      }
    }
  );

  return res.data;
}