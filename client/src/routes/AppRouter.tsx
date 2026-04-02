import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import RoleRoute from "../components/common/RoleRoute";
import PublicLayout from "../components/layout/PublicLayout";
import CustomerLayout from "../components/layout/CustomerLayout";
import OwnerLayout from "../components/layout/OwnerLayout";

import LandingPage from "../pages/public/LandingPage";
import SuggestionsPage from "../pages/public/SuggestionsPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import CustomerHomePage from "../pages/customer/CustomerHomePage";
import RestaurantsPage from "../pages/customer/RestaurantsPage";
import OwnerDashboardPage from "../pages/owner/OwnerDashboardPage";
import OwnerMenuItemsPage from "../pages/owner/OwnerMenuItemsPage";

// 1. Import the Admin Dashboard
import AdminDashboard from "../pages/AdminDashboard";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/suggestions" element={<SuggestionsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* --- DEV / ADMIN TESTING ROUTE --- */}
      {/* Placed OUTSIDE ProtectedRoute so you bypass the login screen entirely */}
      <Route path="/admin" element={<AdminDashboard />} />

      <Route element={<ProtectedRoute />}>
        <Route
          element={
            <RoleRoute allowedRoles={["CUSTOMER"]}>
              <CustomerLayout />
            </RoleRoute>
          }
        >
          <Route path="/app" element={<CustomerHomePage />} />
          <Route path="/app/restaurants" element={<RestaurantsPage />} />
        </Route>

        <Route
          element={
            <RoleRoute allowedRoles={["OWNER", "ADMIN"]}>
              <OwnerLayout />
            </RoleRoute>
          }
        >
          <Route path="/owner" element={<OwnerDashboardPage />} />
          <Route path="/owner/menu-items" element={<OwnerMenuItemsPage />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;