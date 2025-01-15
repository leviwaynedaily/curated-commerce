import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import StorefrontInformation from "./pages/StorefrontInformation";
import Appearance from "./pages/Appearance";
import PWASettings from "./pages/PWASettings";
import DomainManagement from "./pages/DomainManagement";
import Preview from "./pages/Preview";
import Users from "./pages/Users";
import PublicHome from "./pages/PublicHome";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicHome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
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
    path: "/users",
    element: <Users />,
  },
  {
    path: "/:slug",
    element: <Preview />,
  }
]);