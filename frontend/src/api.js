const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001';

const authHeaders = (extra = {}) => {
  const headers = { 'Content-Type': 'application/json', ...extra };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

export const fetchMenu = async () => {
  const res = await fetch(`${BASE_URL}/api/menu`);
  return res.json();
};

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    credentials: 'include',
    headers: authHeaders()
  });
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return res.json();
};

export const signupUser = async (userData) => {
  const res = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const placeOrder = async (order) => {
  const res = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: authHeaders(),
    credentials: 'include',
    body: JSON.stringify(order),
  });
  return res.json();
};
