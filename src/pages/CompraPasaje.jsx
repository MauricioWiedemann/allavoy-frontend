import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import NavbarCliente from "../components/NavbarCliente";
import "../css/CompraPasaje.css";

function CompraPasajes() {
  const location = useLocation();
  const cantidad = location.state?.cantidad;
  const viaje = location.state?.viaje;

  if (!viaje || !cantidad || !viaje.omnibus || !viaje.omnibus.capacidad) {
    return <p style={{ color: "red", textAlign: "center" }}>Error: No hay datos disponibles o incompletos.</p>;
  }

  const totalSeats = Array.from({ length: viaje.omnibus.capacidad }, (_, i) => i + 1);
  const soldSeats = new Set(viaje.asientosOcupados || []);
  const [selectedSeats, setSelectedSeats] = useState([]);
  console.log("Asientos ocupados:", viaje.asientosOcupados);
  const paypalRef = useRef();

  const handleSeatSelection = (seat) => {
    if (!soldSeats.has(seat)) {
      if (selectedSeats.includes(seat)) {
        setSelectedSeats(selectedSeats.filter(s => s !== seat));
      } else if (selectedSeats.length < cantidad) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };


  function calcularTotal(viaje, cantidad, tipoUsuario, tipoDescuento) {
    let precioBase = viaje.precio * cantidad;

    if (tipoUsuario === "VENDEDOR") return precioBase;

    if (tipoUsuario === "CLIENTE") {
      const aplicaDescuento = ["ESTUDIANTE", "JUBILADO", "FUNCIONARIO"].includes(tipoDescuento);
      if (aplicaDescuento) {
        return precioBase * 0.8; // 20% de descuento
      }
    }

    return precioBase;
  }

  useEffect(() => {
      if (selectedSeats.length < cantidad) return; // Solo renderizar cuando hay asientos suficientes

      window.paypal.Buttons({
        createOrder: (data, actions) => {
             const tipoDescuento = localStorage.getItem("tipoDescuento");
          const tipoUsuario = localStorage.getItem("tipoUsuario");
          const montoTotal = calcularTotal(viaje, cantidad, tipoUsuario, tipoDescuento).toFixed(2);

          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: montoTotal,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          return actions.order.capture().then(async (details) => {
            console.log("Pago completado por:", details.payer.name.given_name);

            const idUsuario = parseInt(localStorage.getItem("id_usuario"), 10);
            for (const numeroAsiento of selectedSeats) {
              try {
                const response = await fetch("http://localhost:8080/pasajes/confirmar-compra", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    numeroAsiento,
                    idUsuario,
                    idViaje: viaje.idViaje
                  }),
                });

                if (!response.ok) {
                  console.error("Error al registrar pasaje:", await response.text());
                }
              } catch (err) {
                console.error("Error al conectar con backend:", err);
              }
            }

            alert("Compra realizada con éxito");
            // Podés redirigir al usuario si querés:
            // window.location.href = "/mis-compras";
          });
        },
        onError: (err) => {
          console.error("Error en el pago con PayPal:", err);
          alert("Hubo un error al procesar el pago.");
        },
      }).render(paypalRef.current);
    }, [selectedSeats, cantidad, viaje]);

  return (
    <div className="compraPasaje-bg">
      <NavbarCliente />
      <div className="compraPasaje-container">
        <div className="seat-container">
          <h2>Selecciona tus asientos</h2>
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
          <div className="price-payment">
            <p><strong>Precio total:</strong> ${viaje.precio * cantidad}</p>
            {selectedSeats.length < cantidad ? (
              <button className="btn btn-primary rounded-pill custom-pay" disabled>
                Selecciona {cantidad} asiento(s)
              </button>
            ) : (
              <div ref={paypalRef} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraPasajes;
