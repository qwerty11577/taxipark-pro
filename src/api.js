const API_URL = "https://taxipark-backend.onrender.com";

const getToken = () => localStorage.getItem("token");

const headers = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

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

export const getMe = async () => {
  const res = await fetch(`${API_URL}/auth/me`, { headers: headers() });
  if (!res.ok) throw await res.json();
  return res.json();
};

// DRIVERS
export const getDrivers = async () => {
  const res = await fetch(`${API_URL}/drivers/`, { headers: headers() });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const createDriver = async (data) => {
  const res = await fetch(`${API_URL}/drivers/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const deleteDriver = async (id) => {
  const res = await fetch(`${API_URL}/drivers/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

// CARS
export const getCars = async () => {
  const res = await fetch(`${API_URL}/cars/`, { headers: headers() });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const createCar = async (data) => {
  const res = await fetch(`${API_URL}/cars/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const deleteCar = async (id) => {
  const res = await fetch(`${API_URL}/cars/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

// ORDERS
export const getOrders = async () => {
  const res = await fetch(`${API_URL}/orders/`, { headers: headers() });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const createOrder = async (data) => {
  const res = await fetch(`${API_URL}/orders/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const updateOrder = async (id, data) => {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json();
  return res.json();
};

export const getOrderStats = async () => {
  const res = await fetch(`${API_URL}/orders/stats`, { headers: headers() });
  if (!res.ok) throw await res.json();
  return res.json();
};