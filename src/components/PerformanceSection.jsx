import { useRef, useEffect, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useCar } from '../context/CarContext';

function AnimatedNumber({ target, suffix = '', prefix = '', accent, inView }) {
  const [display, setDisplay] = useState('0');
  const hasFired = useRef(false);

  useEffect(() => {
    if (!inView || hasFired.current) return;
    hasFired.current = true;

    const numericTarget = parseFloat(target.replace(/[^0-9.]/g, ''));
    const isFloat = target.includes('.');
    const obj = { val: 0 };

    gsap.to(obj, {
      val: numericTarget,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplay(isFloat ? obj.val.toFixed(1) : Math.round(obj.val).toString());
      },
    });
  }, [inView, target]);

  // Reset when car changes
  useEffect(() => {
    hasFired.current = false;
    setDisplay('0');
  }, [target]);

  return (
    <span className="perf-stat__value" style={{ color: accent }}>
      {prefix}{display}{suffix}
    </span>
  );
}

const bigStats = [
  { key: 'acc',   labelTop: '0 – 100',   unit: 's',     specKey: 'acceleration', prefix: '',  suffix: 's' },
  { key: 'power', labelTop: 'Peak Power', unit: 'hp',    specKey: 'power',        prefix: '',  suffix: '' },
  { key: 'speed', labelTop: 'Top Speed',  unit: 'km/h',  specKey: 'topSpeed',     prefix: '',  suffix: '' },
];

function extractNumber(s) {
  return s.replace(/[^0-9.]/g, '');
}
function extractUnit(s) {
  return s.replace(/[0-9.,\s]/g, '').replace('s', '').trim() || '';
}

export default function PerformanceSection() {
  const { activeCar } = useCar();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-120px' });

  return (
    <section id="performance" className="perf-section" ref={ref}>
      {/* Animated background grid */}
      <div
        className="perf-section__grid"
        style={{ '--accent': activeCar.uiAccent }}
      />

      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <p className="section-eyebrow" style={{ color: activeCar.uiText }}>
          Numbers Don't Lie
        </p>
        <h2 className="section-title">
          Pure{' '}
          <span style={{ color: activeCar.uiText }}>Performance</span>
        </h2>
      </motion.div>

      {/* Big stat counters */}
      <AnimatePresence mode="wait">
        <div key={activeCar.id} className="perf-stats">
          {bigStats.map((s, i) => {
            const raw = activeCar.specs[s.specKey];
            const num = extractNumber(raw);
            const unit = raw.replace(/[0-9.,]/g, '').trim();
            return (
              <motion.div
                key={s.key}
                className="perf-stat"
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="perf-stat__label-top">{s.labelTop}</p>
                <AnimatedNumber
                  target={num}
                  suffix={unit}
                  accent={activeCar.uiText}
                  inView={inView}
                  key={activeCar.id + s.key}
                />
                <div
                  className="perf-stat__underline"
                  style={{ background: activeCar.uiAccent }}
                />
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Comparison bars */}
      <div className="perf-bars">
        <motion.p
          className="perf-bars__heading"
          style={{ color: activeCar.uiText }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Benchmarked Against Class
        </motion.p>
        {[
          { label: 'Acceleration',   pct: activeCar.id === 'concept' ? 98 : activeCar.id === 'sports' ? 92 : 60 },
          { label: 'Handling',       pct: activeCar.id === 'concept' ? 95 : activeCar.id === 'sports' ? 95 : 55 },
          { label: 'Braking',        pct: activeCar.id === 'concept' ? 99 : activeCar.id === 'sports' ? 90 : 65 },
          { label: 'Efficiency',     pct: activeCar.id === 'concept' ? 97 : activeCar.id === 'sports' ? 55 : 72 },
        ].map((bar, i) => (
          <div key={bar.label} className="perf-bar">
            <div className="perf-bar__meta">
              <span>{bar.label}</span>
              <span style={{ color: activeCar.uiText }}>{bar.pct}%</span>
            </div>
            <div className="perf-bar__track">
              <motion.div
                className="perf-bar__fill"
                style={{ background: `linear-gradient(90deg, ${activeCar.uiAccent}, ${activeCar.accentColor})` }}
                initial={{ width: 0 }}
                whileInView={{ width: `${bar.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
