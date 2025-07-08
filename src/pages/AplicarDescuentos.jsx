import React, { useState, useEffect } from "react";
import "../css/AplicarDescuentos.css";
import NavbarVendedor from "../components/NavbarVendedor";
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";
import { BASE_URL } from "../config";


function AplicarDescuento() {

  const [showAviso, setShowAviso] = useState(false);

  const [cedula, setCedula] = useState("");
  const [tipoDescuento, setTipoDescuento] = useState("");
  const [usuario, setUsuario] = useState("");

  const [alertVisible, setAlertVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("");

  function mostrarAlerta(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("mensaje")
  };

  function mostrarAlertaError(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("error")
  };

  function validation_digit(ci) {
    var a = 0;
    var i = 0;
    if (ci.length <= 6) {
      for (i = ci.length; i < 7; i++) {
        ci = '0' + ci;
      }
    }
    for (i = 0; i < 7; i++) {
      a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
    }
    if (a % 10 === 0) {
      return 0;
    } else {
      return 10 - a % 10;
    }
  }

  function clean_ci(ci) {
    return ci.replace(/\D/g, '');
  }

  function validate_ci(ci) {
    ci = clean_ci(ci);
    var dig = ci[ci.length - 1];
    ci = ci.replace(/[0-9]$/, '');
    return (dig == validation_digit(ci));
  }

  async function validarCedula() {
    if (cedula.trim() === "") {
      mostrarAlertaError("Ingrese una cedula.")
    } else if (!validate_ci(cedula)) {
      mostrarAlertaError("La cedula no es valida.");
    } else {
      await fetch(`${BASE_URL}/usuario/buscarporci`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cedula: clean_ci(cedula)
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error("El usuario no existe.");
        }
        return response.json();
      })
        .then(data => {
          setTipoDescuento(data.tipoDescuento);
          setUsuario(data);
          setShowAviso(true);
        })
        .catch(error => {
          mostrarAlertaError("El usuario no existe.");
        });
      ;
    }
  }

  async function validarDescuanto() {
    console.log(usuario);
    if (tipoDescuento.trim() === "") {
      alert("Tiene que ingreser un tipo de descuanto.");
    } else {
      await fetch(`${BASE_URL}/usuario/asignarDescuento`, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          idUsuario: usuario.idUsuario,
          //nombre: usuario.nombre, // NO es necesario enviar esto al backend solo necesita el tipoDescuento y el idUsuario
          //apellido: usuario.apellido,
          tipoDescuento: tipoDescuento
        })
      }).then(response => {
        if (!response.ok) {
          throw new Error(response.text());
        }
        return response.text();
      }).then(data => {
        mostrarAlerta(data);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
        .catch(error => {
          mostrarAlertaError(error);
        });
    }
  }

  function validarTokenUsuario() {
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
      <div className="aplicarDescuento-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="aplicarDescuento-card card p-4 shadow-lg">
          {!showAviso && (
            <div className="row mb-4">
              <p>Ingrese la CI del cliente: </p>
              <input id="inputCedual" type="text" className="form-control rounded-pill mb-3" placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
              <button className="btn btn-primary" onClick={validarCedula}>Buscar usuario</button>
            </div>
          )}
          {showAviso && (
            <div className="row mb-1">
              <div id="aviso">
                <p>Solicite documentos al cliente que avalen el descuento solicitado, estos pueden ser: certificado de estudiante, recibo de jubilación, recibo de sueldo que indique puesto laboral como funcionario del estado.</p>
              </div>
              <p className="mt-3">Seleccionae el tipo de descuento: </p>
              <select className="form-select rounded-pill mb-1" value={tipoDescuento} onChange={(e) => setTipoDescuento(e.target.value)}>
                <option value="" disabled selected>Tipo de Descuento</option>
                <option value="ESTUDIANTE">Estudiante</option>
                <option value="JUBILADO">Jubilado</option>
                <option value="FUNCIONARIO">Funcionario</option>
                <option value="NA">Sin descuentos</option>
              </select>
              <button className="btn btn-primary mt-3" onClick={validarDescuanto}>Confirmar</button>
              <button className="btn btn-secondary mt-2 mb-2" onClick={() => window.location.reload()}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AplicarDescuento;