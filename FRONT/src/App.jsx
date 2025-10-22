import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import HomePage from "./pages/Customer_view/Home_page/Home.page";
import SignIn from "./pages/Customer_view/Sign-in/Sign-in.page";
import DashboardLayout from "./layouts/DashboardLayout";
import HomeSeller from "./pages/Seller_view/Home_Seller/Home_Seller.component";
import NewRent from "./pages/Seller_view/New_rent/New_rent.component";
import NewClient from "./pages/Seller_view/New_client/New_client.component";
import NewOrder from "./pages/Seller_view/New_order/New_order.component";
import Inventory from "./pages/Seller_view/Inventory/inventory.component";
import Orders from "./pages/Seller_view/Orders/orders.component";
import Clients from "./pages/Customer_view/Clients/Clients.component";
import Catalog from "./pages/Customer_view/Catalog/catalog.component";
import Faq from "./pages/Customer_view/Faq/Faq.component";
import WhatsappButton from "./components/Customer_components/Whatsapp_icon/whatsapp.component";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return <AppContent />;
}

function AppContent() {
  const location = useLocation();
  const isSellerRoute = location.pathname.startsWith("/home-seller");

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/sign-in" element={<SignIn />} />

        <Route
          path="/home-seller"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<HomeSeller />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="new-rent" element={<NewRent />} />
          <Route path="new-client" element={<NewClient />} />
          <Route path="new-order" element={<NewOrder />} />
          <Route path="orders" element={<Orders />} />
          <Route path="clients" element={<Clients />} />
        </Route>
      </Routes>

      {!isSellerRoute && <WhatsappButton />}
    </>
  );
}

export default App;
