import React, { ReactNode } from 'react';
import Link from 'next/link';
import SideNav from "../../../../components/trainerSideNav";
import "../../../../styles/globals.css";
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col md:flex-row">
        <div className="w-full flex-none md:w-64">
          <SideNav />
        </div>
        <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
          {children}
        </div>
      </div>
  );
};



export default Layout;




