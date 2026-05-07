import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeScreen from "@/pages/HomeScreen";
import BeachPage from "@/pages/BeachPage";
import DesignSystem from "@/pages/DesignSystem";

export default function App() {
  return (
    <BrowserRouter>
      <main style={{ minHeight: "100vh", background: "var(--surface-primary)" }}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/praia/:slug" element={<BeachPage />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="*" element={<HomeScreen />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
