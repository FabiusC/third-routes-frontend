import React, { useState, useEffect } from "react";
import "../styles/RoutesHistory.css";
import { useNavigate } from "react-router-dom";
import { getRoutesHistory, deleteRoute, updateRoute } from "../services/api";
import EditRouteModal from "./EditRouteModal";

interface RouteHistory {
  route_date: string;
  third_party_name: string;
  address: string;
  contact_name?: string; // Opcional
  contact_info?: string; // Opcional
  comment: string;
  route_id: number;
  is_finished: boolean;
  observations: string;
}

const RoutesHistoryPage: React.FC = () => {
  const [routesHistory, setRoutesHistory] = useState<RouteHistory[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [routeToEdit, setRouteToEdit] = useState<RouteHistory | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getRoutesHistory();
        setRoutesHistory(data);
      } catch (err) {
        console.error("Error fetching route history:", err);
      }
    };
    fetchRoutes();
  }, []);

  // Open the edit modal
  const openEditModal = (route: RouteHistory) => {
    setRouteToEdit(route);
    setEditModalOpen(true);
  };

  // Handle updating a route
  const handleUpdateRoute = async (
    updatedRoute: RouteHistory
  ): Promise<void> => {
    try {
      const completeRoute: RouteHistory = {
        ...routeToEdit!, // Usamos routeToEdit para completar las propiedades
        ...updatedRoute, // Sobrescribimos con las actualizaciones
      };

      await updateRoute(
        completeRoute.route_date,
        completeRoute.comment,
        completeRoute.is_finished,
        completeRoute.observations,
        completeRoute.route_id
      );

      setRoutesHistory((prev) =>
        prev.map((route) =>
          route.route_id === completeRoute.route_id ? completeRoute : route
        )
      );

      setEditModalOpen(false);
      alert("Ruta actualizada correctamente.");
    } catch (err) {
      console.error("Error al actualizar la ruta:", err);
      alert("No se pudo actualizar la ruta. Por favor, inténtalo de nuevo.");
    }
  };

  // Handle deleting a route
  const handleDeleteRoute = async (id: number) => {
    try {
      await deleteRoute(id);
      setRoutesHistory((prev) => prev.filter((route) => route.route_id !== id));
      alert("Ruta eliminada correctamente.");
    } catch (err) {
      console.error("Error al eliminar la ruta:", err);
      alert("No se pudo eliminar la ruta. Por favor, inténtalo de nuevo.");
    }
  };

  const formatDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  const filteredRoutes = routesHistory.filter((route) => {
    const matchesText =
      route.third_party_name.toLowerCase().includes(searchText.toLowerCase()) ||
      route.comment.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = searchDate
      ? route.route_date.startsWith(searchDate)
      : true;
    return matchesText && matchesDate;
  });

  return (
    <div className="routes-history-page">
      <div className="header-container">
        <button className="back-button" onClick={() => navigate("/")}>
          <i className="ti ti-arrow-back-up-double"></i>
        </button>
        <h2>Histórico de Rutas</h2>
        <div className="filter-container">
          <input
            type="text"
            placeholder="🔍 Nombre o comentario"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </div>
      </div>
      <div className="routes-history-content">
        <table className="history-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nombre del Tercero</th>
              <th>Dirección</th>
              <th>Contacto</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoutes.map((route) => (
              <tr key={route.route_id}>
                <td>{formatDate(route.route_date)}</td>
                <td>{route.third_party_name}</td>
                <td>{route.address || "N/A"}</td>
                <td>
                  {route.contact_name || "N/A"} - {route.contact_info || "N/A"}
                </td>
                <td>{route.comment}</td>
                <td>
                  {route.is_finished ? (
                    <p className="text-green">Finalizado</p>
                  ) : (
                    <p className="text-red">Pendiente</p>
                  )}
                </td>
                <td>{route.observations || "Sin observaciones"}</td>
                <td>
                  <button
                    onClick={() => openEditModal(route)}
                    className="button btn-primary"
                  >
                    <i className="ti ti-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <EditRouteModal
        isOpen={editModalOpen}
        routeToEdit={routeToEdit}
        onClose={() => setEditModalOpen(false)}
        onSave={handleUpdateRoute} // Compatible con el tipo RouteHistory
        onDelete={handleDeleteRoute}
      />
    </div>
  );
};

export default RoutesHistoryPage;
