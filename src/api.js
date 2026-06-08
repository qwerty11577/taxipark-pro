const API_URL = "https://taxipark-backend.onrender.com";

const getToken = () => localStorage.getItem("token");

const handleUnauthorized = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

const request = async (url, options = {}) => {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw { detail: "Не авторизован" };
  }
  if (!res.ok) throw await res.json();
  return res.json();
};

// AUTH
export const registerUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const getMe = async () => request("/auth/me");

// DRIVERS
export const getDrivers = async () => request("/drivers/");
export const createDriver = async (data) => request("/drivers/", { method: "POST", body: JSON.stringify(data) });
export const deleteDriver = async (id) => request(`/drivers/${id}`, { method: "DELETE" });
export const updateDriver = async (id, data) => request(`/drivers/${id}`, { method: "PUT", body: JSON.stringify(data) });

// CARS
export const getCars = async () => request("/cars/");
export const createCar = async (data) => request("/cars/", { method: "POST", body: JSON.stringify(data) });
export const deleteCar = async (id) => request(`/cars/${id}`, { method: "DELETE" });

// ORDERS
export const getOrders = async () => request("/orders/");
export const createOrder = async (data) => request("/orders/", { method: "POST", body: JSON.stringify(data) });
export const updateOrder = async (id, data) => request(`/orders/${id}`, { method: "PUT", body: JSON.stringify(data) });
export const getOrderStats = async () => request("/orders/stats");