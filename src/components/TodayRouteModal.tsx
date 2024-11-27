import React from "react";
import "../styles/TodayRouteModal.css";
import { RouteHistory } from "../types/Types";

interface TodayRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: RouteHistory[];
}

const TodayRouteModal: React.FC<TodayRouteModalProps> = ({
  isOpen,
  onClose,
  routes,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Ruta de Hoy</h2>
        <button className="close-modal" onClick={onClose}>
          <i className="ti ti-x"></i>
        </button>
        <div className="modal-content">
          {routes.length > 0 ? (
            <ul>
              {routes.map((route, index) => (
                <li key={index}>
                  <p>
                    <strong>{route.third_party_name}</strong>
                  </p>
                  <p><strong>Dirección:</strong> <br/>{route.address}</p>
                  <p><strong>Contacto:</strong> <br/>{route.contact_name || "N/A"}</p>
                  <p><strong>Numero:</strong> <br/>{route.contact_info || "N/A"}</p>
                  <p><strong>Comentario:</strong> <br/>{route.comment}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay rutas registradas para hoy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayRouteModal;
