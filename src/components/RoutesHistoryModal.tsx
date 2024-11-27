import React, { useState } from "react";
import "../styles/RoutesHistoryModal.css";

interface RouteHistory {
  route_date: string;
  third_party_name: string;
  address: string;
  contact_name?: string;
  contact_info?: string;
  comment: string;
  route_id: number;
}

interface RoutesHistoryModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  routesHistory: RouteHistory[];
  deleteRoute: (id: number) => Promise<void>;
}

const RoutesHistoryModal: React.FC<RoutesHistoryModalProps> = ({
  isOpen,
  title,
  onClose,
  routesHistory,
  deleteRoute,
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Format the date as DD-MM-YYYY without timezone conversion
  const formatDate = (isoDate: string): string => {
    const [year, month, day] = isoDate.split("T")[0].split("-");
    return `${day}/${month}/${year}`;
  };

  // Filter routes based on search criteria
  const filteredRoutes = routesHistory.filter((route) => {
    const matchesText =
      route.third_party_name.toLowerCase().includes(searchText.toLowerCase()) ||
      route.comment.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = searchDate
      ? route.route_date.startsWith(searchDate)
      : true;
    return matchesText && matchesDate;
  });

  // Handle delete button click
  const handleDelete = async (route_id: number) => {
    if (!route_id) {
      alert("No se pudo eliminar la ruta debido a un ID faltante.");
      return;
    }
    try {
      if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
        await deleteRoute(route_id);
      }
    } catch (error) {
      console.error("Error al eliminar la ruta:", error);
      alert("No se pudo eliminar la ruta. Por favor, inténtalo de nuevo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <button className="close-modal" onClick={onClose} title="Cerrar">
          <i className="ti ti-x"></i>
        </button>
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
        <div className="modal-content">
          <table className="history-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre del Tercero</th>
                <th>Dirección</th>
                <th>Contacto</th>
                <th>Comentario</th>
                <th>🗑️</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <tr key={route.route_id}>
                    <td>{formatDate(route.route_date)}</td>
                    <td>{route.third_party_name}</td>
                    <td>{route.address || "N/A"}</td>
                    <td>
                      {route.contact_name || "N/A"} -{" "}
                      {route.contact_info || "N/A"}
                    </td>
                    <td>{route.comment}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(route.route_id)}
                        className="button btn-danger"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    No se encontraron resultados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoutesHistoryModal;
