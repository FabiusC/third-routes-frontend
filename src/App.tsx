import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/App.css";
import ThirdList from "./components/ThirdList";
import RouteComponent from "./components/Route";
import PendingRoutes from "./components/PendingRoutes";
import { getThirdParties, addRoute } from "./services/api";
import { ThirdParty } from "./types/Types";
import RoutesHistory from "./components/RoutesHistory";

const App: React.FC = () => {
  const [thirdParties, setThirdParties] = useState<ThirdParty[]>([]);
  const [routeList, setRouteList] = useState<ThirdParty[]>([]);

  useEffect(() => {
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

  const addToRoute = (thirdParty: ThirdParty) => {
    setRouteList((prevList) => [...prevList, thirdParty]);
    setThirdParties((prevParties) =>
      prevParties.filter((tp) => tp.id !== thirdParty.id)
    );
  };

  const removeFromRoute = (thirdParty: ThirdParty) => {
    setRouteList((prevList) =>
      prevList.filter((tp) => tp.id !== thirdParty.id)
    );
    setThirdParties((prevParties) => [...prevParties, thirdParty]);
  };

  const refreshThirdParties = async () => {
    try {
      const data = await getThirdParties();
      setThirdParties(data);
    } catch (err) {
      console.error("Error al actualizar la lista de terceros:", err);
    }
  };

  const getColombianDate = () => {
    const colombianDate = new Date().toLocaleString("en-US", {
      timeZone: "America/Bogota",
    });
    const [month, day, year] = new Date(colombianDate)
      .toLocaleDateString("en-US")
      .split("/");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const saveRouteToDatabase = async (
    comments: { [id: number]: string },
    dates: { [id: number]: string }
  ) => {
    if (routeList.length === 0) {
      alert("No hay terceros en la ruta para guardar.");
      return;
    }

    try {
      const routes = routeList.map((tp) => ({
        third_party_id: tp.id,
        route_date: dates[tp.id],
        comment: comments[tp.id] || "Sin comentarios",
      }));

      await addRoute({ routes });

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
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content">
                <ThirdList
                  thirdParties={thirdParties}
                  addToRoute={addToRoute}
                  refreshThirdParties={refreshThirdParties}
                  setRouteList={setRouteList}
                />
                <div className="separator-vertical"></div>
                <RouteComponent
                  routeList={routeList}
                  removeFromRoute={removeFromRoute}
                  saveRoute={saveRouteToDatabase}
                  getColombianDate={getColombianDate}
                />
              </div>
            }
          />
          <Route path="/routes-history" element={<RoutesHistory />} />
          <Route path="/pending-routes" element={<PendingRoutes />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
