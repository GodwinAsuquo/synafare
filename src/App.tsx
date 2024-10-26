import Pages from "./routes";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

function App() {
   useEffect(() => {
     AOS.init({
       duration: 1000,
       once: false,
     });
   }, []);
  return <Pages />;
}

export default App;
