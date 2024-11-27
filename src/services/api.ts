import axios from "axios";

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: "http://44.201.141.250:3000/api/", // URL base del backend
});

// Función para obtener los terceros
export const getThirdParties = async () => {
  const response = await api.get("/third-parties");
  return response.data; // Devuelve los terceros desde la API
};

// Agregar Ruta
export const addRoute = async (data: {
  routes: {
    route_date: string;
    third_party_id: number;
    comment: string;
  }[];
}) => {
  const response = await api.post("/add-route", data);
  return response.data;
};

// Eliminar Ruta
export const deleteRoute = async (id: number) => {
  const response = await api.delete(`/route/${id}`);
  return response.data;
};

// Obtener historial de Rutas
export const getRoutesHistory = async () => {
  const response = await api.get("/routes-history");
  return response.data;
};

// Obtener rutas de hoy
export const getTodayRoutes = async () => {
  const response = await api.get("/routes/today");
  return response.data;
};

// Función para agregar un nuevo tercero
export const addThirdParty = async (thirdParty: {
  name: string;
  address: string;
  contact_name: string;
  contact_info: string;
  category: "client" | "vendor";
}) => {
  const response = await api.post("/add-third-party", thirdParty);
  return response.data;
};

// Funcion para eliminar un tercero
export const deleteThirdParty = async (id: number) => {
  const response = await api.delete(`/third-party/${id}`);
  return response.data;
};

// Función para actualizar un tercero
export const updateThirdParty = async (updatedThirdParty: {
  id: number;
  name: string;
  address: string;
  contact_name: string;
  contact_info: string;
  category: "client" | "vendor";
}) => {
  const response = await api.put(`/third-parties/${updatedThirdParty.id}`, {
    name: updatedThirdParty.name,
    address: updatedThirdParty.address,
    contact_name: updatedThirdParty.contact_name,
    contact_info: updatedThirdParty.contact_info,
    category: updatedThirdParty.category,
  });
  return response.data;
};

export default api;
