import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import NavbarCliente from "../components/NavbarCliente";
import "../css/DevolucionPasaje.css";

function DevolucionPasaje() {
  const { id } = useParams();
  const location = useLocation();
  const cantidad = location.state?.cantidad;
  const viaje = location.state?.viaje;

  if (!viaje || !cantidad) {
    return <p style={{ color: "red", textAlign: "center" }}>Error: No hay datos disponibles.</p>;
  }

  const totalSeats = Array.from({ length: 20 }, (_, index) => index + 1);
  const [soldSeats, setSoldSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    const tempSoldSeats = new Set();
    while (tempSoldSeats.size < Math.floor(Math.random() * 10) + 1) {
      tempSoldSeats.add(Math.floor(Math.random() * 20) + 1);
    }
    setSoldSeats(tempSoldSeats);
  }, []);

  const handleSeatSelection = (seat) => {
    if (soldSeats.has(seat)) { // Solo permite elegir asientos ocupados
      if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter(s => s !== seat));
      } else if (selectedSeats.length < cantidad) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  return (
    <div className="compraPasaje-bg">
      <NavbarCliente />
      <div className="compraPasaje-container">
        {/* Contenedor de selección de asientos */}
        <div className="seat-container">
          <h2>Selecciona asiento(s) para devolver</h2>
          <div className="seat-map">
            {totalSeats.map(seat => (
              <div className={`seat-devolucion ${selectedSeats.includes(seat) ? "selected-devolucion" : ""} ${!soldSeats.has(seat) ? "empty-devolucion" : ""}`}>
                <FaUser onClick={() => handleSeatSelection(seat)} />
                <span>{seat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor de información de devolución */}
        <div className="devolucion-info">
          <p><strong>Origen:</strong> {viaje.origen}</p>
          <p><strong>Destino:</strong> {viaje.destino}</p>
          <hr />
          <p><strong>Salida:</strong> {viaje.salida}</p>
          <p><strong>Llegada:</strong> {viaje.llegada}</p>
          <p><strong>Ómnibus:</strong> {viaje.omnibus}</p>
          <p><strong>Asiento(s) a devolver:</strong> {selectedSeats.join(", ")}</p>
          <hr />
          <div className="price-payment">
            <button className="btn btn-primary rounded-pill custom-pay" disabled={selectedSeats.length < cantidad}>Confirmar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevolucionPasaje;
