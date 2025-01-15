import { createBrowserRouter } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import Store from "./pages/Store"
import Products from "./pages/Products"
import StorefrontInformation from "./pages/StorefrontInformation"
import Appearance from "./pages/Appearance"
import PWASettings from "./pages/PWASettings"
import DomainManagement from "./pages/DomainManagement"
import Preview from "./pages/Preview"
import Login from "./pages/Login"
import Users from "./pages/Users"
import Landing from "./pages/Landing"
import PublicHome from "./pages/PublicHome"

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <PublicHome />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/:storefrontSlug",
    element: <PublicHome />,
  },
  
  // Protected Routes - Landing & Store Management
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/store/:id",
    element: <Store />,
  },
  
  // Store Settings & Features
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
])