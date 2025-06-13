import React, {useEffect} from "react";
import NavbarVendedor from "../components/NavbarVendedor";
import { jwtDecode } from 'jwt-decode';

function HomeVendedor() {

    function validarTokenUsuario(){
        try {
          let payload = jwtDecode(localStorage.getItem("token"));
          if (payload.rol !== "VENDEDOR")
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
            <NavbarVendedor />
        </>
    )
};

export default HomeVendedor;