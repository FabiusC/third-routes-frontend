import axios from "axios";

// Crear una instancia de Axios con configuración base
const api = axios.create({
  baseURL: "http://54.92.168.48:3000/api/", // URL base del backend
});

export const getThirdParties = async () => {
  const response = await api.get("/third-parties");
  return response.data; // Devuelve los terceros desde la API
};

export const addRoute = async (data: {
  route_date: string;
  third_party_ids: number[];
  comments: string[];
}) => {
  const response = await api.post("/add-route", data);
  return response.data;
};

export const getRoutesHistory = async () => {
  const response = await api.get("/routes-history");
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
