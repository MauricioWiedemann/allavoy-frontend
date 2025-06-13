import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/DevolucionPasaje.css";
import { jwtDecode } from 'jwt-decode';

function DevolucionPasaje() {
  const { id } = useParams();
  const location = useLocation();
  const viaje = location.state?.viaje;
  const navigate = useNavigate();
  const totalSeats = Array.from({ length: viaje.omnibus.capacidad }, (_, i) => i + 1);
  const soldSeats = new Set(viaje.asientosOcupados || []);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [montoDevolucion, setMontoDevolucion] = useState(null);

    const calcularMonto = async (seat) => {
      try {
        const response = await fetch(`http://localhost:8080/pasajes/monto-devolucion?idViaje=${viaje.idViaje}&numeroAsiento=${seat}`);
        if (!response.ok) throw new Error("Error al calcular el monto de devolución");

        const monto = await response.json();
        setMontoDevolucion(monto);
      } catch (error) {
        console.error("Error al obtener monto de devolución:", error);
      }
    };

  useEffect(() => {
    const tempSoldSeats = new Set();
    while (tempSoldSeats.size < Math.floor(Math.random() * 10) + 1) {
      tempSoldSeats.add(Math.floor(Math.random() * 20) + 1);
    }
  }, []);

  const handleSeatSelection = (seat) => {
    if (soldSeats.has(seat)) {
      if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter(s => s !== seat));
        setMontoDevolucion(null);
      } else if (selectedSeats.length < 1) {
        setSelectedSeats([...selectedSeats, seat]);
        calcularMonto(seat);
      }
    }
  };

    const obtenerIdPago = async (idViaje, numeroAsiento) => {
      try {
        const response = await fetch(`http://localhost:8080/pasajes/id-pago?idViaje=${idViaje}&numeroAsiento=${numeroAsiento}`);

        if (!response.ok) throw new Error("Error al obtener el ID de pago");

        const text = await response.text();
        const parsedData = JSON.parse(text);
        return parsedData.idPago;
      } catch (error) {
        console.error("Error al obtener ID de pago:", error);
        return null;
      }
    };

  const procesarDevolucion = async () => {
      console.log("Asientos seleccionados:", selectedSeats);
    if (selectedSeats.length === 0 || montoDevolucion === null) {
      alert("Seleccione un asiento para la devolución.");
      return;
    }

    const idPago = await obtenerIdPago(viaje.idViaje, selectedSeats[0]);
    if (!idPago) {
      alert("No se pudo obtener el ID de pago.");
      return;
    }

    try {
        const backendResponse = await fetch(`http://localhost:8080/paypal/refund?captureId=${idPago}&monto=${montoDevolucion.toFixed(2)}&idViaje=${viaje.idViaje}&numeroAsiento=${selectedSeats[0]}`, {
            method: "POST"
        });

      if (!backendResponse.ok) throw new Error("Error al procesar la devolución en el backend");

      const data = await backendResponse.json();
      console.log("Devolución exitosa con PayPal:", data);
      alert("Devolución realizada correctamente.");
      navigate("/homev");
    } catch (error) {
      console.error("Error en la devolución:", error);
      alert("Hubo un problema al procesar la devolución.");
    }
  };

  function validarTokenUsuario(){
      try {
        let payload = jwtDecode(localStorage.getItem("token"));
        if (payload.rol !== "VENDEDOR")
          window.location.href = "/404";
      } catch (e) {
        window.location.href = "/404";
      }
    }
  
    useEffect(() => {
      validarTokenUsuario();
    }, []);

  return (
    <div className="devolucionPasaje-bg">
      <NavbarVendedor />
      <div className="devolucionPasaje-container">
        {/* Contenedor de selección de asientos */}
        <div className="seat-container">
          <h2>Selecciona asiento(s) para devolver</h2>
          <div className="seat-map">
            {totalSeats.map(seat => (
              <div className={`seat ${selectedSeats.includes(seat) ? "selected" : ""} ${!soldSeats.has(seat) ? "empty" : ""}`}>
                <FaUser onClick={() => handleSeatSelection(seat)} />
                <span>{seat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contenedor de información de devolución */}
        <div className="devolucion-info">
          <p><strong>Origen:</strong> {viaje.origen.nombre}, {viaje.origen.departamento}</p>
          <p><strong>Destino:</strong> {viaje.destino.nombre}, {viaje.destino.departamento}</p>
          <hr />
          <p><strong>Salida:</strong> {viaje.fechaSalida}</p>
          <p><strong>Llegada:</strong> {viaje.fechaLlegada}</p>
          <p><strong>Ómnibus:</strong> {viaje.omnibus.marca} {viaje.omnibus.modelo} ({viaje.omnibus.matricula})</p>
          <p><strong>Asiento a devolver:</strong> {selectedSeats.join(", ")}</p>
          <p><strong>Monto a devolver:</strong> {montoDevolucion !== null ? `$${montoDevolucion.toFixed(2)}` : "Seleccione un asiento"}</p>
          <hr />
          <div className="price-payment">
            <button
              className="btn btn-primary rounded-pill custom-pay"
              disabled={selectedSeats.length < 1}
              onClick={procesarDevolucion}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DevolucionPasaje;