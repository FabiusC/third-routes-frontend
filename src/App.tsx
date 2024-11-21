import React, { useEffect, useState } from "react";
import "./styles/App.css";
import ThirdList from "./components/ThirdList";
import Route from "./components/Route";
import { getThirdParties, addRoute } from "./services/api";
import { ThirdParty } from "./types/Types";

const App: React.FC = () => {
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [routeList, setRouteList] = useState<ThirdParty[]>([]);

  useEffect(() => {
    // Obtener los terceros desde la API al cargar la app
    const fetchThirdParties = async () => {
      try {
        const data = await getThirdParties();
        setThirdParties(data);
      } catch (err) {
        console.error("Error al cargar terceros:", err);
      }
    };

    fetchThirdParties();
  }, []);

  // Agregar un tercero a la ruta
  const addToRoute = (thirdParty: ThirdParty) => {
    setRouteList((prevList) => [...prevList, thirdParty]);
    setThirdParties((prevParties) =>
      prevParties.filter((tp) => tp.id !== thirdParty.id)
    );
  };

  // Remover un tercero de la ruta
  const removeFromRoute = (thirdParty: ThirdParty) => {
    setRouteList((prevList) =>
      prevList.filter((tp) => tp.id !== thirdParty.id)
    );
    setThirdParties((prevParties) => [...prevParties, thirdParty]);
  };

  // Actualizar la lista de terceros
  const refreshThirdParties = async () => {
    try {
      const data = await getThirdParties(); // Recupera la lista actualizada desde la API
      setThirdParties(data);
    } catch (err) {
      console.error("Error al actualizar la lista de terceros:", err);
    }
  };

  // Obtener la fecha en la zona horaria de Colombia
  const getColombianDate = () => {
    const colombianDate = new Date().toLocaleString("en-US", {
      timeZone: "America/Bogota",
    });
    const [month, day, year] = new Date(colombianDate)
      .toLocaleDateString("en-US")
      .split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  // Guardar la ruta en la base de datos
  const saveRouteToDatabase = async (comments: { [id: number]: string }) => {
    if (routeList.length === 0) {
      alert("No hay terceros en la ruta para guardar.");
      return;
    }

    try {
      const routeDate = getColombianDate(); // Obtén la fecha en la zona horaria de Colombia
      const thirdPartyIds = routeList.map((tp) => tp.id);

      // Generar comentarios utilizando los valores del estado `comments`
      const generatedComments = routeList.map(
        (tp) => comments[tp.id] || "Sin comentarios"
      );

      console.log("Enviando datos al backend:", {
        route_date: routeDate,
        third_party_ids: thirdPartyIds,
        comments: generatedComments,
      });

      // Llamada a la API para guardar la ruta
      await addRoute({
        route_date: routeDate,
        third_party_ids: thirdPartyIds,
        comments: generatedComments,
      });

      alert("Ruta guardada correctamente.");
      setThirdParties((prevThirdParties) => [
        ...prevThirdParties,
        ...routeList,
      ]);
      setRouteList([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error al guardar la ruta:", err);

      if (err.response && err.response.data && err.response.data.error) {
        alert(`Error: ${err.response.data.error}`);
      } else {
        alert("Error desconocido al guardar la ruta.");
      }
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        <ThirdList
          thirdParties={thirdParties}
          addToRoute={addToRoute}
          refreshThirdParties={refreshThirdParties}
          setRouteList={setRouteList}
        />
        <div className="separator-vertical"></div>
        <Route
          routeList={routeList}
          removeFromRoute={removeFromRoute}
          saveRoute={saveRouteToDatabase}
          getColombianDate={getColombianDate}
        />
      </div>
    </div>
  );
};

export default App;
