import React, { useState } from "react";
import "../styles/ThirdList.css";
import RoutesHistoryModal from "./RoutesHistoryModal";
import AddThirdModal from "./AddThirdModal";
import EditThirdModal from "./EditThirdModal";
import { ThirdListProps, RouteHistory } from "../types/Types";
import {
  getRoutesHistory,
  addThirdParty,
  updateThirdParty,
  deleteThirdParty,
} from "../services/api";

// import Icons
import {
  IconEdit,
  IconMoodPlus,
  IconHistoryToggle,
  IconBackspace,
} from "@tabler/icons-react";
const ThirdList: React.FC<ThirdListProps> = ({
  thirdParties,
  addToRoute,
  refreshThirdParties,
  setRouteList,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedThirdParty, setSelectedThirdParty] = useState<any>(null);
  const [routesHistory, setRoutesHistory] = useState<RouteHistory[]>([]);

  const openHistoryModal = async () => {
    try {
      const data = await getRoutesHistory();
      setRoutesHistory(data);
      setHistoryModalOpen(true);
    } catch (err) {
      console.error("Error al cargar el histórico de rutas:", err);
    }
  };

  const handleAddThirdParty = async (newThirdParty: {
    name: string;
    address: string;
    contact_name: string;
    contact_info: string;
    category: "client" | "vendor";
  }) => {
    try {
      await addThirdParty(newThirdParty);
      refreshThirdParties();
    } catch (err) {
      console.error("Error al agregar tercero:", err);
    }
  };

  // Editar Tercero
  const handleEditThirdParty = async (updatedThirdParty: {
    id: number;
    name: string;
    address: string;
    contact_name: string;
    contact_info: string;
    category: "client" | "vendor";
  }) => {
    try {
      await updateThirdParty(updatedThirdParty);
      // Vaciar la lista de rutas
      setRouteList([]);
      // Refrescar la lista principal de terceros
      refreshThirdParties();
    } catch (err) {
      console.error("Error al editar tercero:", err);
    }
  };

  // Eliminar Tercero
  const handleDeleteThirdParty = async (id: number) => {
    try {
      await deleteThirdParty(id); // Llama a la función de la API para eliminar
      refreshThirdParties(); // Refresca la lista después de eliminar
      setRouteList([]); // Limpia la lista de rutas si el tercero eliminado está en ella
    } catch (err) {
      console.error("Error al eliminar tercero:", err);
    }
  };

  // Abrir modal de edición
  const openEditModal = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thirdParty: any,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); // Detener la propagación del evento
    setSelectedThirdParty(thirdParty);
    setEditModalOpen(true);
  };

  return (
    <div className="ThirdList">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">Todas</option>
          <option value="client">Cliente</option>
          <option value="vendor">Proveedor</option>
        </select>
        <button onClick={() => setSearch("")} className="btn-icon">
          <IconBackspace stroke={2} />
          <img src="" />
        </button>
        <button onClick={openHistoryModal} className="btn-icon">
          <IconHistoryToggle stroke={2} />
        </button>
        <button onClick={() => setAddModalOpen(true)} className="btn-icon">
          <IconMoodPlus stroke={2} />
        </button>
      </div>
      <hr className="hr-line" />
      <ul className="third-party-list">
        {thirdParties
          .filter(
            (tp) =>
              tp.name.toLowerCase().includes(search.toLowerCase()) &&
              (category === "all" || tp.category === category)
          )
          .map((tp) => (
            <li
              key={tp.id}
              className="third-party-card"
              onClick={() => addToRoute(tp)}
            >
              <div className="card-content">
                <p className="name">
                  <strong>{tp.name}</strong>
                </p>
                <p className="address">Direccion: {tp.address}</p>
                <p className="contact-name">
                  Nombre: {tp.contact_name || "N/A"}
                </p>
                <p className="contact-info">
                  Número: {tp.contact_info || "N/A"}
                </p>
                <p className="category">
                  {tp.category === "vendor" ? "Proveedor" : "Cliente"}
                </p>
              </div>
              <button
                className="button btn-edit btn-icon"
                onClick={(e) => openEditModal(tp, e)}
                aria-label={`Editar ${tp.name}`}
              >
                <IconEdit stroke={2} />
              </button>
            </li>
          ))}
      </ul>

      <RoutesHistoryModal
        isOpen={historyModalOpen}
        title="Histórico de Rutas"
        onClose={() => setHistoryModalOpen(false)}
        routesHistory={routesHistory}
      />

      <AddThirdModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddThirdParty}
      />

      <EditThirdModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        thirdParty={selectedThirdParty}
        onSave={handleEditThirdParty}
        onDelete={handleDeleteThirdParty}
      />
    </div>
  );
};

export default ThirdList;
