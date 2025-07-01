import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavbarCliente from "../components/NavbarCliente";
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/Confirmacion.css";
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function Confirmacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { viaje, selectedSeats, idPasajes } = location.state || {};
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};
  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");


  function mostrarAlertaError(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("error")
  };

  async function descargarPDF() {
    if (!idPasajes || idPasajes.length === 0) {
      mostrarAlertaError("No hay pasajes para descargar.");
      return;
    }

    for (const id of idPasajes) {
      try {
        const response = await fetch(`${BASE_URL}/pasajes/descargar-pdf/${id}`, { method: "GET" });

        if (!response.ok) {
          throw new Error(`Error al descargar el pasaje con ID ${id}`);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `detalle_pasaje_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (error) {
        console.error("Error al descargar PDF:", error);
      }
    }
  }


  return (
    <div className="confirmacion-bg">
      {payload.rol === "VENDEDOR" ? <NavbarVendedor /> : <NavbarCliente />}
      <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
      <div className="confirmacion-card">
        <h2>Compra realizada con éxito</h2>
        <div className="boton">
          <button onClick={() => window.location.href = "/home"} className="btn btn-primary">
            Ir a Inicio
          </button>
          <button onClick={descargarPDF} className="btn btn-secondary">
            Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default Confirmacion;
