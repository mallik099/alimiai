import { Navigate, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage";
import BrandSearchPage from "./pages/BrandSearchPage";
import BrandStudioPage from "./pages/BrandStudioPage";
import DomainSuggestionsPage from "./pages/DomainSuggestionsPage";
import LandingHomePage from "./pages/LandingHomePage";
import LogoGeneratorPage from "./pages/LogoGeneratorPage";
import TaglineGeneratorPage from "./pages/TaglineGeneratorPage";
import VoiceAssistantPage from "./pages/VoiceAssistantPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingHomePage />} />
      <Route path="/brand-search" element={<BrandSearchPage />} />
      <Route path="/ai-brand-generator" element={<BrandStudioPage />} />
      <Route path="/ai-tagline" element={<TaglineGeneratorPage />} />
      <Route path="/ai-logo" element={<LogoGeneratorPage />} />
      <Route path="/ai-voice" element={<VoiceAssistantPage />} />
      <Route path="/ai-domain" element={<DomainSuggestionsPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
