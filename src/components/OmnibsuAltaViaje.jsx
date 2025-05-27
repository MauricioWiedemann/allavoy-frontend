import React, { useEffect } from "react";
import "../css/OmnibusAltaViaje.css";
import { useViajeContext } from "../context/ViajeContext";

export default function OmnibusAltaVaije({omnibus}) {

  const { guardarOmnibus, omnibusViaje } = useViajeContext();

  useEffect(() => {
        if (omnibus === omnibusViaje.omnibus){
          document.getElementById(omnibus.idOmnibus).style.backgroundColor = "rgb(240, 255, 255)";
          document.getElementById(omnibus.idOmnibus).style.border = "2px solid #bbe4ff";
        } else {
          document.getElementById(omnibus.idOmnibus).style.backgroundColor = "white";
          document.getElementById(omnibus.idOmnibus).style.border = "2px solid #cccccc";
        }
    }, [omnibusViaje])

  return (
    <button id={omnibus.idOmnibus} className="omnibus-alta col" onClick={() => guardarOmnibus({omnibus})}>
              <p>{omnibus.marca}, {omnibus.modelo}</p>
              <p>Matricula: {omnibus.matricula}</p>
              <p>Cantidad de asiento: {omnibus.capacidad}</p>
    </button>
  );
}