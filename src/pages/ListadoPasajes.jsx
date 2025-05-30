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
    },[]);

    useEffect(() => {
        obtenerPasajesVendidos();
        obtenerPasajesDevueltos();
    },[viajeSeleccionado]);

    return (
    <>
      <NavbarVendedor />
      <div className="listarPasajes-bg">
        <div className="listarPasajes-card card p-4 shadow-lg">
          <div className="space-y-4">
            {listaViajes.map((viaje) => (
              <div key={viaje.idViaje} className="flex justify-between items-center bg-light m-1 p-4 rounded border shadow-sm">
                <div className="listarPasajesContenido">
                  <p><strong>Salida:</strong> {swapCharacters(viaje.fechaSalida)}</p>
                  <p><strong>Llegada:</strong> {swapCharacters(viaje.fechaLlegada)}</p>
                </div>
                <div className="listarPasajesContenido">
                  <p><strong>Precio:</strong> ${viaje.precio}</p>
                  <p><strong>Ómnibus:</strong> {viaje.omnibus.matricula}</p>
                </div>
                <button
                  onClick={() => {
                    setViajeSeleccionado(viaje);
                    setOpen(true);
                  }}
                  className={`btn w50 btn-primary rounded-pill`}>
                    Seleccionar
                </button>
              </div>
            ))}
          </div>
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