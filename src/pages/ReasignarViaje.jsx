import React, { useEffect, useState } from "react";
import "../css/ReasignarViaje.css";
import NavbarVendedor from "../components/NavbarVendedor";
import Modal from "../components/Modal";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function ListadoViajes() {
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);
  const [omnibusSeleccionado, setOmnibusSeleccionado] = useState(null);

  const [open, setOpen] = useState(false)

  const [listaViajes, setListaViajes] = useState([]);
  const [listaOmnibus, setListaOmnibus] = useState([]);

  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");


  function mostrarAlertaError(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("error")
  };

  function mostrarAlerta(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("mensaje")
  };

  async function obtenerViajes() {
    //obtener viajes que no partieron
    await fetch(`${BASE_URL}/viaje/obtenernopartidos`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(response => {
      return response.json();
    })
      .then(data => {
        setListaViajes(data);
      })
      ;
  }

  async function obtenerOmnibus() {
    setOmnibusSeleccionado("");
    const arrayAuxSlida = viajeSeleccionado.fechaSalida.split("T", 2);
    const arrayAuxLlegada = viajeSeleccionado.fechaLlegada.split("T", 2);
    await fetch(`${BASE_URL}/omnibus/obtenerreasignar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        localidadSalida: viajeSeleccionado.origen.idLocalidad,
        fechaSalida: arrayAuxSlida[0],
        horaSalida: arrayAuxSlida[1].substring(0, 5),
        fechaLlegada: arrayAuxLlegada[0],
        horaLlegada: arrayAuxLlegada[1].substring(0, 5),
        ocupados: viajeSeleccionado.cantidadOcupados
      })
    }).then(response => {
      return response.json();
    })
      .then(data => {
        setListaOmnibus(data);
      })
      ;
  }

  async function reasignarViaje() {
    //obtener viajes que no partieron
    await fetch(`${BASE_URL}/viaje/reasignar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idViaje: viajeSeleccionado.idViaje,
        idOmnibus: omnibusSeleccionado.omnibus.idOmnibus
      })
    }).then(response => {
      if (!response.ok) {
        throw new Error("Error al reasignar");
      }
      return response;
    })
      .then(data => {
        console.log("Viaje reasignado:", data);
        mostrarAlerta("Viaje reasignado.");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(error => {
        console.error("Error:", error);
        mostrarAlertaError("Error al reasignar.");
      });
  }

  function swapCharacters(inputString) {
    let charArray = inputString.split('');
    charArray[10] = " ";
    return charArray.join('');
  }

  function omnSeleccionado() {
    var btns = document.getElementsByClassName("omnibus-dispo");
    Array.from(btns).forEach((b) => {
      if (omnibusSeleccionado && b.id == omnibusSeleccionado.omnibus.idOmnibus) {
        b.style.border = "2px solid #bbe4ff";
        b.style.backgroundColor = "rgb(240, 255, 255)"
      } else {
        b.style.backgroundColor = "white";
        b.style.border = "2px solid #cccccc";
      }
    });
  }

  useEffect(() => {
    obtenerViajes();
  }, []);

  useEffect(() => {
    obtenerOmnibus();
  }, [viajeSeleccionado]);

  useEffect(() => {
    omnSeleccionado();
  }, [omnibusSeleccionado]);

  function validarTokenUsuario() {
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
    <>
      <NavbarVendedor />
      <div className="reasignarViaje-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="reasignarViaje-card card p-4 shadow-lg">

          <div className="space-y-4">
            {listaViajes.map((viaje) => (
              <div
                key={viaje.idViaje}
                className="flex justify-between items-center bg-light m-1 p-4 rounded border shadow-sm"
              >
                <div className="reasignarViajeContenido">
                  <p><strong>Salida:</strong> {swapCharacters(viaje.fechaSalida)}</p>
                  <p><strong>Llegada:</strong> {swapCharacters(viaje.fechaLlegada)}</p>
                </div>
                <div className="reasignarViajeContenido">
                  <p><strong>Precio:</strong> ${viaje.precio}</p>
                  <p><strong>Ómnibus:</strong> {viaje.omnibus.matricula}</p>
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
                <h3 className="text-lg font-black text-gray-800">Ómnibus disponibles</h3>
                {listaOmnibus.map((omnibus) => (
                  <button id={omnibus.idOmnibus} className="omnibus-dispo col" onClick={() => setOmnibusSeleccionado({ omnibus })}>
                    <p>{omnibus.marca}, {omnibus.modelo}</p>
                    <p>Matrícula: {omnibus.matricula}</p>
                    <p>Cantidad de asiento: {omnibus.capacidad}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="pasajesVendidosBotones">
              <button className="btn w50 btn-secondary rounded-pill" onClick={() => setOpen(false)}>Cancelar</button>
              <button className="btn w50 btn-primary rounded-pill" onClick={() => reasignarViaje()}>Reasignar</button>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
}

export default ListadoViajes;
