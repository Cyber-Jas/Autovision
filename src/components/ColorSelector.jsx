import { motion } from 'framer-motion';
import { useCar } from '../context/CarContext';

export default function ColorSelector() {
  const { activeCar, currentColor, setPaintColor } = useCar();

  return (
    <div className="color-selector">
      <p className="color-selector__label">Paint Finish</p>
      <div className="color-selector__swatches">
        {activeCar.paintOptions.map((opt, i) => {
          const isActive = currentColor === opt.hex;
          return (
            <motion.button
              key={opt.hex}
              className={`swatch ${isActive ? 'swatch--active' : ''}`}
              style={{ background: opt.hex }}
              title={opt.name}
              onClick={() => setPaintColor(opt.hex)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              {isActive && (
                <motion.span
                  className="swatch__ring"
                  style={{ borderColor: activeCar.uiAccent }}
                  layoutId="swatch-ring"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      <motion.p
        className="color-selector__name"
        key={currentColor}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ color: activeCar.uiText }}
      >
        {activeCar.paintOptions.find((o) => o.hex === currentColor)?.name ??
          activeCar.paintOptions[0].name}
      </motion.p>
    </div>
  );
}
