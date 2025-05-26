import React, { useState } from "react";
import "../css/ReasignarViaje.css";
import NavbarVendedor from "../components/NavbarVendedor";
import Modal from "../components/Modal";

const viajes = [
  {
    id: 1,
    salida: '17/07/2025 00:30',
    llegada: '17/07/2025 06:30',
    precio: 1300,
    omnibus: '201',
    pasajes: ['Asiento 1A', 'Asiento 2B', 'Asiento 3C', 'Asiento 4D'],
  },
  {
    id: 2,
    salida: '18/07/2025 01:00',
    llegada: '18/07/2025 07:00',
    precio: 1400,
    omnibus: '303',
    pasajes: ['Asiento 1A', 'Asiento 2B'],
  },
  {
    id: 3,
    salida: '19/07/2025 02:00',
    llegada: '19/07/2025 08:00',
    precio: 1500,
    omnibus: '404E',
    pasajes: ['Asiento 5A', 'Asiento 6C', 'Asiento 7D'],
  },
];

function ListadoViajes() {
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [open, setOpen] = useState(false)
  return (
    <>
      <NavbarVendedor />
      <div className="reasignarViaje-bg">
        <div className="reasignarViaje-card card p-4 shadow-lg">

          <div className="space-y-4">
            {viajes.map((viaje) => (
              <div
                key={viaje.id}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border shadow-sm"
              >
              <div className="reasignarViajeContenido">
                    <p><strong>Salida:</strong> {viaje.salida}</p>
                    <p><strong>Llegada:</strong> {viaje.llegada}</p>
              </div>
              <div className="reasignarViajeContenido">
                    <p><strong>Precio:</strong> ${viaje.precio}</p>
                    <p><strong>Ómnibus:</strong> {viaje.omnibus}</p>
              </div>
                <button
                  onClick={() => {
                    setViajeSeleccionado(viaje);
                    setOpen(true);
                  }}
                  className={`btn w50 btn-primary rounded-pill`}>Seleccionar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        {viajeSeleccionado && (
          <div className="modal-container">
            <div className="modal-body">
              <div className="mx-auto my-4 w-48 text-center">
                <h3 className="text-lg font-black text-gray-800">Pasajes Vendidos</h3>
                <p className="text-sm text-gray-500">Ómnibus: {viajeSeleccionado.omnibus}</p>
                <ul className="list-disc list-inside text-sm mt-2 text-gray-600">
                  {viajeSeleccionado.pasajes.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="pasajesVendidosBotones">
              <button className="btn w50 btn-primary rounded-pill" onClick={() => setOpen(false)}>Cancelar</button>
              <button className={`btn w50 btn-primary rounded-pill`}>Reasignar</button>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
}

export default ListadoViajes;
