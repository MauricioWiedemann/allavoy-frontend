import React, {useEffect} from "react";
import NavbarCliente from "../components/NavbarCliente";
import { jwtDecode } from 'jwt-decode';

function HomeCliente() {

    function validarTokenUsuario(){
        try {
          let payload = jwtDecode(localStorage.getItem("token"));
          if (payload.rol !== "CLIENTE")
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
            <NavbarCliente />
        </>
    )
};

export default HomeCliente;