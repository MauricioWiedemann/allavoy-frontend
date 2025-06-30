import React, { useState, useEffect } from "react";
import "../css/AltaLocalidad.css";
import NavbarVendedor from "../components/NavbarVendedor";
import OmnibusAltaVaije from "../components/OmnibsuAltaViaje";
import { useViajeContext } from "../context/ViajeContext";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";


function CambiarLocalidad() {
  const { omnibusViaje } = useViajeContext();

  const [localidadSalida, setLocalidadSalida] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [horaSalida, setHoraSalida] = useState("");
  const [localidadLlegada, setLocalidadLlegada] = useState("");
  const [fechaLlegada, setFechaLlegada] = useState("");
  const [horaLlegada, setHoraLlegada] = useState("");

  const [listaOmnibus, setListaOmnibus] = useState([]);
  const [clicked, setClicked] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");

  function mostrarAlerta(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("mensaje")
  };

  function mostrarAlertaError(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("error")
  };


  async function cargarLocalidades(componenteId) {
    //obtengo el componente donde va la lista de localidades
    const selectLocalidades = document.getElementById(componenteId);
    //get para obtener el array con las localidades
    const localidadesArray =
      await fetch("https://allavoy-backend.onrender.com/localidad/obtener", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(response => {
        return response.json();
      })
        .then(data => {
          return data;
        })
      ;
    //generar los option que se insertara en el select con los datos de las localidades
    localidadesArray.forEach(element => {
      const option = document.createElement("option");
      option.value = JSON.stringify(element);
      option.textContent = element.nombre.concat(", ", element.departamento.replace("_", " "));
      selectLocalidades.appendChild(option);
    });
  }

  //cargar las localidades al cargar la pagina
  useEffect(() => {
    cargarLocalidades("select-localidades-salida");
    cargarLocalidades("select-localidades-llegada");
  }, []);

  function validarLocalidades() {
    return localidadLlegada === localidadSalida;
  }

  function validarFechas() {
    let salidaAux = fechaSalida.concat("T");
    salidaAux = salidaAux.concat(horaSalida);
    const salida = new Date(salidaAux);

    let llegadaAux = fechaLlegada.concat("T");
    llegadaAux = llegadaAux.concat(horaLlegada);
    const llegada = new Date(llegadaAux);

    const today = new Date(Date.now());

    if (salida < today) {
      mostrarAlertaError("La fecha de salida no puede ser menor a la actual");
    } else if (salida >= llegada) {
      mostrarAlertaError("La fecha de llegada tiene que ser mayor a la de salida");
    } else {
      return true;
    }
  }

  async function obtenerOmnibus() {
    setClicked(true);
    if (localidadSalida.trim() === "" || fechaSalida.trim() === "" || horaSalida.trim() === "" || localidadLlegada.trim() === "" || fechaLlegada.trim() === "" || horaLlegada.trim() === "") {
      mostrarAlertaError("Complete todos los campos.");
    } else if (validarLocalidades()) {
      mostrarAlertaError("Las localidades no pueden ser iguales.");
    } else if (validarFechas()) {
      //obtener omnibus validos
      let localidadAux = JSON.parse(localidadSalida).idLocalidad;
      await fetch("https://allavoy-backend.onrender.com/omnibus/obtener", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          localidadSalida: localidadAux,
          fechaSalida: fechaSalida,
          horaSalida: horaSalida,
          fechaLlegada: fechaLlegada,
          horaLlegada: horaLlegada
        })
      }).then(response => {
        return response.json();
      })
        .then(data => {
          setListaOmnibus(data);
        })
        ;
    }
  }

  useEffect(() => {
    var fin = document.getElementById("finalizar-alta-id");
    var par = document.getElementById("p-container");
    if (listaOmnibus.length === 0) {
      fin.style.display = "none";
      if (clicked) {
        par.style.display = "block";
      }
    } else {
      fin.style.display = "block";
      par.style.display = "none";
    }
  }, [listaOmnibus]);

  function cambiarLocalidadOmnibus() {
    if (JSON.stringify(omnibusViaje).trim() === "[]") {
      mostrarAlerta("Seleccione un omnibus.");
    } else {
      fetch("https://allavoy-backend.onrender.com/omnibus/cambiarlocalidad", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          localidadSalida: JSON.parse(localidadSalida),
          fechaSalida: fechaSalida,
          horaSalida: horaSalida,
          localidadLlegada: JSON.parse(localidadLlegada),
          fechaLlegada: fechaLlegada,
          horaLlegada: horaLlegada,
          omnibus: omnibusViaje.omnibus,
          precio: null
        })
      }).then(response => {
        return response.text();
      }).then(data => {
        mostrarAlerta(data);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
        ;
    }
  }

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
      <div className="altaViaje-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="altaViaje-card card p-4 mt-3 mb-3 shadow-lg">

          <div className="mb-3">
            <h2 className="text-center mb-3">Salida</h2>
            <select id="select-localidades-salida" className="form-select rounded-pill mb-3" value={localidadSalida} onChange={(e) => setLocalidadSalida(e.target.value)}>
              <option value="" disabled selected>Localidad</option>
            </select>
            <div className="mb-3">
              <input type="date" className="form-control rounded-pill" value={fechaSalida} onChange={(e) => setFechaSalida(e.target.value)} />
            </div>
            <div className="mb-3">
              <input type="time" className="form-control rounded-pill" value={horaSalida} onChange={(e) => setHoraSalida(e.target.value)} />
            </div>

            <h2 className="text-center mb-3">Llegada</h2>
            <select id="select-localidades-llegada" className="form-select rounded-pill mb-3" value={localidadLlegada} onChange={(e) => setLocalidadLlegada(e.target.value)}>
              <option value="" disabled selected>Localidad</option>
            </select>
            <div className="mb-3">
              <input type="date" className="form-control rounded-pill" value={fechaLlegada} onChange={(e) => setFechaLlegada(e.target.value)} />
            </div>
            <div className="mb-3">
              <input type="time" className="form-control rounded-pill" value={horaLlegada} onChange={(e) => setHoraLlegada(e.target.value)} />
            </div>
          </div>
          <div class="d-grid mb-3">
            <button className="btn w50 btn-primary rounded-pill" onClick={() => obtenerOmnibus()}>Buscar Omnibus</button>
          </div>
          <div id="p-container">
            <p>No hay omnibus disponibles.</p>
          </div>
          <div id="finalizar-alta-id" className="omnibus-container mb-3">
            <div id="omnibus-container-id" className="row row-cols-2 mb-3">
              {listaOmnibus.map((element) => (
                <OmnibusAltaVaije omnibus={element} />
              ))}
            </div>
            <div>
              <button id="btn-crear" className="btn w50 btn-primary rounded-pill" onClick={cambiarLocalidadOmnibus}>Confirmar</button>
            </div>
          </div>
          <div id="cancelar-btn">
            <button id="btn-cancelar" className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CambiarLocalidad;