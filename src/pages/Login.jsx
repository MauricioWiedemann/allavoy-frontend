import React from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";

function Login() {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 login-body">
            <div className="login-card card p-4 shadow-lg">
                <div className="text-center mb-4">
                    <img src="../sources/logo.png" alt="Logo" className="img-fluid login-logo" />
                </div>
                <div className="mb-3">
                    <input type="email" className="form-control rounded-pill" placeholder="Correo" />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control rounded-pill" placeholder="Contraseña" />
                </div>
                <div className="mb-3 small">
                    <Link to="/forgot-password" className="text-primary text-decoration-none" style={{ cursor: "pointer" }}>
                        ¿Olvidó su contraseña?
                    </Link>
                </div>
                <button className="btn btn-primary w-100 rounded-pill mb-3">Ingresar</button>
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
