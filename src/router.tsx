import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Products from "./pages/Products";
import StorefrontInformation from "./pages/StorefrontInformation";
import Preview from "./pages/Preview";
import PWASettings from "./pages/PWASettings";
import DomainManagement from "./pages/DomainManagement";
import Appearance from "./pages/Appearance";

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
    path: "/storefront-information",
    element: <StorefrontInformation />,
  },
  {
    path: "/appearance",
    element: <Appearance />,
  },
  {
    path: "/pwa-settings",
    element: <PWASettings />,
  },
  {
    path: "/domain-management",
    element: <DomainManagement />,
  },
  {
    path: "/preview",
    element: <Preview />,
  },
  {
    path: "/:slug",
    element: <Preview />,
  }
]);