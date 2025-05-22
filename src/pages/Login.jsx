import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function validar_usuario() {
        if (email.trim() === "" || password.trim() === "") {
            alert("Complete todos los campos.");
        } else {
            fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error al validar usuario");
                    }
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("tipoUsuario", data.usuario.tipoUsuario);

                    if (data.usuario.tipoUsuario === "CLIENTE")
                        window.location.href = "/homec";
                    else if (data.usuario.tipoUsuario === "VENDEDOR")
                        window.location.href = "/homev";
                    else
                        window.location.href = "/homea";

                })
                .catch(error => {
                    console.error("Error:", error);
                    alert("Email o contraseña incorrectos.");
                });
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 login-body">
            <div className="login-card card p-4 shadow-lg">
                <div className="text-center mb-4">
                    <img src="../sources/logo.png" alt="Logo" className="img-fluid login-logo" />
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control rounded-pill" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3 small">
                    <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ cursor: "pointer" }}>
                        ¿Olvidó su contraseña?
                    </Link>
                </div>
                <button className="btn btn-primary w-100 rounded-pill mb-3" onClick={validar_usuario}>Ingresar</button>
                <div className="text-center text-dark">
                    No tiene cuenta?{" "}
                    <Link to="/registro" className="text-primary fw-bold text-decoration-none" style={{ cursor: "pointer" }}>
                        Registrar Usuario
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
