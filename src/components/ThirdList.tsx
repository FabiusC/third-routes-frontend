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
  deleteRoute,
} from "../services/api";

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

  // Open the Routes History Modal
  const openHistoryModal = async () => {
  try {
    const data = await getRoutesHistory(); // API call returns updated fields
    setRoutesHistory(data); // Directly set the data to state
    setHistoryModalOpen(true);
  } catch (err) {
    console.error("Error al cargar el histórico de rutas:", err);
  }
};

  // Add a Third Party
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
      alert("Tercero agregado correctamente.");
    } catch (err) {
      console.error("Error agregando tercero:", err);
      alert("Error agregando tercero.");
    }
  };

  // Edit a Third Party
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
      setRouteList([]); // Clear route list
      refreshThirdParties(); // Refresh third parties list
      alert("Tercero actualizado correctamente.");
    } catch (err) {
      console.error("Error editando el tercero:", err);
      alert("Erro al actualizar el tercero.");
    }
  };

  // Delete a Third Party
  const handleDeleteThirdParty = async (id: number) => {
    try {
      await deleteThirdParty(id);
      refreshThirdParties();
      setRouteList([]);
      alert(`Tercero eliminado correctamente.`);
    } catch (err) {
      console.error("Error deleting third party:", err);
      alert("Error al eliminar el tercero: ");
    }
  };

  // Delete a Route
  const handleDeleteRoute = async (id: number) => {
    try {
      await deleteRoute(id);
      setRoutesHistory((prevHistory) =>
        prevHistory.filter((route) => route.route_id !== id)
      );
      alert("Ruta eliminada correctamente.");
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      alert("Error al eliminar ruta.");
    }
  };

  // Open Edit Modal for a Third Party
  const openEditModal = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    thirdParty: any,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); // Prevent the event from bubbling up
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
        <button
          onClick={() => {
            setSearch("");
            setCategory("all");
          }}
          className="btn-icon"
        >
          <i className="ti ti-backspace"></i>
        </button>
        <button onClick={openHistoryModal} className="btn-icon">
          <i className="ti ti-history"></i>
        </button>
        <button onClick={() => setAddModalOpen(true)} className="btn-icon">
          <i className="ti ti-mood-plus"></i>
        </button>
      </div>
      <hr className="hr-line" />
      <ul className="third-party-list">
        {thirdParties.filter(
          (tp) =>
            tp.name.toLowerCase().includes(search.toLowerCase()) &&
            (category === "all" || tp.category === category)
        ).length === 0 ? (
          <p className="empty-message">El Tercero NO Existe.</p>
        ) : (
          thirdParties
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
                  <p className="address">Dirección: {tp.address}</p>
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
                  <i className="ti ti-edit"></i>
                </button>
              </li>
            ))
        )}
      </ul>

      <RoutesHistoryModal
        isOpen={historyModalOpen}
        title="Histórico de Rutas"
        onClose={() => setHistoryModalOpen(false)}
        routesHistory={routesHistory}
        deleteRoute={handleDeleteRoute} // Pass deleteRoute method
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
