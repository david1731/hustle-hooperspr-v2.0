import React from 'react';
import NavBar from "../components/NavBar"; // Ensure you have the NavBar component
import ServiceCard from '../components/ServiceCard';
import LevelCard from '../components/LevelCard';
import Image from 'next/image'; // Import the Image component from next/image

export default function Home() {
  return (
    <div>
      <NavBar /> {/* Add NavBar component here */}
      <div className="container mt-4 text-center">
        <Image src="/hustlehoopers.png" layout="responsive" width={200} height={200} alt="Main Image" /> {/* Use Image component */}
      </div>

      <div className="container mt-5" id="servicios">
        <h2 className="mb-3 display-1">Nuestros Servicios</h2>
        <div className="row">
          <ServiceCard
            image="/John-Wall-Jump-Shot.jpg"
            title="Práctica de Tiro"
            description="Enfoque en driles para el desarrollo y mejoramientos de destrezas de tiro."
          />
          <ServiceCard
            image="/basketball-dribble.webp"
            title="Manejo de Balón"
            description="Enfoque en driles para desarrollar o mejorar el manejo de balón."
          />
          <ServiceCard
            image="/how-to-shoot-a-basketball.jpg"
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



