import React, { useState, useEffect } from "react";

export default function BuscadorPasajes() {
  const fondoStyle = {
    backgroundImage:
      'url("https://images.unsplash.com/photo-1444084316824-dc26d6657664?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const [form, setForm] = useState({
    origen: "",
    destino: "",
    fecha: "",
  });

  return (
    <div style={fondoStyle}>
      <div className="py-5" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
        <section className="container text-white pt-5">
          <h3 className="text-center mb-5 mt 3">¿A dónde querés ir?</h3>
          <form className="row g-3 justify-content-center">
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Origen</option>
                <option value="montevideo">Montevideo</option>
                <option value="punta">Punta del Este</option>
                <option value="colonia">Colonia</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select">
                <option value="">Destino</option>
                <option value="montevideo">Montevideo</option>
                <option value="punta">Punta del Este</option>
                <option value="colonia">Colonia</option>
              </select>
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-2">
              <button className="btn btn-primary w-100">
                Pagar
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
