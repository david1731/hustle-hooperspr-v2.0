import React from 'react';
import NavBar from "../components/NavBar"; // Ensure you have the NavBar component
import ServiceCard from '../components/ServiceCard';
import LevelCard from '../components/LevelCard';
import "bootstrap/dist/css/bootstrap.min.css";


const Home = () => {
  return (
    <div>
      <NavBar /> {/* Add NavBar component here */}
      <div className="container mt-4 text-center">
        <img src="/hustlehoopers.png" className="img-fluid" alt="Main Image" />
      </div>

      <div className="container mt-5" id="servicios">
        <h2 className="mb-3 display-1">Nuestros Servicios</h2>
        <div className="row">
          <ServiceCard
            image="https://www.stack.com/wp-content/uploads/2012/07/John-Wall-Jump-Shot-629x479.jpg"
            title="Práctica de Tiro"
            description="Enfoque en driles para el desarrollo y mejoramientos de destrezas de tiro."
          />
          <ServiceCard
            image="https://www.blazepod.com/cdn/shop/articles/BP_Article_Basketball_10_Better_Handles_960x585_71143f85-075f-49e8-94f0-9eab1e517844_1024x.jpg?v=1654091123"
            title="Manejo de Balón"
            description="Enfoque en driles para desarrollar o mejorar el manejo de balón."
          />
          <ServiceCard
            image="https://rrspin.com/images/sports/basketball/how-to-shoot-a-basketball.jpg"
            title="Entrenamiento General"
            description="Entrenamiento en varios aspectos del baloncesto, así como Manejo de Balón y Práctica de Tiros, entre otros."
          />
        </div>
      </div>

      <div className="container mt-5">
        <h2 className="mb-3 display-1">Niveles de Servicios</h2>
        <div className="row">
          <LevelCard
            title="Nivel Principiante"
            description="Entrenamientos para principiantes consiste de driles para desarrollar y fortalecer destrezas fundamentales."
          />
          <LevelCard
            title="Nivel Intermedio"
            description="Entrenamientos para intermedios consisten de driles un poco más avanzados donde aplicarán destrezas fundamentales."
          />
          <LevelCard
            title="Nivel Avanzado"
            description="Clientes que ya dominan los fundamentos, participarán en driles más complejos que requieren alto nivel de destrezas para aplicarlas en situaciones de juego."
          />
        </div>
      </div>

      <div className="container mt-5" id="info">
        <h2 className="mb-3 display-1">Conócenos</h2>
        <p className="lead">
          Saludos , bienvenid@ a la familia de Hustle Hoopers. Trabajamos y desarrollamos habilidades,
          fundamentos básicos del baloncesto para llevar tu juego al próximo nivel. Siéntase cómodo de entrenar con nosotros.
        </p>
      </div>

      <div className="container mt-5">
        <h2 className="mb-3 display-1">Nuestra Misión</h2>
        <p className="lead">
          Nuestra misión es que el cliente se sienta en familia y llevar a nuestro Señor a través de nuestro servicio.
          Mejorar su juego individual para que aporten en lo colectivo. Ser de ayuda a su disciplina tanto en los
          entrenamientos como en la vida. ¡GRACIAS!
        </p>
      </div>
    </div>
  );
};

export default Home;

