import React, { useState, useEffect } from "react";
import NavbarAdministrador from "../components/NavbarAdministrador";
import "../css/altausuario.css"
import Papa from 'papaparse';
import { jwtDecode } from 'jwt-decode';
import Notificaion from "../components/Notificacion";


function AltaUsuario() {

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [cedula, setCedula] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [password, setPassword] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState("");

  const [data, setData] = useState([]);
  const [isIndividual, setIsIndividual] = useState(true);

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

  function mostrarAlertaAdvertencia(m) {
    setAlertVisible(true);
    setMensaje(m);
    setTipo("alert")
  };

  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    Papa.parse(archivo, {
      headerd: true,
      complete: (resultados) => {
        setData(resultados.data);
      },
    });
  };

  function altaUsuariosCsv() {
    if (data.length > 0) {
      fetch("http://localhost:8080/usuario/altacsv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
        .then(response => {
          return response.text();
        }).then(data => {
          const resultado = data.match(/Se completaron (\d+)\/(\d+)/);
          const lineas = data.split("\n");
          const errores = lineas.filter(lineas => lineas.startsWith("Error"));

          if (resultado) {
            const completadas = parseInt(resultado[1]);
            const totales = parseInt(resultado[2]);

            if (completadas === totales)
              mostrarAlerta("Todas los usuarios se cargaron correctamente.");
            else if (completadas > 0) {
              let mesnaje = `Se cargaron ${completadas} de ${totales}.\n`;
              mesnaje += "\nErrores:\n" + errores.join("\n");
              mostrarAlertaAdvertencia(mesnaje);
            } else
              mostrarAlertaError("No se pudo cargar ningún usuario.");
          }
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
    } else {
      alert("Tiene que ingresar un archivo.")
    }
  };

  useEffect(() => {
    if (isIndividual) {
      var indi = document.getElementById("individual-select");
      indi.style.backgroundColor = "#d9d9d9";
      var csv = document.getElementById("csv-select");
      csv.style.backgroundColor = "#bdbdbd";
    } else {
      var indi = document.getElementById("individual-select");
      indi.style.backgroundColor = "#bdbdbd";
      var csv = document.getElementById("csv-select");
      csv.style.backgroundColor = "#d9d9d9";
    }
  }, [isIndividual]);

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

  function registrarUsuario() {

    if (email.trim() === "" || nombre.trim() === "" || apellido.trim() === "" || cedula.trim() === "" || fechaNacimiento.trim() === "" || password.trim() === "" || tipoUsuario.trim() === "") {
      mostrarAlertaError("Complete todos los campos.");
    } else if (!validate_ci(cedula)) {
      mostrarAlertaError("La cedula no es valida.");
    } else if (password.length < 8 || !/\d/.test(password)) {
      mostrarAlertaError("La contraseña debe tener al menos 8 caracteres e incluir al menos un numero.");
    } else if (new Date(fechaNacimiento) >= new Date()) {
      mostrarAlertaError("La fecha de nacimiento no puede ser mayor a hoy.");
    } else {
      fetch("http://localhost:8080/usuario/alta", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cedula: cedula,
          nombre: nombre,
          apellido: apellido,
          email: email,
          password: password,
          fechaNacimiento: fechaNacimiento,
          tipoDescuento: "NA",
          tipoUsuario: tipoUsuario
        })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Error al registrar usuario");
          }
          return response.json();
        })
        .then(data => {
          console.log("Usuario registrado:", data);
          mostrarAlerta("Usuario registrado");
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch(error => {
          console.error("Error:", error);
          mostrarAlertaError("Error al registrar el usuario.");
        });
    }
  }

  function validarTokenUsuario() {
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
      <div className="altausuario-bg">
        <Notificaion mensaje={mensaje} tipo={tipo} visible={alertVisible} onClose={() => setAlertVisible(false)} />
        <div className="altausuario-card card p-4 shadow-lg">
          <div class="row mb-4">
            <button id="individual-select" class="select-tipo-alta-usuario col-6 col-sm-3" onClick={() => setIsIndividual(true)}>Individual</button>
            <button id="csv-select" class="select-tipo-alta-usuario col-6 col-sm-3" onClick={() => setIsIndividual(false)}>CSV</button>
          </div>
          {isIndividual && (
            <div id="alta-individual">
              <div className="mb-3">
                <input type="email" className="form-control rounded-pill" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="text" className="form-control rounded-pill" placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="date" className="form-control rounded-pill" placeholder="Fecha de Nacimiento" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
              </div>
              <div className="mb-3">
                <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>

              <select className="form-select rounded-pill mb-3" value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                <option value="" disabled selected>Rol</option>
                <option value="VENDEDOR">Vendedor</option>
                <option value="ADMINISTRADOR">Administrador</option>
              </select>
              <div class="d-grid gap-1">
                <button className="btn btn-primary w-100 rounded-pill" onClick={registrarUsuario} >Crear Usuario</button>
                <button className="btn btn-secondary w-100 rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
              </div>
            </div>
          )}
          {!isIndividual && (
            <div id="alta-individual">
              <div className="mb-3">
                <p>Ingrese un archivo .CSV</p>
                <input type="file" accept=".csv" className="form-control rounded-pill" onChange={manejarArchivo} />
              </div>
              <p>Ejemplo del formato CSV</p>
              <div id="csv-ejemplo" className="mb-3">
                <p>CorreoElectronico;Nombre;Apellido;Cedula;FechaNacimiento;Contraseña;TipoDeUsuaurio</p>
                <p>cliente@allavoy.com;Cliente;Cliente;00000000;2000-01-21;abcd1234;CLIENTE</p>
                <p>vendedor@allavoy.com;Vendedor;Vendedor;00000000;2000-01-21;abcd1234;VENDEDOR</p>
              </div>
              <div class="d-grid gap-1">
                <button className="btn w50 btn-primary rounded-pill" onClick={altaUsuariosCsv} >Crear Usuarios</button>
                <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/home"} >Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AltaUsuario;