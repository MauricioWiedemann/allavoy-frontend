import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from "./pages/Home";
import Registro from './pages/Registro';
import AltaLocalidad from "./pages/AltaLocalidad";
import AltaOmnibus from "./pages/AltaOmnibus";
import AltaViaje from "./pages/AltaViaje";
import CerrarSesion from "./pages/CerrarSesion";
import HomeVendedor from "./pages/HomeVendedor";

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
            <Route path="/login" element={<Login />} />
            <Route path="/cerrarsesion" element={<CerrarSesion />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/altalocalidad" element={<AltaLocalidad />} />
            <Route path="/altaomnibus" element={<AltaOmnibus />} />
            <Route path="/altaviaje" element={<AltaViaje />} />
            <Route path="/homev" element={<HomeVendedor />} />
          </Routes >
        </BrowserRouter >

      </div >
    </>
  );
}

export default App;
