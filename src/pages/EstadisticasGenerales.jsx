import React, { useState, useEffect } from "react";
import "../css/EstadisticasGenerales.css";
import NavbarVendedor from "../components/NavbarVendedor";
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, Title } from 'chart.js';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { jwtDecode } from 'jwt-decode';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, Title);

function EstadisticasGenerales() {
    const [viajesDestino, setViajesDestino] = useState([]);
    const [viajesOrigen, setViajesOrigen] = useState([]);
    const [pasajesFecha, setPasajesFecha] = useState([]);
    const [pasajesDestino, setPasajesDestino] = useState([]);
    const [ocupacionOmnibus, setOcupacionOmnibus] = useState([]);
    const [fechaDeshabilitado, setFechaDeshabilitado] = useState([]);

    const anio = new Date();
    anio.setFullYear(anio.getFullYear() - 1);
    const labelFecha = anio.toLocaleDateString("es-UY")

    useEffect(() => {
        fetch("https://allavoy-backend.onrender.com/viaje/viajesdestino")
            .then(res => res.json())
            .then(data => setViajesDestino(data));

        fetch("https://allavoy-backend.onrender.com/viaje/viajesorigen")
            .then(res => res.json())
            .then(data => setViajesOrigen(data));

        fetch("https://allavoy-backend.onrender.com/pasajes/ventasfecha")
            .then(res => res.json())
            .then(data => setPasajesFecha(data));

        fetch("https://allavoy-backend.onrender.com/pasajes/ventasdestino")
            .then(res => res.json())
            .then(data => setPasajesDestino(data));

        fetch("https://allavoy-backend.onrender.com/pasajes/ocupacion")
            .then(res => res.json())
            .then(data => setOcupacionOmnibus(data));

        fetch("https://allavoy-backend.onrender.com/omnibus/fechadeshabilitado")
            .then(res => res.json())
            .then(data => setFechaDeshabilitado(data));
    }, []);

    const exportarPDF = () => {
        const input = document.getElementById("graficasParaExportar");
        html2canvas(input, { scale: 3 }).then((canvas) => {
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
            pdf.save("estadisticas_generales.pdf");
        });
    };

    const exportarCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";

        // Viajes por Destino
        csvContent += "Destino,Cantidad de Viajes\n";
        viajesDestino.forEach(([destino, cantidad]) => {
            csvContent += `${destino}, ${cantidad}\n`;
        });
        csvContent += "\n";

        // Viajes por Origen
        csvContent += "Origen,Cantidad de Viajes\n";
        viajesOrigen.forEach(([origen, cantidad]) => {
            csvContent += `${origen}, ${cantidad}\n`;
        });
        csvContent += "\n";

        // Ventas por Fecha
        csvContent += "Fecha,Cantidad de Ventas\n";
        pasajesFecha.forEach(([fecha, cantidad]) => {
            csvContent += `${fecha}, ${cantidad}\n`;
        });
        csvContent += "\n";

        // Ventas por Destino
        csvContent += "Destino,Cantidad de Ventas\n";
        pasajesDestino.forEach(([destino, cantidad]) => {
            csvContent += `${destino}, ${cantidad}\n`;
        });
        csvContent += "\n";

        // Ocupación de Omnibus
        csvContent += "Omnibus,Cantidad de Pasajes\n";
        ocupacionOmnibus.forEach(([omnibus, cantidad]) => {
            csvContent += `${omnibus}, ${cantidad}\n`;
        });
        csvContent += "\n";

        // Deshabilitados por Fecha
        csvContent += "Fecha de Deshabilitación,Cantidad de Omnibus\n";
        csvContent += labelFecha + "-" + new Date().toLocaleDateString("es-UY") + ", " + fechaDeshabilitado + `\n`;
        csvContent += "\n";

        // Descargar CSV
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "estadisticas_generales.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const labels_destino = viajesDestino.map(item => item[0]);
    const valores_destino = viajesDestino.map(item => item[1]);
    const labels_origen = viajesOrigen.map(item => item[0]);
    const valores_origen = viajesOrigen.map(item => item[1]);
    const labels_fecha = pasajesFecha.map(item => item[0]);
    const valores_cantidad = pasajesFecha.map(item => item[1]);
    const labels_venta = pasajesDestino.map(item => item[0]);
    const valores_venta = pasajesDestino.map(item => item[1]);
    const labels_ocupacion = ocupacionOmnibus.map(item => item[0]);
    const valores_ocupacion = ocupacionOmnibus.map(item => item[1]);

    const viajes_destino = {
        labels: labels_destino,
        datasets: [
            {
                label: 'Viajes',
                data: valores_destino,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const viajes_origen = {
        labels: labels_origen,
        datasets: [
            {
                label: 'Viaje',
                data: valores_origen,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const pasajes_fecha = {
        labels: labels_fecha,
        datasets: [
            {
                label: 'Ventas',
                data: valores_cantidad,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const pasajes_destino = {
        labels: labels_venta,
        datasets: [
            {
                label: 'Ventas',
                data: valores_venta,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const ocupacion = {
        labels: labels_ocupacion,
        datasets: [
            {
                label: 'Ventas',
                data: valores_ocupacion,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

    const fecha_deshabilitada = {
        labels: [labelFecha + " - " + new Date().toLocaleDateString("es-UY")],
        datasets: [
            {
                label: 'Deshabilitados',
                data: [fechaDeshabilitado],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };

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
            <div className="layout">
                <div className="filtros">
                    <div className="buscador">
                        <button onClick={exportarPDF}>Exportar PDF</button>
                        <button onClick={exportarCSV}>Exportar CSV</button>
                    </div>
                </div>
                <div id="graficasParaExportar" className="graficas-contenedor">
                    <div className="grafica-item">
                        <Bar data={viajes_destino} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Viajes por Destino',
                                    font: {
                                        size: 15
                                    },
                                    color: '#333'
                                },
                                legend: {
                                    display: false,
                                    position: 'top'
                                }
                            }
                        }} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={viajes_origen} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Viajes por Origen',
                                    font: {
                                        size: 15
                                    },
                                    color: '#333'
                                },
                                legend: {
                                    display: false,
                                    position: 'top'
                                }
                            }
                        }} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={pasajes_fecha} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Ventas por fecha',
                                    font: {
                                        size: 15
                                    },
                                    color: '#333'
                                },
                                legend: {
                                    display: false,
                                    position: 'top'
                                }
                            }
                        }} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={pasajes_destino} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Ventas por destino',
                                    font: {
                                        size: 15
                                    },
                                    color: '#333'
                                },
                                legend: {
                                    display: false,
                                    position: 'top'
                                }
                            }
                        }} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={ocupacion} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Asientos ocupados',
                                    font: {
                                        size: 15
                                    },
                                    color: '#333'
                                },
                                legend: {
                                    display: false,
                                    position: 'top'
                                }
                            }
                        }} />
                    </div>
                    <div className="grafica-item">
                        <Bar data={fecha_deshabilitada} options={{
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        callback: (value) => Number.isInteger(value) ? value : null
                                    }
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Omnibus deshabilitados por fehca',
                                    font: {
                                        size: 15
                                    },
                                    color: '#333'
                                },
                                legend: {
                                    display: false,
                                    position: 'top'
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default EstadisticasGenerales;
