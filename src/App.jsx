import { BrowserRouter, Routes, Route } from "react-router-dom";

import Raiz from "./pages/Raiz";
import Login from './pages/Login';
import Home from "./pages/Home";
import Registro from './pages/Registro';
import AltaLocalidad from "./pages/AltaLocalidad";
import AltaOmnibus from "./pages/AltaOmnibus";
import AltaViaje from "./pages/AltaViaje";
import CerrarSesion from "./pages/CerrarSesion";
import AltaUsuario from "./pages/AltaUsuario";
import ReasignarViaje from "./pages/ReasignarViaje";
import Buscar from "./pages/ListadoViaje";
import CierreVentaPasaje from "./pages/CierreVentaPasajes";
import ListadoPasajes from "./pages/ListadoPasajes";
import CompraPasaje from "./pages/CompraPasaje";
import BajaUsuario from "./pages/BajaDeUsuario";
import ListaOmnibus from "./pages/ListadoOmnibus";
import ListaUsuarios from "./pages/ListadoUsuarios";
import EditarPerfil from "./pages/EditarPerfil";
import CambiarPass from "./pages/CambiarPass";
import DeshabilitarOmnibus from "./pages/DeshabilitarOmnibus";
import HistoricoCompra from "./pages/HitoricoPasaje";
import RehabilitarOmnibus from "./pages/RehabilitarOmnibus";
import ListadoOmnibusAsignados from "./pages/ListadoOmnibusAsignados";
import Confirmacion from "./pages/Confirmacion";
import DevolucionPasaje from "./pages/DevolucionPasaje";
import ListadoViajeConPasaje from "./pages/ListadoViajeConPasaje";
import CompraPasajeIda from "./pages/CompraPasajeIda";
import BuscarVuelta from "./pages/ListadoViajeVuelta";
import CambiarLocalidad from "./pages/CambiarLocalidad";
import AplicarDescuento from "./pages/AplicarDescuentos";
import SolicitarRecuperarPass from "./pages/SolicitarRecuperarPass";
import RecuperarPass from "./pages/RecuperarPass";
import EstadisticasUsuario from "./pages/EstadisticasUsuario";
import BuscarCompra from "./pages/ListadoViajeCompra";
import NotFound from "./pages/NotFound";


import { ViajeProvider } from "./context/ViajeContext";
import { ImPriceTag } from "react-icons/im";

function App() {
  return (
    <>
      <ViajeProvider>
        <style>{`
          .Fondo {
            background-color: #f8f9fd
          }
        `}</style>
        <div className="Fondo">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Raiz />} />
              <Route path="/home" element={<Home />} /> 
              <Route path="/login" element={<Login />} />
              <Route path="/cerrarsesion" element={<CerrarSesion />} />
              <Route path="/registro" element={<Registro />} />
              <Route path="/altalocalidad" element={<AltaLocalidad />} />
              <Route path="/altaomnibus" element={<AltaOmnibus />} />
              <Route path="/altaviaje" element={<AltaViaje />} />
              <Route path="/altausuario" element={<AltaUsuario />} />
              <Route path="/reasignarviaje" element={<ReasignarViaje />} />
              <Route path="/cierreventa" element={<CierreVentaPasaje />} />
              <Route path="/buscar" element={<Buscar />} />
              <Route path="/buscarcomprar" element={<BuscarCompra />} />
              <Route path="/listausuarios" element={<ListaUsuarios />} />
              <Route path="/listarpasajes" element={<ListadoPasajes />} />
              <Route path="/listaromnibus" element={<ListaOmnibus />} />
              <Route path="/compra" element={<CompraPasaje />} />
              <Route path="/compraida" element={<CompraPasajeIda />} />
              <Route path="/buscarvuelta" element={<BuscarVuelta />} />
              <Route path="/bajausuario" element={<BajaUsuario />} />
              <Route path="/editarusuario" element={<EditarPerfil />} />
              <Route path="/cambiarpass" element={<CambiarPass />} />
              <Route path="/deshabilitacionomnibus" element={<DeshabilitarOmnibus />} />
              <Route path="/rehabilitacionomnibus" element={<RehabilitarOmnibus />} />
              <Route path="/historicocompra" element={<HistoricoCompra />} />
              <Route path="/omnibusasignados" element={<ListadoOmnibusAsignados />} />
              <Route path="/confirmacion" element={<Confirmacion />} />
              <Route path="/listadoviajeconpasaje" element={<ListadoViajeConPasaje />} />
              <Route path="/devolucionpasaje" element={<DevolucionPasaje />} />
              <Route path="/cambiarlocalidad" element={<CambiarLocalidad />} />
              <Route path="/aplicardescuento" element={<AplicarDescuento />} />
              <Route path="/solicitarrecuperarpass" element={<SolicitarRecuperarPass />} />
              <Route path="/recuperarpass" element={<RecuperarPass />} />
              <Route path="/estidisticausuario" element={<EstadisticasUsuario />} />
              <Route path="/404" element={<NotFound />} />
            </Routes >
          </BrowserRouter >
        </div >
      </ViajeProvider>
    </>
  );
}

export default App;
