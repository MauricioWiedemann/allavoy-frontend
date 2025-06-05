import React, { useState, useEffect } from "react";
import "../css/AltaOmnibus.css";
import NavbarVendedor from "../components/NavbarVendedor";

function AltaOmnibus() {

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [nroMotor, setNroMotor] = useState("");
  const [matricula, setMatricula] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [localidad, setLocalidad] = useState("");

  function validar_matricula(valor) {
    const regrex = /^[A-S]TU\d{4}$/;
    return regrex.test(valor);
  }

  function registrarOmnibus() {
    if (marca.trim() === "" || modelo.trim() === "" || nroMotor.trim() === "" || matricula.trim() === "" || capacidad.trim() === "" || localidad.trim() === "") {
      alert("Complete todos los campos.");
    } else if (!validar_matricula(matricula.toUpperCase())) {
      alert("La matricula no es válida.");
    } else {
      fetch("http://localhost:8080/omnibus/alta", {
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
          if (!response.ok) {
            throw new Error("Error al registrar omnibus");
          }
          return response.json();
        })
        .then(data => {
          console.log("Omnibus registrado:", data);
          alert("omnibus registrado");
        })
        .catch(error => {
          console.error("Error:", error);
          alert("Error al registrar el omnibus.");
        });
    }
  }

  async function cargarLocalidades() {
    //obtengo el componente donde va la lista de localidades
    const selectLocalidades = document.getElementById("select-localidades");
    //get para obtener el array con las localidades
    const localidadesArray =
      await fetch("http://localhost:8080/localidad/obtener", {
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
      option.textContent = element.nombre.concat(", ", element.departamento);
      selectLocalidades.appendChild(option);
    });
  }

  //cargar las localidades al cargar la pagina
  useEffect(() => {
    cargarLocalidades();
  }, []);

  return (
    <>
      <NavbarVendedor />
      <div className="altaViaje-bg">
        <div className="altaViaje-card card p-4 shadow-lg">

          <div className="mb-3">
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
              <input type="number" className="form-control rounded-pill" placeholder="Capacidad" value={capacidad} onChange={(e) => setCapacidad(e.target.value)} />
            </div>
            <div className="mb-3">
              <select id="select-localidades" className="form-select rounded-pill" value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
                <option value="" disabled selected>Localidad</option>
              </select>
            </div>
          </div>
          <div class="d-grid gap-2">
            <button className="btn w50 btn-primary rounded-pill" onClick={registrarOmnibus}>Crear Omnibus</button>
            <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/homev"} >Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AltaOmnibus;