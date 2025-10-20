import React, { useState } from "react";
import "./Faq.styles.css";
import Navbar from "../../../components/Customer_components/Navbar/Navbar.component";

const faqs = [
  { 
    question: "¿Cuál es el horario de atención?", 
    answer: "Nuestro horario de atención es de lunes a viernes de 8:00 a 18:00 y sábados de 9:00 a 14:00."
  },
  { 
    question: "¿Cómo puedo hacer un pedido?", 
    answer: "Puedes hacer tu pedido directamente en nuestra página web seleccionando el producto y completando el formulario de compra."
  },
  { 
    question: "¿Hacen envíos nacionales?", 
    answer: "Sí, realizamos envíos a todo el país con seguimiento en tiempo real."
  },
  { 
    question: "¿Qué métodos de pago aceptan?", 
    answer: "Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias."
  },
  { 
    question: "¿Puedo devolver un producto?", 
    answer: "Sí, tienes 15 días hábiles para solicitar la devolución siguiendo nuestras políticas de garantía."
  },
  { 
    question: "¿Tienen soporte postventa?", 
    answer: "Sí, nuestro equipo de soporte está disponible para resolver cualquier inconveniente después de tu compra."
  },
  { 
    question: "¿Ofrecen descuentos por compras grandes?", 
    answer: "Sí, puedes contactarnos directamente para cotizaciones y descuentos especiales por volumen."
  },
  { 
    question: "¿Cómo me registro en su sitio?", 
    answer: "Haz clic en el botón 'Registrarse' en la parte superior, completa tus datos y confirma tu correo electrónico."
  },
  { 
    question: "¿Puedo cambiar mi dirección de envío?", 
    answer: "Sí, puedes modificar tu dirección en tu perfil antes de que el pedido sea enviado."
  },
  { 
    question: "¿Tienen tienda física?", 
    answer: "Sí, contamos con una tienda física en la ciudad principal. Consulta nuestra sección de contacto para la dirección exacta."
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="faq-container">
        <h1 className="faq-title">Preguntas Frecuentes</h1>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`faq-item ${openIndex === index ? "open" : ""}`} 
              onClick={() => toggleFaq(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-icon">{openIndex === index ? "-" : "+"}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
