import { motion } from 'framer-motion';
import { useCar } from '../context/CarContext';

export default function CarSelector() {
  const { cars, activeCar, selectCar } = useCar();

  return (
    <div className="car-selector">
      {cars.map((car, i) => {
        const isActive = car.id === activeCar.id;
        return (
          <motion.button
            key={car.id}
            className={`car-tab ${isActive ? 'car-tab--active' : ''}`}
            onClick={() => selectCar(car.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            style={isActive ? { borderColor: car.uiAccent, color: car.uiAccent } : {}}
          >
            <span className="car-tab__type">{car.type}</span>
            <span className="car-tab__brand">{car.brand}</span>
            <span className="car-tab__model">{car.name}</span>
            {isActive && (
              <motion.div
                className="car-tab__bar"
                layoutId="car-tab-bar"
                style={{ background: car.uiAccent }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
