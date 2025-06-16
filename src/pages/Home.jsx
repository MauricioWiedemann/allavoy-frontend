import React, { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import NavbarAdministrador from "../components/NavbarAdministrador";
import NavbarVendedor from "../components/NavbarVendedor";
import NavbarCliente from "../components/NavbarCliente";

export default function Home() {

  const [payload, setPayload] = useState("");

  function validarTokenUsuario(){
    try {
      setPayload(jwtDecode(localStorage.getItem("token")));
      let payloadAux = jwtDecode(localStorage.getItem("token"));
      if (payloadAux.rol !== "ADMINISTRADOR" && payloadAux.rol !== "VENDEDOR" && payloadAux.rol !== "CLIENTE")
        window.location.href = "/404";
    } catch (e) {
      window.location.href = "/404";
    }
  }

  useEffect(() => {
    validarTokenUsuario();
  }, []);

  return (
    <>
      {payload.rol === "CLIENTE" && (<NavbarCliente />)}
      {payload.rol === "VENDEDOR" && (<NavbarVendedor />)}
      {payload.rol === "ADMINISTRADOR" && (<NavbarAdministrador />)}
    </>
  );
}
