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
import ListadoViajes from "./pages/ListadoViajes"
import CompraPasaje from "./pages/CompraPasaje"
import DevolucionPasaje from "./pages/DevolucionPasaje"

function App() {
  return (
    <>
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
            <Route path="/listadoviajes" element={<ListadoViajes />} />
            <Route path="/comprar/:id" element={<CompraPasaje />} />
            <Route path="/devolucion/:id" element={<DevolucionPasaje />} />
          </Routes >
        </BrowserRouter >

      </div >
    </>
  );
}

export default App;
