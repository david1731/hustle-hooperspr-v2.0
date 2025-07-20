import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";
import Services from "@/components/landing-page/services";
import Levels from "@/components/landing-page/levels";
import Mission from "@/components/landing-page/mission";
import Footer from "@/components/landing-page/footer";
import "../styles/globals.css";

export default function HomePage() {
  return (
    <div className='homepage-container'>
      <Header />  
      <Hero/> 
      <Services/>
      <Levels/>
      <Mission/>  
      <Footer />  
    </div>
  );
}




