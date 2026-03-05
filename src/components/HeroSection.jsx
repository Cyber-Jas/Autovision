import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import CarScene from './CarScene';
import ColorSelector from './ColorSelector';
import CarSelector from './CarSelector';
import { useCar } from '../context/CarContext';

const textVariants = {
  hidden: { opacity: 0, y: 40, filter: 'blur(12px)' },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 * i },
  }),
  exit: { opacity: 0, y: -30, filter: 'blur(8px)', transition: { duration: 0.4 } },
};

/** Returns true when the viewport matches the given query, reactive to resize. */
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export default function HeroSection() {
  const { activeCar } = useCar();
  const scanlineRef = useRef(null);

  const isMobile = useMediaQuery('(max-width: 900px)');

  // Tighter FOV for portrait mobile so the car fits and isn't cropped
  const cameraFov = isMobile ? 52 : 40;

  // Scanline sweep effect on car change
  useEffect(() => {
    if (scanlineRef.current) {
      gsap.fromTo(
        scanlineRef.current,
        { top: '-10%', opacity: 0.6 },
        { top: '110%', opacity: 0, duration: 1.2, ease: 'power2.in' }
      );
    }
  }, [activeCar.id]);

  return (
    <section id="hero" className="hero" style={{ '--accent': activeCar.uiAccent }}>
      {/* Scanline sweep */}
      <div ref={scanlineRef} className="hero__scanline" />

      {/* Atmospheric fog gradient */}
      <div
        className="hero__fog"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 80%, ${activeCar.fogColor}cc, transparent)`,
        }}
      />

      {/* 3D Canvas — always interactive; touch-action:pan-y in CSS keeps page scroll alive */}
      <div className="hero__canvas-wrap">
        <Canvas
          camera={{ position: [4, 1.5, 5], fov: cameraFov }}
          gl={{ antialias: true, toneMapping: 4, toneMappingExposure: 1.0, alpha: true }}
          shadows
        >
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={9}
            minPolarAngle={Math.PI * 0.1}
            maxPolarAngle={Math.PI * 0.55}
            autoRotate
            autoRotateSpeed={isMobile ? 0.6 : 0.4}
            enableDamping
            dampingFactor={0.05}
            enableZoom={false}
          />
          <CarScene />
        </Canvas>
      </div>

      {/* "Drag to rotate" hint — desktop only */}
      {!isMobile && (
        <motion.div
          className="orbit-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
        >
          Drag to orbit
        </motion.div>
      )}

      {/* Text overlay */}
      <div className="hero__content">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCar.id}
            className="hero__text"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.p custom={0} variants={textVariants} className="hero__eyebrow">
              {activeCar.year} · {activeCar.type}
            </motion.p>
            <motion.h1 custom={1} variants={textVariants} className="hero__brand">
              {activeCar.brand}
            </motion.h1>
            <motion.h2 custom={2} variants={textVariants} className="hero__model">
              <span style={{ color: activeCar.uiText }}>{activeCar.name}</span>
              <br />
              <span className="hero__model-sub">{activeCar.subtitle}</span>
            </motion.h2>
            <motion.p custom={3} variants={textVariants} className="hero__tagline">
              {activeCar.tagline}
            </motion.p>

            <motion.div custom={4} variants={textVariants} className="hero__actions">
              <motion.a
                href="#features"
                className="btn btn--primary"
                style={{ background: activeCar.uiAccent, color: '#000' }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Discover More
              </motion.a>
              <motion.a
                href="#specs"
                className="btn btn--ghost"
                style={{ borderColor: activeCar.uiAccent, color: activeCar.uiText }}
                whileHover={{ scale: 1.04, backgroundColor: activeCar.uiAccent + '18' }}
                whileTap={{ scale: 0.97 }}
              >
                View Specs
              </motion.a>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Quick stats strip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCar.id + '-stats'}
          className="hero__stats"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 1.0, duration: 0.7 } }}
          exit={{ opacity: 0, y: 20 }}
        >
          {[
            { label: 'Power',     value: activeCar.specs.power },
            { label: '0–100',     value: activeCar.specs.acceleration },
            { label: 'Top Speed', value: activeCar.specs.topSpeed },
            { label: 'Torque',    value: activeCar.specs.torque },
          ].map((stat) => (
            <div key={stat.label} className="hero__stat">
              <span className="hero__stat-value" style={{ color: activeCar.uiText }}>
                {stat.value}
              </span>
              <span className="hero__stat-label">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Color selector (desktop: right-side absolute; mobile: centred above tabs via CSS) */}
      <div className="hero__colors">
        <ColorSelector />
      </div>

      {/* Car selector */}
      <div className="hero__selector">
        <CarSelector />
      </div>

      {/* Scroll indicator — desktop only (hidden via CSS on mobile) */}
      <div className="scroll-hint">
        <motion.div
          className="scroll-hint__dot"
          style={{ background: activeCar.uiAccent }}
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        />
        <span>Scroll</span>
      </div>
    </section>
  );
}
