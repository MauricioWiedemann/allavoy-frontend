import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavbarCliente from "../components/NavbarCliente";
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/CompraPasaje.css";

function Timer({ onExpire }) {
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutos en segundos

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  return <p><strong>Tiempo restante:</strong> {formatTime(timeLeft)}</p>;
}

function CompraPasajes() {
  const location = useLocation();
  const cantidad = location.state?.cantidad;
  const viaje = location.state?.viaje;
  const idaYVuelta = location.state?.idaYVuelta;
  const token = localStorage.getItem("token");
  const payload = jwtDecode(token);
  const navigate = useNavigate();


  if (!viaje || !cantidad || !viaje.omnibus || !viaje.omnibus.capacidad) {
    return <p style={{ color: "red", textAlign: "center" }}>Error: No hay datos disponibles o incompletos.</p>;
  }

  const totalSeats = Array.from({ length: viaje.omnibus.capacidad }, (_, i) => i + 1);
  const soldSeats = new Set(viaje.asientosOcupados || []);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const bloquearAsiento = async (seat) => {
    try {
      const response = await fetch(`https://allavoy-backend.onrender.com/asientos/bloquear?numeroAsiento=${seat}&idViaje=${viaje.idViaje}`, { method: "POST" });
      if (!response.ok) throw new Error("Error al bloquear el asiento");
      console.log("Asiento bloqueado:", seat);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSeatSelection = (seat) => {
    if (!soldSeats.has(seat)) {
      if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter(s => s !== seat));
      } else if (selectedSeats.length < cantidad) {
        bloquearAsiento(seat);
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      alert("Tiempo de compra expirado. Los asientos han sido liberados.");
      window.location.href = "/home";
    }, 10 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);


  const vueltaContinuar = () => {
    navigate("/buscarvuelta", {
      state: {
        viaje,
        asientoIda: selectedSeats,
        cantidad,
        idaYVuelta
      }
    });
  };


  return (
    <div className="compraPasaje-bg">
      {payload.rol === "VENDEDOR" ? <NavbarVendedor /> : <NavbarCliente />}
      <div className="compraPasaje-container">
        <div className="seat-container">
          <h2>Selecciona tus asientos</h2>
          <Timer onExpire={() => {
            alert("Tiempo de compra expirado. Redirigiendo...");
            window.location.href = "/home";
          }} />
          <div className="seat-map">
            {totalSeats.map(seat => (
              <div
                key={seat}
                className={`seat ${selectedSeats.includes(seat) ? "selected" : ""} ${soldSeats.has(seat) ? "occupied" : ""}`}
              >
                <FaUser onClick={() => handleSeatSelection(seat)} />
                <span>{seat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="purchase-info-container">
          <p><strong>Origen:</strong> {viaje.origen.nombre}, {viaje.origen.departamento}</p>
          <p><strong>Destino:</strong> {viaje.destino.nombre}, {viaje.destino.departamento}</p>
          <hr />
          <p><strong>Salida:</strong> {viaje.fechaSalida}</p>
          <p><strong>Llegada:</strong> {viaje.fechaLlegada}</p>
          <p><strong>Ómnibus:</strong> {viaje.omnibus.marca} {viaje.omnibus.modelo} ({viaje.omnibus.matricula})</p>
          <p><strong>Asiento(s):</strong> {selectedSeats.join(", ")}</p>
          <hr />
          <button onClick={vueltaContinuar} className="btn btn-primary mt-2">Continuar </button>
        </div>
      </div>
    </div>
  );
}

export default CompraPasajes;
