import React, {useState, useEffect} from "react";
import "../css/SolicitarRecuperarPass.css"

function RecuperarPass() {

    const [passwordNuevo, setPasswordNuevo] = useState("");
    const [passwordNuevoConf, setPasswordNuevoConf] = useState("");
    const [token, setToken] = useState("");

    async function validarNuevoPass(){
        if(passwordNuevo.trim() === "" || passwordNuevoConf.trim() === ""){
            alert("Complete todos los campos.");
        } else if (passwordNuevo.trim() !== passwordNuevoConf.trim()) {
            alert("Las contraseñas no coinciden.");
        } else {
            await fetch("http://localhost:8080/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                token: token,
                nuevaPass: passwordNuevo
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

    useEffect(() => {
        //obtener token para reestablecer la password
        let params = new URLSearchParams(location.search);
        setToken(params.get('token'));
    }, []);

    return (
    <>
        <div className="cambiar-pass-bg">
        <div className="cambiar-pass-card card p-4 shadow-lg">
                <div className="mb-3">
                    <p>Ingrese su nueva contraseña:</p>
                    <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={passwordNuevo} onChange={(e) => setPasswordNuevo(e.target.value)}/>
                </div>
                <div className="mb-3">
                    <p>Ingrese la contraseña nuevamente:</p>
                    <input type="password" className="form-control rounded-pill" placeholder="Contraseña" value={passwordNuevoConf} onChange={(e) => setPasswordNuevoConf(e.target.value)}/>
                </div>
                <div class="d-grid gap-1">
                    <button className="btn w50 btn-primary rounded-pill" onClick={validarNuevoPass} >Cambiar contraseña</button>
                </div>
            </div>
        </div>
    </>
    );
}

export default RecuperarPass;