import React from "react";
import Navbar from "../../../components/Customer_components/Navbar/Navbar.component";
import "./Home.styles.css";
import Background from "../../../assets/Background.png";
import Vestidos from "../../../assets/vestidos.png"; 
import Footer from "../../../components/Customer_components/Footer/Footer.component";

const Home = () => {
  return (
    <div>
      <Navbar />


      <header className="hero">
        <img 
          src={Background}
          alt="Hero" 
          className="hero-img"
        />
        <div className="hero-content">
          <h1>Bienvenido a SGA</h1>
          <p>Explora nuestros productos y encuentra lo que necesitas</p>
          <button className="hero-btn">Ver Catálogo</button>
        </div>
      </header>

      <main>

        <section className="section-center">
          <h2>Nuestra Esencia</h2>
          <p>En SGA, creemos que cada ocasión merece un estilo único. Nos especializamos en el alquiler de vestidos elegantes y modernos, ofreciendo una experiencia práctica y accesible para que brilles sin preocuparte por repetir atuendo o gastar de más. </p>
          <button className="section-btn">Ven y conocenos</button>
        </section>


            <section className="section-two">
            <div className="section-two-left">
                <img src={Vestidos} alt="Producto" />
            </div>
            <div className="section-two-right">
                <h2>Vestidos para Cada Estilo</h2>
                <p>
                En SGA entendemos que cada persona y cada ocasión es única. Por eso, contamos con una amplia variedad de vestidos: elegantes, casuales, de gala, coctel y temáticos. 
                </p>
                <button className="section-btn">Catalogo</button>
            </div>
        </section>


        <section className="section-map">
          <h2>Encuéntranos</h2>
          <h3>Estamos aquí para ti</h3>
            <div className="map-container">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.8931356737726!2d-74.07811932432388!3d4.613141342408958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99add8a25a65%3A0x66c4d42a1b508e8!2sPaisas%20Club%20(Llama%20ya%20y%20obt%C3%A9n%20un%20DESCUENTO)!5e0!3m2!1ses-419!2sco!4v1758489633651!5m2!1ses-419!2sco"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Paisas Club"
            ></iframe>
            </div>

        </section>

      </main>

      <Footer></Footer>
    </div>
  );
};

export default Home;
