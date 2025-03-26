import { ReactNode } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';
import ScrollToTop from '../../utils/ScrollToTop';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <ScrollToTop />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default AppLayout;
