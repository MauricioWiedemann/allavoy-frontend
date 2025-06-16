import React, { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

export default function Raiz() {

  function validarTokenUsuario(){
    try {
      let payload = jwtDecode(localStorage.getItem("token"));
      window.location.href = "/home";
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
