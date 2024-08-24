import Header from '../components/Header';  // Ensure the correct path to Header
import Footer from '../components/Footer';  // Ensure the correct path to Footer
import Main from '../components/Main';      // Ensure the correct path to Main
import "../styles/globals.css";

export default function HomePage() {
  return (
    <div className='homepage-container'>
      <Header />  {/* Render the Header component */}
      <Main />    {/* Render the Main content component */}
      <Footer />  {/* Render the Footer component */}
    </div>
  );
}




