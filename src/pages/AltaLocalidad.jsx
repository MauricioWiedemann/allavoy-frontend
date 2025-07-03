import React, { useState, useEffect } from "react";
import "../css/AltaLocalidad.css";
import NavbarVendedor from "../components/NavbarVendedor";
import Papa from 'papaparse';
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";

function AltaLocalidad() {

  const [departamento, setDepartamento] = useState("");
  const [nombre, setNombre] = useState("");
  const [data, setData] = useState([]);
  const [isIndividual, setIsIndividual] = useState(true);
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

  function mostrarAlertaAdvertencia(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("alert")
  };

  function registrarLocalidad() {
    let statusOk = false;
    if (departamento.trim() === "" || nombre.trim() === "") {
      alert("Complete todos los campos.");
    } else {
      fetch(`${BASE_URL}/localidad/alta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          departamento: departamento,
          nombre: nombre
        })
      })
        .then(response => {
          statusOk = response.ok;
          return response.text();
        })
        .then(data => {
          if(!statusOk){
            throw new Error(data);
          }
          mostrarAlerta(data.toString());
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch(error => {
          mostrarAlertaError(error.toString());
        });
    }
  }

  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    Papa.parse(archivo, {
      headerd: true,
      complete: (resultados) => {
        setData(resultados.data);
      },
    });
  };

  function altaLocalidadesCsv() {
    if (data.length > 0) {
      fetch("https://allavoy-backend.onrender.com/localidad/altacsv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          return response.text();
        })
        .then(data => {

          const resultado = data.match(/Se completaron (\d+)\/(\d+)/);
          const lineas = data.split("\n");
          const errores = lineas.filter(lineas => lineas.startsWith("Error"));

          if (resultado) {
            const completadas = parseInt(resultado[1]);
            const totales = parseInt(resultado[2]);

            if (completadas === totales)
              mostrarAlerta("Todas las localidades se cargaron correctamente.");
            else if (completadas > 0) {
              let mesnaje = `Se cargaron ${completadas} de ${totales}.\n`;
              mesnaje += "\nErrores:\n" + errores.join("\n");
              mostrarAlertaAdvertencia(mesnaje);
            } else
              mostrarAlertaError("No se pudo cargar ninguna localidad.");
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          //window.location.reload();
        });
    } else {
      mostrarAlertaError("Tiene que ingresar un archivo.");
    }
  };

  useEffect(() => {
    if (isIndividual) {
      var indi = document.getElementById("individual-select");
      indi.style.backgroundColor = "#d9d9d9";
      var csv = document.getElementById("csv-select");
      csv.style.backgroundColor = "#bdbdbd";
    } else {
      var indi = document.getElementById("individual-select");
      indi.style.backgroundColor = "#bdbdbd";
      var csv = document.getElementById("csv-select");
      csv.style.backgroundColor = "#d9d9d9";
    }
  }, [isIndividual]);

  useEffect(() => {
    if (isIndividual) {
      var indi = document.getElementById("individual-select");
      indi.style.backgroundColor = "#d9d9d9";
      var csv = document.getElementById("csv-select");
      csv.style.backgroundColor = "#bdbdbd";
    } else {
      var indi = document.getElementById("individual-select");
      indi.style.backgroundColor = "#bdbdbd";
      var csv = document.getElementById("csv-select");
      csv.style.backgroundColor = "#d9d9d9";
    }
  }, [isIndividual]);

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
      <div className="altaLocalidad-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="altaLocalidad-card card p-4 shadow-lg">
          <div class="row mb-4">
            <button id="individual-select" class="select-tipo-alta-localidad col-6 col-sm-3" onClick={() => setIsIndividual(true)}>Individual</button>
            <button id="csv-select" class="select-tipo-alta-localidad col-6 col-sm-3" onClick={() => setIsIndividual(false)}>CSV</button>
          </div>
          {isIndividual && (
            <div id="alta-individual">
              <div className="mb-3">
                <div class="alta-individual"></div>
                <select className="form-select rounded-pill" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
                  <option value="" disabled selected>Departamento</option>
                  <option value="ARTIGAS">Artigas</option>
                  <option value="CANELONES">Canelones</option>
                  <option value="CERRO_LARGO">Cerro Largo</option>
                  <option value="COLONIA">Colonia</option>
                  <option value="DURAZNO">Durazno</option>
                  <option value="FLORES">Flores</option>
                  <option value="FLORIDA">Florida</option>
                  <option value="LAVALLEJA">Lavalleja</option>
                  <option value="MALDONADO">Maldonado</option>
                  <option value="MONTEVIDEO">Montevideo</option>
                  <option value="PAYSANDU">Paysandú</option>
                  <option value="RIO_NEGRO">Río Negro</option>
                  <option value="RIVERA">Rivera</option>
                  <option value="ROCHA">Rocha</option>
                  <option value="SALTO">Salto</option>
                  <option value="SAN_JOSE">San José</option>
                  <option value="SORIANO">Soriano</option>
                  <option value="TACUAREMBO">Tacuarembó</option>
                  <option value="TREINTA_Y_TRES">Treinta y Tres</option>
                </select>
              </div>
              <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Localidad" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div class="d-grid gap-1">
                <button className="btn w50 btn-primary rounded-pill" onClick={registrarLocalidad} >Crear Localidad</button>
                <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
              </div>
            </div>
          )}
          {!isIndividual && (
            <div id="alta-individual">
              <div className="mb-3">
                <p>Ingrese un archivo CSV</p>
                <input type="file" accept=".csv" className="form-control rounded-pill" onChange={manejarArchivo} />
              </div>
              <p>Ejemplo del formato CSV</p>
              <div id="csv-ejemplo" className="mb-3">
                <p>DEPARTAMENTO;Localidad</p>
                <p>MONTEVIDEO;Montevideo</p>
                <p>CERRO LARGO;Melo</p>
              </div>
              <div class="d-grid gap-1">
                <button className="btn w50 btn-primary rounded-pill" onClick={altaLocalidadesCsv} >Crear Localidades</button>
                <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AltaLocalidad;