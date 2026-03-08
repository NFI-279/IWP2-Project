import api from "./apiClient";

export const register = async (data) => {
    const res = await api.post("/auth/register", data);
    return res.data;
};