import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import TourDate from "./pages/TourDate";
import AllTourDates from "./pages/AllTourDates";
import Lineage from "./pages/Lineage";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Profile />} />
        <Route path="/tour" element={<AllTourDates />} />
        <Route path="/tour/:id" element={<TourDate />} />
        <Route path="/lineage" element={<Lineage />} />
        <Route path="/shop" element={<Catalog />} />
        <Route path="/shop/:id" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      <Footer />
    </>
  );
}
