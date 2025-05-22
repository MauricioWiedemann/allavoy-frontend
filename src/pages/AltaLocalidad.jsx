import React, {useState} from "react";
import "../css/AltaLocalidad.css";
import NavbarVendedor from "../components/NavbarVendedor";

function AltaLocalidad() {

  const [departamento, setDepartamento] = useState("");
  const [nombre, setNombre] = useState("");

  function registrarLocalidad() {

    if (departamento.trim() === "" || nombre.trim() === "") {
      alert("Complete todos los campos.");
    } else {
      fetch("http://localhost:8080/localidad/alta", {
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
          if (!response.ok) {
            throw new Error("Error al registrar el departamento");
          }
          return response.json();
        })
        .then(data => {
          console.log("Departamento registrado:", data);
          alert("Departamento registrado");
        })
        .catch(error => {
          console.error("Error:", error);
          alert("Error al registrar el departamento.");
        });
    }
  }

  return (
    <>
    <NavbarVendedor/>
    <div className="altaLocalidad-bg">
      <div className="altaLocalidad-card card p-4 shadow-lg">
        
        <div className="mb-3">
            <select className="form-select rounded-pill" value={departamento} onChange={(e) => setDepartamento(e.target.value)}>
                <option value="" disabled selected>Departamento</option>
                <option value="ARTIGAS">Artigas</option>
                <option value="CANELONES">Canelones</option>
                <option value="CERRO LARGO">Cerro Largo</option>
                <option value="COLONIA">Colonia</option>
                <option value="DURAZNO">Durazno</option>
                <option value="FLORES">Flores</option>
                <option value="FLORIDA">Florida</option>
                <option value="LAVALLEJA">Lavalleja</option>
                <option value="MALDONADO">Maldonado</option>
                <option value="MONTEVIDEO">Montevideo</option>
                <option value="PAYSANDU">Paysandú</option>
                <option value="RIO NEGRO">Río Negro</option>
                <option value="RIVERA">Rivera</option>
                <option value="RROCHA">Rocha</option>
                <option value="SALTO">Salto</option>
                <option value="SAN JOSE">San José</option>
                <option value="SORIANO">Soriano</option>
                <option value="TACUAREMBO">Tacuarembó</option>
                <option value="TREINTA Y TRES">Treinta y Tres</option>
            </select>
        </div>
        <div className="mb-3">
          <input type="text" className="form-control rounded-pill" placeholder="Localidad" value={nombre} onChange={(e) => setNombre(e.target.value)}/>
        </div>
        <div class="d-grid gap-2">
            <button className="btn w50 btn-primary rounded-pill" onClick={registrarLocalidad} >Crear Localidad</button>
            <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/homev"} >Cancelar</button>
        </div>
      </div>
    </div>
  </>
  );
}

export default AltaLocalidad;