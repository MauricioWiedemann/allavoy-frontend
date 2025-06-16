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
    const [fechaDeshabilitado, setFechaDeshabilitado] = useState();

    useEffect(() => {
        fetch("http://localhost:8080/viaje/viajesdestino")
            .then(res => res.json())
            .then(data => setViajesDestino(data));

        fetch("http://localhost:8080/viaje/viajesorigen")
            .then(res => res.json())
            .then(data => setViajesOrigen(data));

        fetch("http://localhost:8080/pasajes/ventasfecha")
            .then(res => res.json())
            .then(data => setPasajesFecha(data));

        fetch("http://localhost:8080/pasajes/ventasdestino")
            .then(res => res.json())
            .then(data => setPasajesDestino(data));

        fetch("http://localhost:8080/pasajes/ocupacion")
            .then(res => res.json())
            .then(data => setOcupacionOmnibus(data));

        fetch("http://localhost:8080/pasajes/fechadeshabilitado")
            .then(res => res.json())
            .then(data => setFechaDeshabilitado(data));

        console.log(fechaDeshabilitado)

    }, []);

    /* const exportarPDF = () => {
        const input = document.getElementById("graficasParaExportar");
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
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
 */
    /*     const exportarCSV = () => {
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
        }; */

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
        datasets: [
            {
                label: 'Deshabilitados',
                data: fechaDeshabilitado,
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
                        <button >Exportar PDF</button>
                        <button >Exportar CSV</button>
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
