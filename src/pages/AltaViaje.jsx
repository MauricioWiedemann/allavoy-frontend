import React from "react";
import "../css/AltaViaje.css";
import NavbarVendedor from "../components/NavbarVendedor";
import OmnibusAltaVaije from "../components/omnibsuAltaViaje";

function AltaViaje() {
  return (
    <>
      <NavbarVendedor />
      <div className="altaViaje-bg">
        <div className="altaViaje-card card p-4 mt-3 mb-3 shadow-lg">

          <div className="mb-3">
            <h2 className="text-center mb-3">Salida</h2>
            <select className="form-select rounded-pill mb-3" >
              <option value="" disabled selected>Localidad</option>
              <option value="">Artigas</option>
            </select>
            <div className="mb-3">
              <input type="date" className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <input type="time" className="form-control rounded-pill" />
            </div>

            <h2 className="text-center mb-3">Llegada</h2>
            <select className="form-select rounded-pill mb-3" >
              <option value="" disabled selected>Localidad</option>
              <option value="">Montevideo</option>
            </select>
            <div className="mb-3">
              <input type="date" className="form-control rounded-pill" />
            </div>
            <div className="mb-3">
              <input type="time" className="form-control rounded-pill" />
            </div>
          </div>
          <div class="d-grid mb-3">
            <button className="btn w50 btn-primary rounded-pill" onClick={() => test()}>Buscar Omnibus</button>
          </div>
          <div id="omnibus-container-id" className="omnibus-container mb-3">
            <div className="row row-cols-2 mb-3">
              <OmnibusAltaVaije />
              <OmnibusAltaVaije />
              <OmnibusAltaVaije />
              <OmnibusAltaVaije />
              <OmnibusAltaVaije />
              <OmnibusAltaVaije />
            </div>
            <div className="mb-3">
              <input type="number" className="form-control rounded-pill" placeholder="precio" />
            </div>
          </div>
          <div id="crear-cancelar-btn" class="d-grid gap-2 mb-3">
            <button id="btn-crear" className="btn w50 btn-primary rounded-pill">Crear</button>
            <button id="btn-cancelar" className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/homev"} >Cancelar</button>
          </div>
        </div>
      </div>
    </>
  );
}

function test() {
  var x = document.getElementById("omnibus-container-id");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }

}

export default AltaViaje;