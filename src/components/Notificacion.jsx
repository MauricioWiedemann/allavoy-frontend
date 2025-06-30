import React, { useEffect, useState } from "react";
import "../css/Notificacion.css";

export default function Notificacion({ mensaje, tipo, visible, onClose, duration = 3000 }) {
    const [fade, setFade] = useState(false);

    useEffect(() => {
        if (visible) {
            setFade(false);
            const timer = setTimeout(() => {
                setFade(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose]);

    if (!visible) return null;

    return (
        <div className={`alert-card alert-card-${tipo} ${fade ? "fade-out" : ""}`}>
            <span>{mensaje}</span>
            <button onClick={onClose} className="close-btn">X</button>
        </div>
    );
}
