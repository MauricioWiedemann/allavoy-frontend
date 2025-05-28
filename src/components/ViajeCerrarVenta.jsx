import React, { useEffect, useState } from "react";
import "../css/ViajeCierreVenta.css";
import { useViajeContext } from "../context/ViajeContext";

export default function ViajeCerrarVenta({viaje}) {

  const { guardarViajeCerraVenta, viajeCerrarVenta } = useViajeContext();

  function swapCharacters(inputString) {
    let charArray = inputString.split('');
    charArray[10]= " ";
    return charArray.join('');
  }

  useEffect(() => {
        if (viaje === viajeCerrarVenta.viaje){
          document.getElementById(viaje.idViaje).style.backgroundColor = "rgb(240, 255, 255)";
          document.getElementById(viaje.idViaje).style.border = "2px solid #bbe4ff";
        } else {
          document.getElementById(viaje.idViaje).style.backgroundColor = "white";
          document.getElementById(viaje.idViaje).style.border = "2px solid #cccccc";
        }
    }, [viajeCerrarVenta])

    return (
    <button id={viaje.idViaje} className="viaje-cierre" onClick={() => guardarViajeCerraVenta({viaje})}>
              <p>Origen: {viaje.origen.nombre}, {viaje.origen.departamento} - {swapCharacters(viaje.fechaSalida)}</p>
              <p>Destino: {viaje.destino.nombre}, {viaje.destino.nombre} - {swapCharacters(viaje.fechaLlegada)}</p>
              <p>Omnibus: {viaje.omnibus.matricula}</p>
              <p>Asientos: {viaje.omnibus.capacidad}</p>
              <p>Precio: ${viaje.precio}</p>
    </button>
  );
}