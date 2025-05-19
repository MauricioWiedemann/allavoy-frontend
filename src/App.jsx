import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Home from "./pages/Home";
import Registro from './pages/Registro'


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
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </BrowserRouter>

      </div>
    </>
  );
}

export default App;
