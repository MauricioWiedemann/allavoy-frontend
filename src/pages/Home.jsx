import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BuscadorPasajes from "../components/BuscadorPasajes";

export default function Home() {
  return (
    <div>
      <Navbar />
      <BuscadorPasajes />
      <Footer />
    </div>
  );
}
