import React, { useState, useEffect } from "react";
import "../css/EstadisticasUsuario.css";
import NavbarAdmin from "../components/NavbarAdministrador";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { jwtDecode } from 'jwt-decode';
import { BASE_URL } from "../config";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

function EstadisticasUsuario() {
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [activos, setActivos] = useState(0);
    const [inactivos, setInactivos] = useState(0);
    const [pasajesPorTipo, setPasajesPorTipo] = useState({});

    useEffect(() => {
        fetch(`${BASE_URL}/usuario/total`)
            .then(res => res.json())
            .then(data => setTotalUsuarios(data));

        fetch(`${BASE_URL}/usuario/activos`)
            .then(res => res.json())
            .then(data => {
                setActivos(data.activos);
                setInactivos(data.inactivos);
            });

        fetch(`${BASE_URL}/usuario/pasajestipousuario`)
            .then(res => res.json())
            .then(data => setPasajesPorTipo(data))
            .catch(error => console.error("Error al obtener pasajes por tipo", error));

    }, []);

    const exportarPDF = () => {
        const input = document.getElementById("graficasParaExportar");
        html2canvas(input, { scale: 4 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("estadisticas_usuarios.pdf");
        });
    };

    const exportarCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";

        csvContent += "Total Usuarios\n";
        csvContent += `Usuarios Registrados,${totalUsuarios}\n\n`;

        csvContent += "Estado,Total\n";
        csvContent += `Activos,${activos}\n`;
        csvContent += `Inactivos,${inactivos}\n\n`;

        csvContent += "Tipo de Pasaje,Pasajes Vendidos\n";
        Object.entries(pasajesPorTipo).forEach(([tipo, cantidad]) => {
            csvContent += `${tipo},${cantidad}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_usuarios.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const datosActivosInactivos = {
        labels: ["Activos", "Inactivos"],
        datasets: [{
            data: [activos, inactivos],
            backgroundColor: ["#36A2EB", "#f1948a"]
        }]
    };

    const datosTotalUsuarios = {
        labels: ["Total Usuarios"],
        datasets: [{
            label: "Usuarios Registrados",
            data: [totalUsuarios],
            backgroundColor: "#73c6b6"
        }]
    };

    const labelsPasajes = Object.keys(pasajesPorTipo);
    const valoresPasajes = Object.values(pasajesPorTipo);

    const datosPasajesBar = {
        labels: labelsPasajes,
        datasets: [{
            label: "Pasajes vendidos",
            data: valoresPasajes,
            backgroundColor: ["#f7dc6f", "#af7ac5"]
        }]
    };
    const datosPasajesPie = {
        labels: labelsPasajes,
        datasets: [{
            data: valoresPasajes,
            backgroundColor: ["#f7dc6f", "#af7ac5"]
        }]
    };

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
            <NavbarAdmin />
            <div className="layout">
                <div className="filtros">
                    <div className="buscador">
                        <button onClick={exportarPDF}>Exportar PDF</button>
                        <button onClick={exportarCSV}>Exportar CSV</button>
                    </div>
                </div>
                <div id="graficasParaExportar" className="graficas-contenedor">
                    <div className="grafica-item">
                        <Pie data={datosActivosInactivos} />
                    </div>
                    <div className="grafica-item">
                        <Pie data={datosPasajesPie} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={datosTotalUsuarios} options={{
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: { legend: { display: false } }
                        }} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={datosPasajesBar} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: { legend: { display: false } }
                        }} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default EstadisticasUsuario;
