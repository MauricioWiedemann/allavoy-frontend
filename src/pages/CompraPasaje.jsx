import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import NavbarCliente from "../components/NavbarCliente";
import NavbarVendedor from "../components/NavbarVendedor";
import "../css/CompraPasaje.css";
import { BASE_URL } from "../config";

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

async function obtenerTipoDescuento(idUsuario) {
  try {
    const response = await fetch(`${BASE_URL}/usuario/${idUsuario}/descuento`);
    if (!response.ok) throw new Error("Error al obtener tipoDescuento");

    const data = await response.json();
    return data.tipoDescuento;
  } catch (error) {
    console.error("Error en la consulta:", error);
    return null;
  }
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
  const [tipoDescuento, setTipoDescuento] = useState(null);
  const [emailComprador, setEmailComprador] = useState("");
  const [emailIngresado, setEmailIngresado] = useState(false);
  const paypalRef = useRef();

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setEmailComprador(email);
    setEmailIngresado(email.trim() !== "");
  };

  const bloquearAsiento = async (seat) => {
    try {
      const response = await fetch(`${BASE_URL}/asientos/bloquear?numeroAsiento=${seat}&idViaje=${viaje.idViaje}`, { method: "POST" });
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


  useEffect(() => {
    async function fetchTipoDescuento() {
      const descuento = await obtenerTipoDescuento(payload.idUsuario);
      setTipoDescuento(descuento);
    }
    fetchTipoDescuento();
  }, [payload.idUsuario]);

  function calcularTotal(viaje, cantidad, tipoUsuario, tipoDescuento) {
    let precioBase = (viaje.precio/40) * cantidad; //pasar de pesos a dolares
    //Si es ida y vuelta, le sumo el costo del viaje de ida
    if (idaYVuelta == 2) {
      const viajeIda = location.state?.viajeIda;
      precioBase = precioBase + (viajeIda.precio/40) * cantidad; //pasar de pesos a dolares
    }

    if (tipoUsuario === "VENDEDOR") {
      const aplicaDescuento = ["ESTUDIANTE", "JUBILADO", "FUNCIONARIO"].includes(tipoDescuento);

      //Si el cliente tiene cuenta y descuento calculamos el total sino precio completo
      if (aplicaDescuento) {
        return precioBase * 0.8; // 20% de descuento
      } else {
        return precioBase;
      }
    }
    if (tipoUsuario === "CLIENTE") {
      const aplicaDescuento = ["ESTUDIANTE", "JUBILADO", "FUNCIONARIO"].includes(tipoDescuento);
      if (aplicaDescuento) {
        return precioBase * 0.8; // 20% de descuento
      }
    }

    return precioBase; 
  }

  async function obtenerDescuentoPorEmail(email) {
    try {
      const response = await fetch(`${BASE_URL}/usuario/descuento?email=${email}`);
      if (!response.ok) throw new Error("Error al obtener descuento del comprador");

      const data = await response.json();
      return data.tipoDescuento;
    } catch (error) {
      console.error("Error en la consulta de descuento por email:", error);
      return null;
    }
  }

  const validarEmail = async (email) => {
    if (!email) {
      return;
    }

    try {
      const tipoDescuento = await obtenerDescuentoPorEmail(email); // Consulta el descuento
      if (tipoDescuento) {
        setEmailIngresado(true);
        setTipoDescuento(tipoDescuento); // Actualiza el descuento si existe
      } else {
        setTipoDescuento(null); // No muestra alerta, simplemente no aplica descuento
      }
    } catch (error) {
      console.error("Error al validar email:", error);
    }
  };

  useEffect(() => {
    const condicionesCumplidas = selectedSeats.length === cantidad && (payload.rol === "CLIENTE" || (payload.rol === "VENDEDOR" && emailIngresado));
    if (!condicionesCumplidas) {
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
      return;
    }
    if (paypalRef.current.hasChildNodes()) {
      paypalRef.current.innerHTML = "";
    }
    window.paypal.Buttons({
      createOrder: (data, actions) => {
        const montoTotal = calcularTotal(viaje, cantidad, payload.rol, tipoDescuento).toFixed(2);

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
          const idPasajes = [];
          const idPago = details.purchase_units[0].payments.captures[0].id;
          for (const numeroAsiento of selectedSeats) {
            try {
              console.log("Email del comprador antes de la solicitud:", emailComprador);
              const response = await fetch(`${BASE_URL}/pasajes/confirmar-compra`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  numeroAsiento: numeroAsiento,
                  idUsuario: payload.idUsuario,
                  idViaje: viaje.idViaje,
                  emailComprador: payload.rol === "VENDEDOR" ? emailComprador : null,
                  idPago: idPago
                }),
              });

              if (!response.ok) {
                console.error("Error al registrar pasaje:", await response.text());
              } else {
                const data = await response.json();
                idPasajes.push(data.idPasaje);
              }
            } catch (err) {
              console.error("Error al conectar con backend:", err);
            }
          }
          if (idaYVuelta == 2) {
            const viajeIda = location.state?.viajeIda;
            const asientoIda = location.state?.asientoIda;
            for (const numeroAsientoIda of asientoIda) {
              try {

                console.log("Email del comprador antes de la solicitud:", numeroAsientoIda);
                const response = await fetch(`${BASE_URL}/pasajes/confirmar-compra`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    numeroAsiento: numeroAsientoIda,
                    idUsuario: payload.idUsuario,
                    idViaje: viajeIda.idViaje,
                    emailComprador: payload.rol === "VENDEDOR" ? emailComprador : null,
                    idPago: idPago
                  }),
                });

                if (!response.ok) {
                  console.error("Error al registrar pasaje:", await response.text());
                } else {
                  const data = await response.json();
                  idPasajes.push(data.idPasaje);
                }
              } catch (err) {
                console.error("Error al conectar con backend:", err);
              }
            }
          }

          navigate("/confirmacion", { state: { viaje, selectedSeats, idPasajes } });
        });
      },
      onError: (err) => {
        console.error("Error en el pago con PayPal:", err);
        alert("Hubo un error al procesar el pago.");
      },
    }).render(paypalRef.current);
  }, [selectedSeats, cantidad, viaje, tipoDescuento]);

  const vueltaContinuar = () => {
    navigate("/listado", {
      state: {
        ida: viaje,
        numeroAsientoIda: numeroAsiento,
        cantidad,
        idaYVuelta: idaYVuelta
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
          {payload.rol === "VENDEDOR" && (
            <div className="mb-3">
              <label><strong>Email del comprador:</strong></label>
              <input
                type="email"
                className="form-control rounded-pill"
                placeholder="Correo"
                value={emailComprador}
                onChange={handleEmailChange}
              />
              <button
                onClick={() => validarEmail(emailComprador)}
                className="btn btn-primary mt-2"
                disabled={!emailIngresado}
              >
                Validar Email
              </button>
            </div>
          )}
          <hr />
          <div className="price-payment">
            <p><strong>Precio total:</strong> ${calcularTotal(viaje, cantidad, payload.rol, tipoDescuento).toFixed(2)}</p>
            <div ref={paypalRef} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompraPasajes;
