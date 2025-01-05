import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Stores from "./pages/Stores";
import Appearance from "./pages/Appearance";
import StorefrontInformation from "./pages/StorefrontInformation";
import Preview from "./pages/Preview";
import PWASettings from "./pages/PWASettings";
import DomainManagement from "./pages/DomainManagement";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/stores",
    element: <Stores />,
  },
  {
    path: "/appearance",
    element: <Appearance />,
  },
  {
    path: "/storefront-information",
    element: <StorefrontInformation />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/pwa-settings",
    element: <PWASettings />,
  },
  {
    path: "/domain-management",
    element: <DomainManagement />,
  },
]);