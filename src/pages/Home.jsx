import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BuscadorPasajes from "../components/BuscadorPasajes";
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <Navbar />
      <BuscadorPasajes />

    <ul>
      <p>Temporal:</p>
      <li className="nav-item">
          <Link className="nav-link" to="/homec">Cliente</Link>
      </li>
      <li className="nav-item">
          <Link className="nav-link" to="/homev">Vendedor</Link>
      </li>
      <li className="nav-item">
          <Link className="nav-link" to="/homea">Administrador</Link>
      </li>
    </ul>

      <Footer />
    </div>
  );
}
