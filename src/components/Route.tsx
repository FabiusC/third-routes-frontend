import React, { useState } from "react";
import "../styles/Route.css";
import { ThirdParty } from "../types/Types";
import { IconDeviceFloppy, IconFileDownload } from "@tabler/icons-react";
import { jsPDF } from "jspdf";

interface RouteProps {
  routeList: ThirdParty[];
  removeFromRoute: (thirdParty: ThirdParty) => void;
  saveRoute: (comments: { [id: number]: string }) => void;
  getColombianDate: () => string; // Recibe la función como prop
}

const Route: React.FC<RouteProps> = ({
  routeList,
  removeFromRoute,
  saveRoute,
  getColombianDate,
}) => {
  // Estado local para gestionar los comentarios
  const [comments, setComments] = useState<{ [id: number]: string }>({});

  // Manejar cambios en los comentarios
  const handleCommentChange = (id: number, value: string) => {
    setComments((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Función para generar y descargar el PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Obtener la fecha en formato colombiano
    const routeDate = new Date(getColombianDate());
    const formattedDate = new Intl.DateTimeFormat("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(routeDate); // Formato: DD-MMM-YYYY (ejemplo: 10-Nov-2024)

    // Título y Fecha
    doc.setFontSize(18);
    doc.text("RUTA", 105, 10, { align: "center" }); // Centrar el título
    doc.setFontSize(12);
    doc.text(`Fecha: ${formattedDate}`, 10, 20); // Mostrar la fecha formateada
    doc.line(10, 25, 200, 25); // Línea separadora debajo de la fecha

    // Agregar la información de los terceros
    let y = 30; // Coordenada Y inicial
    routeList.forEach((tp, index) => {
      if (y > 280) {
        // Salto de página si se excede el espacio
        doc.addPage();
        y = 10;
      }

      // Número e Información del Tercero
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${index + 1}. ${tp.name}`, 10, y);
      y += 8;

      // Dirección
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Dirección: ${tp.address || "N/A"}`, 10, y);
      y += 8;

      // Nombre de Contacto
      doc.text(`Nombre de Contacto: ${tp.contact_name || "N/A"}`, 10, y);
      y += 8;

      // Información de Contacto
      doc.text(`Contacto: ${tp.contact_info || "N/A"}`, 10, y);
      y += 8;

      // Comentario
      doc.text(`Comentario: ${comments[tp.id] || "Sin comentario"}`, 10, y);
      y += 8;

      // Línea separadora
      doc.line(10, y, 200, y);
      y += 10;
    });

    // Descargar el PDF con el nombre generado
    const fileName = `Ruta_${formattedDate.replace(/ /g, "_")}.pdf`; // Reemplazar espacios por guiones bajos en el nombre del archivo
    doc.save(fileName);
  };

  const handleSave = () => {
    // Validar que cada tercero tenga un comentario
    const updatedComments = routeList.reduce((acc, tp) => {
      acc[tp.id] = comments[tp.id] || "Sin comentario"; // Agregar "Sin comentario" si está vacío
      return acc;
    }, {} as { [id: number]: string });

    // Llamar a la función saveRoute con los comentarios actualizados
    saveRoute(updatedComments);
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
            <IconDeviceFloppy stroke={2} />
          </button>
          <button
            onClick={downloadPDF}
            className="button btn-icon"
            title="Imprimir"
          >
            <IconFileDownload stroke={2} />
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
            <div
              className="card-content"
            >
              <p>
                <strong>{tp.name}</strong>
              </p>
              <p>{tp.address}</p>
              <textarea
                className="comment-box"
                placeholder="Agregar comentario"
                value={comments[tp.id] || ""} // Muestra el comentario si existe, o vacío si no
                onChange={(e) => handleCommentChange(tp.id, e.target.value)} // Actualiza el comentario
                onClick={(e) => e.stopPropagation()} // Evita que el clic en el área de texto elimine la tarjeta
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Route;
