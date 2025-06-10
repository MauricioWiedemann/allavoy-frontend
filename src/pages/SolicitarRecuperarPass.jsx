import React, {useState} from "react";
import "../css/SolicitarRecuperarPass.css"

function SolicitarRecuperarPass() {

    const [correo, setCorreo] = useState("");

    async function validarCorreo(){
        if(correo.trim() === ""){
            alert("Ingrese un correo.")
        } else {
            await fetch("http://localhost:8080/auth/recuperar-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                correo: correo
            })
            }).then(response => {
                if (!response.ok) {
                    throw new Error(response.text());
                }
                return response.text();
            }).then(data => {
                alert(data);
                window.location.href = "/login";
            })
            .catch(error => {
                alert(error);
            });
        }
    }

    return (
    <>
        <div className="cambiar-pass-bg">
        <div className="cambiar-pass-card card p-4 shadow-lg">
                <div className="mb-3">
                    <p>Ingrese su correo electronico:</p>
                    <input type="email" className="form-control rounded-pill" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)}/>
                </div>
                <div class="d-grid gap-1">
                    <button className="btn w50 btn-primary rounded-pill" onClick={validarCorreo} >Cambiar contraseña</button>
                    <button className="btn w50 btn-secondary rounded-pill" onClick={() => window.location.href = "/login"} >Cancelar</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default SolicitarRecuperarPass;