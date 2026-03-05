import { useEffect, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useCar } from '../context/CarContext';

function FeatureCard({ icon, title, desc, accent, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      className="feature-card"
      style={{ '--accent': accent }}
      initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60, y: 20 }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
    >
      <div className="feature-card__icon-wrap">
        <span className="feature-card__icon">{icon}</span>
        <div
          className="feature-card__icon-glow"
          style={{ background: accent + '33' }}
        />
      </div>
      <h3 className="feature-card__title" style={{ color: accent }}>
        {title}
      </h3>
      <p className="feature-card__desc">{desc}</p>
      <div
        className="feature-card__border"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </motion.div>
  );
}

export default function FeaturesSection() {
  const { activeCar } = useCar();
  const headingRef = useRef(null);
  const inView = useInView(headingRef, { once: true, margin: '-100px' });

  return (
    <section id="features" className="features-section">
      <div className="features-section__bg" />

      {/* Heading */}
      <motion.div
        ref={headingRef}
        className="section-header"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-eyebrow" style={{ color: activeCar.uiText }}>
          Engineering Excellence
        </p>
        <h2 className="section-title">
          Crafted for{' '}
          <span style={{ color: activeCar.uiText }}>Perfection</span>
        </h2>
        <p className="section-subtitle">{activeCar.description}</p>
      </motion.div>

      {/* Feature cards */}
      <AnimatePresence mode="wait">
        <div key={activeCar.id} className="features-grid">
          {activeCar.features.map((feat, i) => (
            <FeatureCard
              key={feat.title}
              {...feat}
              accent={activeCar.uiText}
              index={i}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Horizontal rule accent */}
      <motion.div
        className="section-divider"
        style={{ background: `linear-gradient(90deg, transparent, ${activeCar.uiAccent}, transparent)` }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
    </section>
  );
}
