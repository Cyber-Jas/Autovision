import { CarProvider } from './context/CarContext';
import Navigation from './components/Navigation';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import PerformanceSection from './components/PerformanceSection';
import SpecsSection from './components/SpecsSection';

export default function App() {
  return (
    <CarProvider>
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PerformanceSection />
        <SpecsSection />
      </main>
    </CarProvider>
  );
}
