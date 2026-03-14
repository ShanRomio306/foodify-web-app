// import { createBrowserRouter } from "react-router-dom";

// import { RootLayout } from "./layouts/RootLayout";
// import { LandingPage } from "./pages/LandingPage";
// import { RestaurantListPage } from "./pages/RestaurantListPage";
// import { RestaurantDetailsPage } from "./pages/RestaurantDetailsPage";
// import { CheckoutPage } from "./pages/CheckoutPage";
// import { PaymentPage } from "./pages/PaymentPage";
// import { UserProfilePage } from "./pages/UserProfilePage";
// import { MyOrdersPage } from "./pages/MyOrdersPage";

// import { LoginPage } from "./pages/auth/LoginPage";
// import { RegisterPage } from "./pages/auth/RegisterPage";

import { createBrowserRouter } from "react-router";
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
import { RestaurantAdminLayout } from "./layouts/RestaurantAdminLayout";
import { RestaurantDashboard } from "./pages/admin/restaurant/RestaurantDashboard";
import { MenuManagement } from "./pages/admin/restaurant/MenuManagement";
import { OrderManagement } from "./pages/admin/restaurant/OrderManagement";
import { RestaurantSettings } from "./pages/admin/restaurant/RestaurantSettings";
import { CategoriesManagement } from "./pages/admin/restaurant/CategoriesManagement";
import { OffersManagement } from "./pages/admin/restaurant/OffersManagement";
import { SuperAdminLayout } from "./layouts/SuperAdminLayout";
import { SuperAdminDashboard } from "./pages/admin/super/SuperAdminDashboard";
import { RestaurantApproval } from "./pages/admin/super/RestaurantApproval";
 import { UsersManagement } from "./pages/admin/super/UsersManagement";





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

  {
    path: "/restaurant-admin",
    element: <RestaurantAdminLayout />,
    children: [
      { index: true, element: <RestaurantDashboard /> },
      { path: "menu", element: <MenuManagement /> },
      { path: "orders", element: <OrderManagement /> },
      { path: "categories", element: <CategoriesManagement /> },
      { path: "offers", element: <OffersManagement /> },
      { path: "settings", element: <RestaurantSettings /> }
    ]
  },

  {
    path: "/super-admin",
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: "users", element: <UsersManagement /> },
      { path: "restaurants", element: <RestaurantApproval /> },
      // { path: "orders", element: <AllOrdersMonitoring /> }
    ]
  }
]);