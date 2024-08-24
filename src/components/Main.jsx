export default function Main() {
    return (
      <section className="text-gray-600 body-font">
        <div className="max-w-5xl pt-52 pb-24 mx-auto">
          <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
            Create your next website fast and easy
          </h1>
          <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-11 text-gray-700 text-center">
            HustleHoopersPR es un servicio de entrenamientos
            <br />
            especializados e individualizados de baloncesto
          </h2>
          <div className="ml-6 text-center">
            <a
              className="inline-flex items-center py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-transparent bg-white px-7 text-md md:mt-0 hover:text-black hover:bg-white focus:shadow-outline"
              href="/"
            >
              <div className="flex text-lg">
                <span className="justify-center"></span>
              </div>
            </a>
            <a
              className="inline-flex items-center py-3 font-semibold tracking-tighter text-white transition duration-500 ease-in-out transform bg-transparent ml-11 bg-gradient-to-r from-blue-500 to-blue-800 px-14 text-md md:mt-0 focus:shadow-outline"
              href="/"
            >
              <div className="flex text-lg">
                <span className="justify-center">Contactanos</span>
              </div>
            </a>
          </div>
        </div>
        <div id="servicios" className="container flex flex-col items-center justify-center mx-auto">
          <img
            className="object-cover object-center w-3/4 mb-10 border shadow-md g327"
            alt="Placeholder Image"
            src="/hustlehoopers.png"
          ></img>
        </div>
        <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          Servicios
        </h2>
        <br></br>
        <p className="mx-auto text-xl text-center text-gray-300 font-normal leading-relaxed fs521 lg:w-2/3">
          Colección de los diferentes servicios que ofrecemos y trabajamos.
        </p>
        <div className="pt-12 pb-24 max-w-4xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            <img className="w-10" src="/John-Wall-Jump-Shot.jpg"></img>
            <h3 className="pt-3 font-semibold text-lg text-white">
              Práctica de Tiro
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Enfoque en driles para el desarrollo y mejoramientos de 
              destrezas de tiro.
            </p>
          </div>
          <div className="ktq4">
            <img className="w-10" src="/basketball-dribble.webp"></img>
            <h3 className="pt-3 font-semibold text-lg text-white">
              Manejo de Balón
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Enfoque en driles para desarrollar o mejorar el manejo de balón.
            </p>
          </div>
          <div className="ktq4">
            <img className="w-10" src="/how-to-shoot-a-basketball.jpg"></img>
            <h3 className="pt-3 font-semibold text-lg text-white">
              Entrenamiento General
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Entrenamiento en varios aspectos del baloncesto, así como Manejo de Balón 
              y Práctica de Tiros, entre otros.
            </p>
          </div>
        </div>
        <h2 id="niveles" className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
          Niveles
        </h2>
        <div  className="pt-32 pb-32 max-w-6xl mx-auto fsac4 md:px-1 px-3">
          <div className="ktq4">
            {/* <img src="https://nine4.app/images/nine4-3.png"></img> */}
            <h3 className="pt-3 font-semibold text-lg text-white">
              Nivel Principiante
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Entrenamientos para principiantes consiste de driles para desarrollar
              y fortalecer destrezas fundamentales..
            </p>
          </div>
          <div className="ktq4">
            {/* <img src="https://nine4.app/images/nine4-3.png"></img> */}
            <h3 className="pt-3 font-semibold text-lg text-white">
              Nivel Intermedio
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Entrenamientos para intermedios consisten de driles un poco más
              avanzados donde aplicarán destrezas fundamentales.
            </p>
          </div>
          <div className="ktq4">
            {/* <img src="https://nine4.app/images/nine4-3.png"></img> */}
            <h3 className="pt-3 font-semibold text-lg text-white">
              Nivel Avanzado
            </h3>
            <p className="pt-2 value-text text-md text-gray-200 fkrr1">
              Clientes que ya dominan los fundamentos, participarán en driles más complejos 
              que requieren alto nivel de destrezas para aplicarlas en situaciones de juego.
            </p>
          </div>
        </div>
        <div id="mision">
            <h2 className="pt-40 mb-1 text-2xl font-semibold tracking-tighter text-center text-gray-200 lg:text-7xl md:text-6xl">
                Nuestra Misión
            </h2>
            <div className="pt-32 pb-32 max-w-6xl mx-auto flex flex-col items-center"> {/* Modified here */}
                <div className="ktq4 max-w-xl">
                    <p className="pt-2 value-text text-md text-gray-200 fkrr1 text-center">
                        Nuestra misión es que el cliente se sienta en familia y llevar a nuestro Señor a través de nuestro servicio.
                        Mejorar su juego individual para que aporten en lo colectivo. Ser de ayuda a su disciplina tanto en los
                        entrenamientos como en la vida. ¡GRACIAS!
                    </p>
                </div>
            </div>
        </div>


      </section>
    );
  }