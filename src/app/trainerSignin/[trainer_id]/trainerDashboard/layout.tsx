import React, { ReactNode } from 'react';
import Link from 'next/link';
import SideNav from "../../../../components/trainerSideNav";
import "../../../../styles/globals.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <SideNav />
      <div className="p-6 md:p-12">{children}</div>
    </div>
  );
};

export default Layout;




