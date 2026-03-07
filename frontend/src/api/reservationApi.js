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