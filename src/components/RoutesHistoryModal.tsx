import React, { useState } from "react";
import "../styles/RoutesHistoryModal.css";

interface RouteHistory {
  route_date: string; // Se espera en formato ISO (YYYY-MM-DDTHH:mm:ss)
  third_party_name: string;
  address: string;
  contact_name?: string;
  contact_info?: string;
  comment: string;
}

interface RoutesHistoryModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  routesHistory: RouteHistory[]; // Este prop debe ser siempre un array
}

const RoutesHistoryModal: React.FC<RoutesHistoryModalProps> = ({
  isOpen,
  title,
  onClose,
  routesHistory = [], // Si no se pasa, asegura que sea un array vacío
}) => {
  const [searchText, setSearchText] = useState("");
  const [searchDate, setSearchDate] = useState("");

  // Format the date as DD-MM-YYYY without timezone conversion
  const formatDate = (isoDate: string): string => {
    // Split the ISO date string (e.g., "2024-10-31T00:00:00.000Z") to extract the date part
    const [year, month, day] = isoDate.split("T")[0].split("-");

    // Return the formatted date as DD-MM-YYYY
    return `${day}/${month}/${year}`;
  };

  // Filtrar los datos según el criterio de búsqueda
  const filteredRoutes = routesHistory.filter((route) => {
    const matchesText =
      route.third_party_name.toLowerCase().includes(searchText.toLowerCase()) ||
      route.comment.toLowerCase().includes(searchText.toLowerCase());
    const matchesDate = searchDate
      ? route.route_date.startsWith(searchDate)
      : true; // Si no se selecciona fecha, incluir todos
    return matchesText && matchesDate;
  });

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
              </tr>
            </thead>
            <tbody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route, index) => (
                  <tr key={index}>
                    <td>{formatDate(route.route_date)}</td>
                    <td>{route.third_party_name}</td>
                    <td>{route.address || "N/A"}</td>
                    <td>
                      {route.contact_name || "N/A"} -{" "}
                      {route.contact_info || "N/A"}
                    </td>
                    <td>{route.comment}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
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
