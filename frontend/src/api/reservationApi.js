import api from "./apiClient";

export async function createReservation(data) {
  const res = await api.post("/reservations", data);
  return res.data;
}

export async function deleteReservation(id) {
  await api.delete(`/reservations/${id}`);
}

export const getMyReservations = async () => {
    const res = await api.get("/reservations/my");
    return res.data;
};

export const subscribeToReservation = async (reservationId, studentId) => {
  await api.post(`/reservations/${reservationId}/subscribe`, null, {
    params: { studentId }
  });
};

export const unsubscribeFromReservation = async (reservationId, studentId) => {
  await api.delete(`/reservations/${reservationId}/subscribe`, {
    params: { studentId }
  });
};

export const getReservationStudents = async (reservationId) => {
    const res = await fetch(`/reservations/${reservationId}/students`, {
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch students");
    }

    return res.json();
};