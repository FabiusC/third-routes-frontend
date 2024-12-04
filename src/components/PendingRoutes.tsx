import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoutesHistory, updateRoute } from "../services/api"; // Suponiendo que ya tienes un método para el PUT request
import "../styles/PendingRoutes.css";
import { RouteHistory } from "../types/Types";

const PendingRoutes: React.FC = () => {
  const [pendingRoutes, setPendingRoutes] = useState<RouteHistory[]>([]);
  const [comments, setComments] = useState<{ [key: number]: string }>({});
  const [searchDate, setSearchDate] = useState(""); // State for the search filter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await getRoutesHistory();
        setPendingRoutes(routes);
      } catch (err) {
        console.error("Error fetching pending routes:", err);
      }
    };
    fetchRoutes();
  }, []);

  // Handle comment change
  const handleObservationChange = (routeId: number, value: string) => {
    setComments((prevComments) => ({
      ...prevComments,
      [routeId]: value,
    }));
  };

  // Mark route as finished
  const handleMarkAsFinished = async (routeId: number) => {
    const comment = comments[routeId] || "Sin Observaciones";
    const routeToUpdate = pendingRoutes.find(
      (route) => route.route_id === routeId
    );

    if (!routeToUpdate) {
      alert("No se pudo encontrar la ruta especificada.");
      return;
    }

    try {
      // Validar datos antes de llamar a la API
      if (!routeToUpdate.route_date) {
        alert("La fecha de la ruta no está disponible.");
        return;
      }

      // Llamar a la función updateRoute con datos actualizados
      await updateRoute(
        routeToUpdate.route_date, // Fecha de la ruta
        routeToUpdate.comment || "Sin comentario", // Comentario actual
        true, // Marcar como finalizado
        comment, // Observaciones agregadas por el usuario
        routeId // ID de la ruta
      );

      alert("Ruta marcada como hecha exitosamente.");

      // Actualizar el estado local para eliminar la ruta finalizada
      setPendingRoutes((prevRoutes) =>
        prevRoutes.filter((route) => route.route_id !== routeId)
      );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error marking route as finished:", err.message || err);
      alert(
        err.message ||
          "No se pudo marcar la ruta como hecha. Inténtalo nuevamente."
      );
    }
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long", // Día de la semana
      day: "2-digit", // Día del mes con 2 dígitos
      month: "2-digit", // Mes con 2 dígitos
      year: "numeric", // Año con 4 dígitos
    }).format(date);
  };

  // Filter routes by search date
  const filteredRoutes = searchDate
    ? pendingRoutes.filter((route) => route.route_date.startsWith(searchDate))
    : pendingRoutes;

  return (
    <div className="PendingRoutes">
      <div className="header-container">
        <button className="back-button" onClick={() => navigate("/")}>
          <i className="ti ti-arrow-back-up-double"></i>
        </button>
        <h2>Rutas Pendientes</h2>
        <input
          type="date"
          className="date-filter"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)} // Update the search date state
          placeholder="Filtrar por fecha"
        />
      </div>
      <div className="route-list">
        {filteredRoutes.map((route) => (
          <div className="route-item" key={route.route_id}>
            <div className="route-content">
              <p>
                <strong>{route.third_party_name}</strong>
              </p>
              <p>Dirección: {route.address || "N/A"}</p>
              <p>Fecha: {formatDate(route.route_date)}</p>
              <p>Comentario: {route.comment}</p>
              <textarea
                className="comment-box"
                placeholder="Agregar observaciones"
                value={comments[route.route_id] || ""}
                onChange={(e) =>
                  handleObservationChange(route.route_id, e.target.value)
                }
              />
            </div>
            <div className="route-actions">
              <button
                className="mark-done-button"
                onClick={() => handleMarkAsFinished(route.route_id)}
              >
                <i className="ti ti-checkbox"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingRoutes;
