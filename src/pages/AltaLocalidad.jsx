import React from "react";
import "../css/AltaLocalidad.css";
import NavbarVendedor from "../components/NavbarVendedor";

function AltaLocalidad() {
  return (
    <>
    <NavbarVendedor/>
    <div className="altaLocalidad-bg">
      <div className="altaLocalidad-card card p-4 shadow-lg">
        
        <div className="mb-3">
            <select className="form-select rounded-pill" >
                <option value="" disabled selected>Departamento</option>
                <option value="Artigas">Artigas</option>
                <option value="Canelones">Canelones</option>
                <option value="Cerro Largo">Cerro Largo</option>
                <option value="Colonia">Colonia</option>
                <option value="Durazno">Durazno</option>
                <option value="Flores">Flores</option>
                <option value="Florida">Florida</option>
                <option value="Lavalleja">Lavalleja</option>
                <option value="Maldonado">Maldonado</option>
                <option value="Montevideo">Montevideo</option>
                <option value="Paysandú">Paysandú</option>
                <option value="Río Negro">Río Negro</option>
                <option value="Rivera">Rivera</option>
                <option value="Rocha">Rocha</option>
                <option value="Salto">Salto</option>
                <option value="San José">San José</option>
                <option value="Soriano">Soriano</option>
                <option value="Tacuarembó">Tacuarembó</option>
                <option value="Treinta y Tres">Treinta y Tres</option>
            </select>
        </div>
        <div className="mb-3">
          <input type="text" className="form-control rounded-pill" placeholder="Localidad" />
        </div>
        <div class="d-grid gap-2">
            <button className="btn w50 btn-primary rounded-pill">Crear Localidad</button>
            <button className="btn w50 btn-secondary rounded-pill">Cancelar</button>
        </div>
      </div>
    </div>
  </>
  );
}

export default AltaLocalidad;