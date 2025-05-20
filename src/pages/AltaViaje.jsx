import React from "react";
import "../css/AltaViaje.css";
import NavbarVendedor from "../components/NavbarVendedor";

function AltaViaje() {
  return (
    <>
    <NavbarVendedor/>
    <div className="altaViaje-bg">
      <div className="altaViaje-card card p-4 shadow-lg">
        
        <div className="mb-3">
          <h2 className="text-center mb-3">Salida</h2>
            <select className="form-select rounded-pill mb-3" >
                <option value="" disabled selected>Localidad</option>
            </select>
            <div className="mb-3">
                <input type="date" className="form-control rounded-pill"/>
            </div>
            <div className="mb-3">
                <input type="time" className="form-control rounded-pill"/>
            </div>

            <h2 className="text-center mb-3">Llegada</h2>
            <select className="form-select rounded-pill mb-3" >
                <option value="" disabled selected>Localidad</option>
            </select>
            <div className="mb-3">
                <input type="date" className="form-control rounded-pill"/>
            </div>
            <div className="mb-3">
                <input type="time" className="form-control rounded-pill"/>
            </div>
        </div>
        <div class="d-grid gap-2">
            <button className="btn w50 btn-primary rounded-pill">Buscar Omnibus</button>
            <button className="btn w50 btn-secondary rounded-pill">Cancelar</button>
        </div>
      </div>
    </div>
  </>
  );
}

export default AltaViaje;