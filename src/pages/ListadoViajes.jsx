import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/ListadoViajes.css";
import NavbarCliente from "../components/NavbarCliente";

const viajes = [
  {
    id: 1,
    origen: 'Artigas',
    destino: 'Montevideo',
    salida: '17/07/2025 00:30',
    llegada: '17/07/2025 06:30',
    precio: 1300,
    omnibus: '201',
    pasajesLibres: 5,
  },
  {
    id: 2,
    origen: 'Colonia',
    destino: 'Montevideo',
    salida: '24/05/2025 01:00',
    llegada: '24/05/2025 07:00',
    precio: 1400,
    omnibus: '303',
    pasajesLibres: 20,
  },
  {
    id: 3,
    origen: 'Artigas',
    destino: 'Montevideo',
    salida: '19/07/2025 02:00',
    llegada: '19/07/2025 08:00',
    precio: 1500,
    omnibus: '404E',
    pasajesLibres: 0,
  },
];

function ListadoViajes() {
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fecha, setFecha] = useState("");
  const [viajesFiltrados, setViajesFiltrados] = useState([]);
  const [cantidad, setCantidad] = useState("");

  const handleBuscar = () => {
    const cantidadPasajes = parseInt(cantidad);
    const resultados = viajes.filter((viaje) => {
      const fechaSalida = viaje.salida.split(" ")[0].split("/").reverse().join("-");
      return (
        viaje.origen === origen &&
        viaje.destino === destino &&
        fechaSalida === fecha &&
        viaje.pasajesLibres >= cantidadPasajes
      );
    });
    setViajesFiltrados(resultados);
  };

  return (
    <>
      <NavbarCliente />
      <div className="listadoViaje-bg">
        <div className="contenedor-viajes">
          <div className="seccionFiltros">
            <div className="filtros">
              <select
                className="form-select rounded-pill filtro-input"
                value={origen}
                onChange={(e) => setOrigen(e.target.value)}
              >
                <option value="" disabled>Origen</option>
                <option value="Artigas">Artigas</option>
                <option value="Colonia">Colonia</option>
              </select>
              <select
                className="form-select rounded-pill filtro-input"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
              >
                <option value="" disabled>Destino</option>
                <option value="Montevideo">Montevideo</option>
              </select>
              <input
                type="date"
                className="form-control rounded-pill filtro-input"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
              <input
                type="text"
                className="form-control rounded-pill filtro-input"
                placeholder="Pasajes"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>
            <div className="buscar">
              <button
                className="btn btn-primary rounded-pill"
                onClick={handleBuscar}
              >
                Buscar
              </button>
            </div>
          </div>

          <div className="listadoViaje-card card p-4 shadow-lg">
            <div className="space-y-4">
              {viajesFiltrados.length === 0 ? (
                <p className="text-center text-muted">No se encontraron viajes.</p>
              ) : (
                viajesFiltrados.map((viaje) => (
                  <div
                    key={viaje.id}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border shadow-sm"
                  >
                    <div className="listadoViajeContenido">
                      <p>
                        <strong>Salida:</strong> {viaje.salida}
                      </p>
                      <p>
                        <strong>Llegada:</strong> {viaje.llegada}
                      </p>
                    </div>
                    <div className="listadoViajeContenido">
                      <p>
                        <strong>Precio:</strong> ${viaje.precio}
                      </p>
                      <p>
                        <strong>Ómnibus:</strong> {viaje.omnibus}
                      </p>
                    </div>
                    <Link
                      to={`/comprar/${viaje.id}`}
                      state={{ viaje, cantidad }}
                      className="btn w50 btn-primary rounded-pill">
                      Comprar
                    </Link>
                    <Link
                        to={`/devolucion/${viaje.id}`}
                        state={{ viaje, cantidad }}
                        className="btn w50 btn-primary rounded-pill">
                        Devolucion
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ListadoViajes;
