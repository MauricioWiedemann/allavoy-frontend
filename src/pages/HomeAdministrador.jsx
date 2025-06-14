import React, {useEffect} from "react";
import NavbarAdministrador from "../components/NavbarAdministrador";
import { jwtDecode } from 'jwt-decode';

function HomeAdministrador() {
    
    function validarTokenUsuario(){
        try {
          let payload = jwtDecode(localStorage.getItem("token"));
          if (payload.rol !== "ADMINISTRADOR")
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
            <NavbarAdministrador />
        </>
    )
};

export default HomeAdministrador;