import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Route.css";
import { ThirdParty } from "../types/Types";
import { jsPDF } from "jspdf";
import { getRoutesHistory } from "../services/api";

interface RouteProps {
  routeList: ThirdParty[];
  removeFromRoute: (thirdParty: ThirdParty) => void;
  saveRoute: (
    comments: { [id: number]: string },
    dates: { [id: number]: string }
  ) => void;
  getColombianDate: () => string;
}

const Route: React.FC<RouteProps> = ({
  routeList,
  removeFromRoute,
  saveRoute,
  getColombianDate,
}) => {
  // State for managing comments
  const [comments, setComments] = useState<{ [id: number]: string }>({});
  // State for managing dates
  const [dates, setDates] = useState<{ [id: number]: string }>({});
  // State for managing pending routes
   
  const [, setPendingRoutes] = useState<ThirdParty[]>([]);

  // Hook to navigate to another page
  const navigate = useNavigate();

  // Handle changes in comments
  const handleCommentChange = (id: number, value: string) => {
    setComments((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle changes in dates
  const handleDateChange = (id: number, value: string) => {
    setDates((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to generate and download the PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Get today's date in Colombian format
    const routeDate = new Date(getColombianDate());
    const formattedDate = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(routeDate);

    // Title and Date
    doc.setFontSize(18);
    doc.text("RUTA", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Fecha: ${formattedDate}`, 10, 20);
    doc.line(10, 25, 200, 25);

    // Add information for each third party
    let y = 30;
    routeList.forEach((tp, index) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }

      const date = dates[tp.id] || formattedDate; // Use the entered date or today's date

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${tp.name}`, 10, y);
      y += 8;

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Fecha: ${date}`, 10, y); // Display the date
      y += 8;

      doc.text(`Dirección: ${tp.address || "N/A"}`, 10, y);
      y += 8;

      doc.text(`Nombre de Contacto: ${tp.contact_name || "N/A"}`, 10, y);
      y += 8;

      doc.text(`Contacto: ${tp.contact_info || "N/A"}`, 10, y);
      y += 8;

      doc.text(`Comentario: ${comments[tp.id] || "Sin comentario"}`, 10, y);
      y += 8;

      doc.line(10, y, 200, y);
      y += 10;
    });

    const fileName = `Ruta_${formattedDate.replace(/ /g, "_")}.pdf`;
    doc.save(fileName);
  };

  // Function to save the Route in DB
  const handleSave = () => {
    const adjustToColombianDate = (dateString: string) => {
      const [year, month, day] = dateString.split("-").map(Number);
      const colombianDate = new Date(year, month - 1, day);
      return colombianDate.toISOString().split("T")[0];
    };

    const updatedComments = routeList.reduce((acc, tp) => {
      acc[tp.id] = comments[tp.id] || "Sin comentario";
      return acc;
    }, {} as { [id: number]: string });

    const updatedDates = routeList.reduce((acc, tp) => {
      if (dates[tp.id]) {
        acc[tp.id] = adjustToColombianDate(dates[tp.id]);
      } else {
        acc[tp.id] = adjustToColombianDate(getColombianDate());
      }
      return acc;
    }, {} as { [id: number]: string });

    const hasMissingDates = routeList.some((tp) => !updatedDates[tp.id]);
    if (hasMissingDates) {
      alert(
        "Algunas rutas no tienen fecha especificada. Por favor, verifica antes de guardar."
      );
      return;
    }

    saveRoute(updatedComments, updatedDates);
  };

  const fetchPendingRoutes = async () => {
    try {
      const routes = await getRoutesHistory(); // Llama a la API para obtener todas las rutas
      const pendingRoutes = routes.filter(
        (route: { is_finished: boolean }) => !route.is_finished
      ); // Filtrar rutas pendientes
      setPendingRoutes(pendingRoutes); // Actualizar el estado con las rutas pendientes
      navigate("/pending-routes"); // Redirigir a la página de rutas pendientes
    } catch (err) {
      console.error("Error fetching pending routes:", err);
      alert("Error al obtener las rutas pendientes.");
    }
  };

  return (
    <div className="Route">
      <div className="route-header">
        <h2>Ruta</h2>
        <span>{`Total: ${routeList.length}`}</span>
        <div className="route-actions">
          <button
            onClick={handleSave}
            className="button btn-icon"
            title="Guardar"
          >
            <i className="ti ti-device-floppy"></i>
          </button>
          <button
            onClick={downloadPDF}
            className="button btn-icon"
            title="Imprimir"
          >
            <i className="ti ti-file-download"></i>
          </button>
          <button
            onClick={fetchPendingRoutes}
            className="button btn-icon"
            title="Rutas Pendientes"
          >
            <i className="ti ti-calendar"></i>
          </button>
        </div>
      </div>
      <hr className="hr-line" />
      <ul className="route-list">
        {routeList.map((tp) => (
          <li
            key={tp.id}
            className="route-card"
            onClick={() => removeFromRoute(tp)}
            title="Eliminar"
          >
            <div className="card-content">
              <p>
                <strong>{tp.name}</strong>
              </p>
              <p>{tp.address}</p>
              <input
                type="date"
                className="date-input"
                value={dates[tp.id] || ""}
                onChange={(e) => handleDateChange(tp.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <textarea
                className="comment-box"
                placeholder="Agregar comentario"
                value={comments[tp.id] || ""}
                onChange={(e) => handleCommentChange(tp.id, e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Route;
