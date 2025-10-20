import React from "react";
import "./Catalog.styles.css";
import Navbar from "../../../components/Customer_components/Navbar/Navbar.component";
import VestidosHombre from "../../../assets/VestidosHombre.png"
import VestidosMujer from "../../../assets/VestidosMujer.png"
import VestidosParaNiños from "../../../assets/VestimentaParaNiños.png"
import Accesorios from "../../../assets/Accesorios.png"
import Footer from "../../../components/Customer_components/Footer/Footer.component";


const products = [
  {
    id: 1,
    name: "Vestimenta para caballero",
    description: "Para todo tipo de hombre macho pecho peludo",
    price: "$120",
    image: VestidosHombre
  },
  {
    id: 2,
    name: "Vestimenta para Dama",
    description: "Para todo tipo de cocinas, es broma para todo tipo de cielo por que cada una de ustedes es una estrella",
    price: "$150",
    image: VestidosMujer
  },
  {
    id: 3,
    name: "Vestimenta para todas las edades",
    description: "Para todas las edades, desde niños hasta gente mayor",
    price: "$180",
    image: VestidosParaNiños
  },
  {
    id: 4,
    name: "Accesorios para todo tipo de vestimenta",
    description: "Desde la cubana mas bandida hasta la mas barata",
    price: "$200",
    image: Accesorios
  },
];

export default function Catalog() {
  return (
    <>
      <Navbar />
      <div className="catalog-container">
        <h1 className="catalog-title">Nuestros Productos</h1>
        <div className="products-column">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`product-row ${index % 2 === 0 ? "normal" : "reverse"}`}
            >
              <div className="product-info">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <span className="product-price">{product.price}</span>
              </div>
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer></Footer>
    </>
  );
}
