import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import NavbarCliente from "../components/NavbarCliente";
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/Confirmacion.css";

function Confirmacion() {
  const navigate = useNavigate();
  const location = useLocation();
  const { viaje, selectedSeats, idPasajes } = location.state || {};
  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : {};

async function descargarPDF() {
  if (!idPasajes || idPasajes.length === 0) {
    alert("No hay pasajes para descargar.");
    return;
  }

  for (const id of idPasajes) {
    try {
      const response = await fetch(`http://localhost:8080/pasajes/descargar-pdf/${id}`, { method: "GET" });

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
      <div className="confirmacion-card">
        <h2>Compra realizada con éxito</h2>
        <div className="boton">
          <button onClick={() => navigate(payload.rol === "VENDEDOR" ? "/homev" : "/homec")} className="btn btn-primary">
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
