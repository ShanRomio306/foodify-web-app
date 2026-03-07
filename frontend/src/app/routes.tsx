import { createBrowserRouter } from "react-router-dom";

import { RootLayout } from "./layouts/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { RestaurantListPage } from "./pages/RestaurantListPage";
import { RestaurantDetailsPage } from "./pages/RestaurantDetailsPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PaymentPage } from "./pages/PaymentPage";
import { UserProfilePage } from "./pages/UserProfilePage";
import { MyOrdersPage } from "./pages/MyOrdersPage";

import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";




export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "landing", element: <LandingPage/>},
      { path: "restaurants", element: <RestaurantListPage /> },
      { path: "restaurant/:id", element: <RestaurantDetailsPage /> },
      { path: "checkout", element: <CheckoutPage /> },
      { path: "payment/:orderId", element: <PaymentPage /> },
      { path: "profile", element: <UserProfilePage /> },
      { path: "orders", element: <MyOrdersPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> }
    ]
  },

  // {
  //   path: "/restaurant-admin",
  //   element: <RestaurantAdminLayout />,
  //   children: [
  //     { index: true, element: <RestaurantDashboard /> },
  //     { path: "menu", element: <MenuManagement /> },
  //     { path: "orders", element: <OrderManagement /> },
  //     { path: "categories", element: <CategoriesManagement /> },
  //     { path: "offers", element: <OffersManagement /> },
  //     { path: "settings", element: <RestaurantSettings /> }
  //   ]
  // },

  // {
  //   path: "/super-admin",
  //   element: <SuperAdminLayout />,
  //   children: [
  //     { index: true, element: <SuperAdminDashboard /> },
  //     { path: "users", element: <UsersManagement /> },
  //     { path: "restaurants", element: <RestaurantApproval /> },
  //     { path: "orders", element: <AllOrdersMonitoring /> }
  //   ]
  // }
]);