import React from "react";
import "../css/AltaOmnibus.css";
import NavbarVendedor from "../components/NavbarVendedor";

function AltaOmnibus() {
  return (
    <>
    <NavbarVendedor/>
    <div className="altaViaje-bg">
      <div className="altaViaje-card card p-4 shadow-lg">
        
        <div className="mb-3">
            <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Marca" />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Modelo" />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Nro de Motor" />
            </div>
            <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Matricula" />
            </div>
            <div className="mb-3">
                <input type="number" className="form-control rounded-pill" placeholder="Capacidad" />
            </div>
            <select className="form-select rounded-pill" >
                <option value="" disabled selected>Localidad</option>
            </select>
        </div>
        <div class="d-grid gap-2">
            <button className="btn w50 btn-primary rounded-pill">Crear Omnibus</button>
            <button className="btn w50 btn-secondary rounded-pill">Cancelar</button>
        </div>
      </div>
    </div>
  </>
  );
}

export default AltaOmnibus;