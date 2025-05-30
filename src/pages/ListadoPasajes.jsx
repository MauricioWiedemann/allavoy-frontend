import React, {useEffect, useState} from "react";
import "../css/ListadoPasajes.css";
import NavbarVendedor from "../components/NavbarVendedor";
import Modal from "../components/Modal";

function ListadoPasajes() {

    const [listaViajes, setListaViajes] = useState([]);
    const [listaPasajesVendidos, setListaPasajesVendidos] = useState([]);
    const [listaPasajesDevuletos, setListaPasajesDevuletos] = useState([]);
    const [viajeSeleccionado, setViajeSeleccionado] = useState(null);

    const [open, setOpen] = useState(false);

    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");
    const [fecha, setFecha] = useState("");
    const [orden, setOrden] = useState("");

    async function cargarLocalidades() {
        //obtengo el componente donde va la lista de localidades
        const selectOrigen = document.getElementById("select-origen");
        const selectDestino = document.getElementById("select-destino");

        selectOrigen.innerHTML = "<option value='' disabled selected>Origen</option>";
        selectDestino.innerHTML = "<option value='' disabled selected>Destino</option>";

        //get para obtener el array con las localidades
        const localidadesArray =
            await fetch("http://localhost:8080/localidad/obtener", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(response => {
                return response.json();
            })
                .then(data => {
                    return data;
                })
            ;
        //generar los option que se insertara en el select con los datos de las localidades
        localidadesArray.forEach(element => {
            const optionOrigen = document.createElement("option");
            optionOrigen.value = element.idLocalidad;
            optionOrigen.textContent = element.nombre.concat(", ", element.departamento);
            selectOrigen.appendChild(optionOrigen);

            const optionDestino = document.createElement("option");
            optionDestino.value = element.idLocalidad;
            optionDestino.textContent = element.nombre.concat(", ", element.departamento);
            selectDestino.appendChild(optionDestino);
        });
    }

    async function obtenerViajes(){
        await fetch("http://localhost:8080/viaje/obtenertodos", {
        method: "GET",
        headers: {
        "Content-Type": "application/json"
        }
        }).then(response => {
        return response.json();
        })
        .then(data => {
        setListaViajes(data);
        })
        ;
    }

    function validar_datos() {
        if (origen.trim() === "" || destino.trim() === "" || fecha.trim() === "") {
            alert("Complete todos los campos.");
            return;
        }
        fetch("http://localhost:8080/viaje/buscar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                origen: origen,
                destino: destino,
                fecha: fecha + "T00:00:00",
                cantidad: 0
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se encontraron viajes.");

                }
                return response.json();
            })
            .then(data => {
                setListaViajes(data);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("No se encontraron viajes.");
                setListaViajes([]);
            });
    }

    function capitalizar(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    async function obtenerPasajesVendidos(){
        await fetch("http://localhost:8080/pasajes/obtenervendidos", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idViaje: viajeSeleccionado.idViaje
        })
        }).then(response => {
        return response.json();
        })
        .then(data => {
            console.log("1", data);
        setListaPasajesVendidos(data);
        })
        ;
    }

    async function obtenerPasajesDevueltos(){
        await fetch("http://localhost:8080/pasajes/obtenerdevueltos", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
            idViaje: viajeSeleccionado.idViaje
        })
        }).then(response => {
        return response.json();
        })
        .then(data => {
            console.log("2", data);
        setListaPasajesDevuletos(data);
        })
        ;
    }

    function swapCharacters(inputString) {
        let charArray = inputString.split('');
        charArray[10]= " ";
        return charArray.join('');
    }

    useEffect(() => {
        obtenerViajes();
        cargarLocalidades();
    },[]);

    useEffect(() => {
        obtenerPasajesVendidos();
        obtenerPasajesDevueltos();
    },[viajeSeleccionado]);

    const viajesOrdenados = [...listaViajes];
    if (orden === "precio")
        viajesOrdenados.sort((a, b) => a.precio - b.precio);
    else if (orden === "hora")
        viajesOrdenados.sort((a, b) => new Date(a.fechaSalida) - new Date(b.fechaSalida));

    return (
    <>
      <NavbarVendedor />
      <div className="listadoViaje-container">
        <div className="buscador-card card p-4 mt-3 mb-3 shadow-lg">
            <div className="campos-flex mb-3">
                <select className="form-select rounded-pill" id="select-origen" value={origen} onChange={(e) => setOrigen(e.target.value)}>
                    <option value="" disabled>Origen</option>
                </select>
                <select className="form-select rounded-pill" id="select-destino" value={destino} onChange={(e) => setDestino(e.target.value)}>
                    <option value="" disabled>Destino</option>
                </select>
                <input type="date" className="form-control rounded-pill" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                <button className="btn btn-primary rounded-pill" onClick={validar_datos}>Buscar</button>
            </div>
        </div>
        <div className="ordenar-container">
            <select className="form-select rounded-pill ordenar-select" value={orden} onChange={(e) => setOrden(e.target.value)} >
                <option value="" selected disabled>Ordenar por</option>
                <option value="precio">Precio</option>
                <option value="hora">Hora</option>
            </select>
        </div>
        <div className="viajes-list">
            {viajesOrdenados.map((viaje, index) => (
                <div key={index} className="viaje-card card p-4 shadow-lg">
                    <h5>{capitalizar(viaje.origen.nombre)}, {capitalizar(viaje.origen.departamento)} → {capitalizar(viaje.destino.nombre)}, {capitalizar(viaje.destino.departamento)}</h5>
                    <p>Fecha: {viaje.fechaSalida.split("T")[0]}            Hora: {viaje.fechaSalida.split("T")[1]}</p>
                    <p>Asientos Disponibles: {viaje.cantidad}</p>
                    <p>Precio: {viaje.precio}</p>
                    <button className="btn btn-primary btn-sm rounded-pill comprar-btn" onClick={() => { setViajeSeleccionado(viaje); setOpen(true); }}>Seleccionar</button>
                </div>
            ))}
        </div>
    </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        {viajeSeleccionado && listaPasajesVendidos.length>0 &&(
          <div className="modal-container">
            <div className="modal-body">
              <div className="mx-auto my-4 w-48 text-center">
                <h3 className="text-lg font-black text-gray-800">Pasajes Vendidos</h3>
                {listaPasajesVendidos.map((pasaje) => (
                <div id={pasaje.idPasaje} className="pasaje-frame col">
                    <p><strong>Cliente: </strong>{pasaje.emailCliente}</p>
                    <p><strong>Fecha de Compra: </strong>{swapCharacters(pasaje.fechaCompra)}</p>
                    <p><strong>Asiento: </strong>{pasaje.asiento}</p>
                    <p><strong>Precio: </strong>${pasaje.monto}</p>
                </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {viajeSeleccionado && listaPasajesDevuletos.length>0 &&(
          <div className="modal-container">
            <div className="modal-body">
              <div className="mx-auto w-48 text-center">
                <h3 className="text-lg font-black text-gray-800">Pasajes Devueltos</h3>
                {listaPasajesDevuletos.map((pasaje) => (
                <div id={pasaje.idPasaje} className="pasaje-frame">
                    <p><strong>Cliente: </strong>{pasaje.emailCliente}</p>
                    <p><strong>Fecha de Compra: </strong>{swapCharacters(pasaje.fechaCompra)}</p>
                    <p><strong>Fecha Devolucion: </strong>{swapCharacters(pasaje.fechaDevolucion)}</p>
                    <p><strong>Asiento: </strong>{pasaje.asiento}</p>
                    <p><strong>Precio: </strong>${pasaje.monto}</p>
                </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {viajeSeleccionado && listaPasajesVendidos==0 && listaPasajesDevuletos==0 &&(
          <div className="modal-container">
            <div className="modal-body">
              <div className="mx-auto my-4 w-48 text-center">
                <h3 className="text-lg font-black text-gray-800">No hay pasajes vendidos</h3>
              </div>
            </div>
          </div>
        )}
      </Modal>

    </>
    );
}

export default ListadoPasajes;