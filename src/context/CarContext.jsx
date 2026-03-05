import { createContext, useContext, useState } from 'react';
import { cars } from '../data/cars';

const CarContext = createContext(null);

export function CarProvider({ children }) {
  const [activeCarId, setActiveCarId] = useState('sports');
  const [paintColor, setPaintColor] = useState(null); // null = use car default

  const activeCar = cars.find((c) => c.id === activeCarId);
  const currentColor = paintColor ?? activeCar.bodyColor;

  function selectCar(id) {
    setActiveCarId(id);
    setPaintColor(null); // reset paint when switching model
  }

  return (
    <CarContext.Provider
      value={{ cars, activeCar, currentColor, selectCar, setPaintColor }}
    >
      {children}
    </CarContext.Provider>
  );
}

export function useCar() {
  return useContext(CarContext);
}
