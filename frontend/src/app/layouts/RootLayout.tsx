import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { CartDrawer } from "../components/CartDrawer";

export function RootLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <CartDrawer />
    </>
  );
}