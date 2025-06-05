import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from './pages/Login';
import Home from "./pages/Home";
import HomeCliente from "./pages/HomeCliente";
import HomeVendedor from "./pages/HomeVendedor";
import HomeAdministrador from "./pages/HomeAdministrador";
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

import { ViajeProvider } from "./context/ViajeContext";

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
              <Route path="/" element={<Home />} />
              <Route path="/homec" element={<HomeCliente />} />
              <Route path="/homev" element={<HomeVendedor />} />
              <Route path="/homea" element={<HomeAdministrador />} />
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
              <Route path="/listausuarios" element={<ListaUsuarios />} />
              <Route path="/listarpasajes" element={<ListadoPasajes />} />
              <Route path="/listaromnibus" element={<ListaOmnibus />} />
              <Route path="/compra" element={<CompraPasaje />} />
              <Route path="/bajausuario" element={<BajaUsuario />} />
              <Route path="/editarusuario" element={<EditarPerfil />} />
              <Route path="/cambiarpass" element={<CambiarPass />} />
              <Route path="/deshabilitacionomnibus" element={<DeshabilitarOmnibus />} />
            </Routes >
          </BrowserRouter >
        </div >
      </ViajeProvider>
    </>
  );
}

export default App;
