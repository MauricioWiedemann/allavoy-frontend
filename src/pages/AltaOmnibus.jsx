import React, { useState, useEffect } from "react";
import "../css/AltaOmnibus.css";
import NavbarVendedor from "../components/NavbarVendedor";
import Papa from 'papaparse';
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function AltaOmnibus() {

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [nroMotor, setNroMotor] = useState("");
  const [matricula, setMatricula] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [localidad, setLocalidad] = useState("");

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

  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    Papa.parse(archivo, {
      headerd: true,
      complete: (resultados) => {
        setData(resultados.data);
      },
    });
  };

  function validar_matricula(valor) {
    const regrex = /^[A-S]TU\d{4}$/;
    return regrex.test(valor);
  }

  function registrarOmnibus() {
    let statusOk = false;
    if (marca.trim() === "" || modelo.trim() === "" || nroMotor.trim() === "" || matricula.trim() === "" || capacidad.trim() === "" || localidad.trim() === "") {
      mostrarAlertaError("Complete todos los campos.");
    } else if (!validar_matricula(matricula.toUpperCase())) {
      mostrarAlertaError("La matricula no es válida.");
    } else if (capacidad > 40) {
      mostrarAlertaError("La capacidad no puede ser mayor a 40.");
    } else {
      fetch(`${BASE_URL}/omnibus/alta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          marca: marca,
          modelo: modelo,
          numeroSerie: nroMotor,
          matricula: matricula.toUpperCase(),
          capacidad: capacidad,
          localidad: JSON.parse(localidad)
        })
      })
        .then(response => {
          statusOk = response.ok;
          return response.text();
        })
        .then(data => {
          console.log("Omnibus registrado:", data);
          mostrarAlerta("omnibus registrado");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch(error => {
          console.error("Error:", error);
          mostrarAlertaError("Error al registrar el omnibus.");
        });
    }
  }

  async function cargarLocalidades() {
    //obtengo el componente donde va la lista de localidades
    const selectLocalidades = document.getElementById("select-localidades");
    //get para obtener el array con las localidades
    const localidadesArray =
      await fetch(`${BASE_URL}/localidad/obtener`, {
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

  function altaOmnibusCsv() {
    if (data.length > 0) {
      fetch(`${BASE_URL}/omnibus/altacsv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          return response.text();
        }).then(data => {
          const resultado = data.match(/Se completaron (\d+)\/(\d+)/);
          const lineas = data.split("\n");
          const errores = lineas.filter(lineas => lineas.startsWith("Error"));

          if (resultado) {
            const completadas = parseInt(resultado[1]);
            const totales = parseInt(resultado[2]);

            if (completadas === totales)
              mostrarAlerta("Todas los ómnibus se cargaron correctamente.");
            else if (completadas > 0) {
              let mesnaje = `Se cargaron ${completadas} de ${totales}.\n`;
              mesnaje += "\nErrores:\n" + errores.join("\n");
              mostrarAlertaAdvertencia(mesnaje);
            } else
              mostrarAlertaError("No se pudo cargar ningún ómnibus.");
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
    } else {
      mostrarAlertaError("Tiene que ingresar un archivo.")
    }
  };

  //cargar las localidades al cargar la pagina
  useEffect(() => {
    cargarLocalidades();
  }, []);

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
      <div className="altaOmnibus-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="altaOmnibus-card card p-4 shadow-lg">
          <div class="row mb-4">
            <button id="individual-select" class="select-tipo-alta-omnibus col-6 col-sm-3" onClick={() => setIsIndividual(true)}>Individual</button>
            <button id="csv-select" class="select-tipo-alta-omnibus col-6 col-sm-3" onClick={() => setIsIndividual(false)}>CSV</button>
          </div>
          {isIndividual && (
            <div id="alta-individual">
              <div className="mb-3">
                <div class="alta-individual"></div>
                <div className="mb-3">
                  <input type="text" className="form-control rounded-pill" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control rounded-pill" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control rounded-pill" placeholder="Nro de Motor" value={nroMotor} onChange={(e) => setNroMotor(e.target.value)} />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control rounded-pill" placeholder="Matricula" value={matricula} onChange={(e) => setMatricula(e.target.value)} />
                </div>
                <div className="mb-3">
                  <input type="number" className="form-control rounded-pill" placeholder="Capacidad" max="40" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
                </div>
                <div className="mb-3">
                  <select id="select-localidades" className="form-select rounded-pill" value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
                    <option value="" disabled selected>Localidad</option>
                  </select>
                </div>
              </div>
              <div class="d-grid gap-1">
                <button className="btn w50 btn-primary rounded-pill" onClick={registrarOmnibus}>Crear Omnibus</button>
                <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
              </div>
            </div>
          )}
          {!isIndividual && (
            <div id="alta-individual">
              <div className="mb-3">
                <p>Ingrese un archivo .CSV</p>
                <input type="file" accept=".csv" className="form-control rounded-pill" onChange={manejarArchivo} />
              </div>
              <p>Ejemplo del formato CSV</p>
              <div id="csv-ejemplo" className="mb-3">
                <p>Marca;Modelo;NroMotor;Matricula;Capacidad;Departamento;Localidad</p>
                <p>Scania;F510;AAAA1111;STU1111;20;MONTEVIDEO;Montevideo</p>
                <p>Volvo;V20;BBBBB2222;STU2222;20;CERRO LARGO;Melo</p>
              </div>
              <div class="d-grid gap-1">
                <button className="btn w50 btn-primary rounded-pill" onClick={altaOmnibusCsv} >Crear Omnibus</button>
                <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AltaOmnibus;