import React, { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export default function Raiz() {

  function validarTokenUsuario(){
    try {
      let payload = jwtDecode(localStorage.getItem("token"));
      if (payload.rol === "CLIENTE")
        window.location.href = "/homec";
      else if (payload.rol === "VENDEDOR")
        window.location.href = "/homev";
      else
        window.location.href = "/homea";
    } catch (e) {
      window.location.href = "/login";
    }
  }

  useEffect(() => {
    validarTokenUsuario();
  }, []);

  return (
    <></>
  );
}
