import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Sidebar />
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default AppLayout;
