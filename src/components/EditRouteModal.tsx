import React, { useEffect, useState } from "react";
import "../styles/EdithThirdModal.css";

interface EditRouteModalProps {
  isOpen: boolean;
  routeToEdit: {
    route_id: number;
    route_date: string;
    comment: string;
    observations: string;
    is_finished: boolean;
    third_party_name: string;
    address: string;
    contact_name?: string;
    contact_info?: string;
  } | null;
  onClose: () => void;
  onSave: (updatedRoute: {
    route_id: number;
    route_date: string;
    comment: string;
    observations: string;
    is_finished: boolean;
    third_party_name: string;
    address: string;
    contact_name?: string;
    contact_info?: string;
  }) => void;
  onDelete: (id: number) => void;
}

const EditRouteModal: React.FC<EditRouteModalProps> = ({
  isOpen,
  routeToEdit,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedRoute, setEditedRoute] = useState<{
    route_id: number;
    route_date: string;
    comment: string;
    observations: string;
    is_finished: boolean;
  } | null>(null);

  const formatDateForInput = (isoDate: string): string => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (routeToEdit) {
      setEditedRoute({
        route_id: routeToEdit.route_id,
        route_date:
          routeToEdit.route_date || new Date().toISOString().split("T")[0],
        comment: routeToEdit.comment || "Sin comentario",
        observations: routeToEdit.observations || "Sin observaciones",
        is_finished: routeToEdit.is_finished || false,
      });
    }
  }, [routeToEdit]);

  if (!isOpen || !editedRoute) return null;

  // Handlers específicos para cada campo
  const handleDateChange = (value: string) => {
    setEditedRoute((prev) => (prev ? { ...prev, route_date: value } : null));
  };

  const handleCommentChange = (value: string) => {
    setEditedRoute((prev) => (prev ? { ...prev, comment: value } : null));
  };

  const handleObservationsChange = (value: string) => {
    setEditedRoute((prev) => (prev ? { ...prev, observations: value } : null));
  };

  const handleIsFinishedChange = (value: boolean) => {
    setEditedRoute((prev) => (prev ? { ...prev, is_finished: value } : null));
  };

  const handleDelete = () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta ruta?")) {
      onDelete(editedRoute.route_id);
      onClose();
    }
  };

  const handleSave = () => {
    if (editedRoute) {
      onSave({
        ...editedRoute,
        third_party_name: routeToEdit?.third_party_name || "",
        address: routeToEdit?.address || "",
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="header">
          <h2>Editar Ruta</h2>
          <div className="action-buttons">
            <button
              title="Eliminar ruta"
              className="btn-secondary"
              onClick={handleDelete}
            >
              <i className="ti ti-trash"></i>
            </button>
            <button title="Cerrar" className="btn-danger" onClick={onClose}>
              <i className="ti ti-x"></i>
            </button>
          </div>
        </header>
        <label>
          Fecha:
          <input
            type="date"
            className="date-input"
            value={formatDateForInput(editedRoute.route_date)}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </label>
        <label>
          Comentario:
          <textarea
            value={editedRoute.comment}
            className="comment-box"
            onChange={(e) => handleCommentChange(e.target.value)}
          />
        </label>
        <label>
          Observaciones:
          <textarea
            value={editedRoute.observations}
            className="comment-box"
            onChange={(e) => handleObservationsChange(e.target.value)}
          />
        </label>
        <label>
          Estado:
          <select
            value={editedRoute.is_finished ? "true" : "false"}
            className="select-input"
            onChange={(e) => handleIsFinishedChange(e.target.value === "true")}
          >
            <option value="true">Finalizado</option>
            <option value="false">Pendiente</option>
          </select>
        </label>
        <div className="modal-actions">
          <button
            onClick={handleSave}
            className="btn-save"
            title="Guardar cambios"
          >
            <i className="ti ti-device-floppy"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditRouteModal;
