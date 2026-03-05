import { motion, AnimatePresence } from 'framer-motion';
import { useCar } from '../context/CarContext';

const specLabels = {
  engine: 'Engine',
  displacement: 'Displacement',
  power: 'Max Power',
  torque: 'Max Torque',
  acceleration: '0–100 km/h',
  topSpeed: 'Top Speed',
  weight: 'Kerb Weight',
  drivetrain: 'Drivetrain',
};

const rowVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function SpecsSection() {
  const { activeCar } = useCar();

  return (
    <section id="specs" className="specs-section">
      <motion.div
        className="section-header"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
      >
        <p className="section-eyebrow" style={{ color: activeCar.uiText }}>
          Technical Data
        </p>
        <h2 className="section-title">
          Full{' '}
          <span style={{ color: activeCar.uiText }}>Specifications</span>
        </h2>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCar.id}
          className="specs-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Left column: car identity card */}
          <div className="specs-identity">
            <div
              className="specs-identity__badge"
              style={{ borderColor: activeCar.uiAccent }}
            >
              <span
                className="specs-identity__type"
                style={{ color: activeCar.uiText }}
              >
                {activeCar.type}
              </span>
              <h3 className="specs-identity__brand">{activeCar.brand}</h3>
              <h2
                className="specs-identity__name"
                style={{ color: activeCar.uiText }}
              >
                {activeCar.name}
              </h2>
              <p className="specs-identity__subtitle">{activeCar.subtitle}</p>
              <p className="specs-identity__year">{activeCar.year}</p>
            </div>
            <p className="specs-identity__desc">{activeCar.description}</p>
          </div>

          {/* Right column: spec rows */}
          <table className="specs-table">
            <tbody>
              {Object.entries(specLabels).map(([key, label], i) => (
                <motion.tr
                  key={key}
                  className="specs-row"
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <td className="specs-row__label">{label}</td>
                  <td
                    className="specs-row__value"
                    style={{ color: activeCar.uiText }}
                  >
                    {activeCar.specs[key]}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </AnimatePresence>

      {/* Footer brand strip */}
      <motion.div
        className="brand-footer"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <p style={{ color: activeCar.uiText + '88' }}>
          {activeCar.brand} · {activeCar.name} · {activeCar.year}
        </p>
        <p className="brand-footer__sub">
          All specifications subject to change without notice.
        </p>
      </motion.div>
    </section>
  );
}
