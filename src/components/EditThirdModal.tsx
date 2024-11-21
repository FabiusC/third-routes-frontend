import React, { useState, useEffect } from "react";
import {
  IconDeviceFloppy,
  IconEyeClosed,
  IconMoodX,
} from "@tabler/icons-react";

interface EditThirdModalProps {
  isOpen: boolean;
  onClose: () => void;
  thirdParty: {
    id: number;
    name: string;
    address: string;
    contact_name: string;
    contact_info: string;
    category: "client" | "vendor";
  } | null; // Puede ser null inicialmente
  onSave: (updatedThirdParty: {
    id: number;
    name: string;
    address: string;
    contact_name: string;
    contact_info: string;
    category: "client" | "vendor";
  }) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const EditThirdModal: React.FC<EditThirdModalProps> = ({
  isOpen,
  onClose,
  thirdParty,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact_name, setContactName] = useState("");
  const [contact_info, setContactInfo] = useState("");
  const [category, setCategory] = useState<"client" | "vendor">("client");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (thirdParty) {
      setName(thirdParty.name || "");
      setAddress(thirdParty.address || "");
      setContactName(thirdParty.contact_name || "");
      setContactInfo(thirdParty.contact_info || "");
      setCategory(thirdParty.category || "client");
    } else {
      setName("");
      setAddress("");
      setContactName("");
      setContactInfo("");
      setCategory("client");
    }
  }, [thirdParty]);

  const handleSave = async () => {
    if (!name || !address || !category) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      if (thirdParty) {
        await onSave({
          id: thirdParty.id,
          name,
          address,
          contact_name,
          contact_info,
          category,
        });

        onClose(); // Cierra el modal tras guardar
        setError(null);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Error desconocido al actualizar el tercero.");
      }
    }
  };

  const handleDelete = async () => {
    if (thirdParty) {
      const confirm = window.confirm(
        `¿Estás seguro de eliminar al tercero "${thirdParty.name}"?`
      );
      if (confirm) {
        try {
          await onDelete(thirdParty.id);
          onClose(); // Cierra el modal tras eliminar
        } catch (err) {
          console.error("Error al eliminar tercero:", err);
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header className="header">
          <h2>Editar Tercero</h2>
          <div className="action-buttons">
            <button
              title="Eliminar tercero"
              className="btn-secondary"
              onClick={handleDelete}
            >
              <IconMoodX stroke={2} />
            </button>
            <button title="Cerrar" className="btn-danger" onClick={onClose}>
              <IconEyeClosed stroke={2} />
            </button>
          </div>
        </header>
        <div className="modal-content">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Nombre*</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Dirección*</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nombre de Contacto</label>
            <input
              type="text"
              value={contact_name}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Número de Contacto</label>
            <input
              type="text"
              value={contact_info}
              onChange={(e) => setContactInfo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Categoría*</label>
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as "client" | "vendor")
              }
              required
            >
              <option value="client">Cliente</option>
              <option value="vendor">Proveedor</option>
            </select>
          </div>
          <div className="action-buttons">
            <button className="button" onClick={handleSave}>
              <IconDeviceFloppy stroke={2} /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditThirdModal;
