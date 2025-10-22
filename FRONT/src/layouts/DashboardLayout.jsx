import React from 'react';
import { Outlet } from 'react-router-dom';
import NavbarSeller from '../components/Seller_components/Navbar_Seller/Navbar_seller.component';
import { useBlockNavigation } from '../hooks/useBlockNavigation';

const DashboardLayout = () => {
  useBlockNavigation();

  return (
    <div className="dashboard-layout">
      <NavbarSeller />
      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
