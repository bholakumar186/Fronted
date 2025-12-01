import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import HomePage from "./homepage";
import AboutUs from "./pages/aboutUs.jsx";
import ContactSection from "./pages/contactUs.jsx";
import Carrers from "./pages/carrers.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import PaymentCallback from "./pages/paymentCallback.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import MyApplications from "./pages/MyApplications.jsx";

import AdminDashboard from "./admin/Admin.jsx";
import ProtectedRoute from "./components/protectedRoute.jsx";

import {
  HOME_ROUTE,
  ABOUT_US,
  CONTACT_US,
  CARRERS,
  CALLBACK_URL,
} from "./constants.js";

function App() {
  const [openModal, setOpenModal] = useState(false);
  const handleClose = () => setOpenModal(false);

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={HOME_ROUTE}
        element={
          <HomePage
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleClose={handleClose}
          />
        }
      />
      <Route
        path={ABOUT_US}
        element={
          <AboutUs
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleClose={handleClose}
          />
        }
      />
      <Route
        path={CONTACT_US}
        element={
          <ContactSection
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleClose={handleClose}
          />
        }
      />
      <Route
        path={CARRERS}
        element={
          <Carrers
            openModal={openModal}
            setOpenModal={setOpenModal}
            handleClose={handleClose}
          />
        }
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path={CALLBACK_URL} element={<PaymentCallback />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <UserProfile
              openModal={openModal}
              setOpenModal={setOpenModal}
              handleClose={handleClose}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-application"
        element={
          <ProtectedRoute>
            <MyApplications
              openModal={openModal}
              setOpenModal={setOpenModal}
              handleClose={handleClose}
            />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
