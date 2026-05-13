import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import HomeScreen from "@/pages/HomeScreen";
import BeachPage from "@/pages/BeachPage";
import DesignSystem from "@/pages/DesignSystem";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import FavoritesPage from "@/pages/FavoritesPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main style={{ minHeight: "100vh", background: "var(--surface-primary)" }}>
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Rotas públicas */}
            <Route path="/" element={<HomeScreen />} />
            <Route path="/praia/:slug" element={<BeachPage />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="*" element={<HomeScreen />} />

            {/* Rotas protegidas */}
            <Route path="/favoritos" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
