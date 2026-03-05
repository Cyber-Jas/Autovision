import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCar } from '../context/CarContext';

// Preload the model
useGLTF.preload('/models/ferrari.glb');

function CarModel({ targetColor }) {
  const { scene } = useGLTF('/models/ferrari.glb');
  const aoTexture = useTexture('/models/ferrari_ao.png');
  const bodyRef = useRef(null);
  const groupRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Parse the car and collect body mesh + wheel meshes
  useEffect(() => {
    if (!scene) return;

    aoTexture.flipY = false;

    scene.traverse((child) => {
      if (child.isMesh) {
        // AO on everything
        child.material.aoMap = aoTexture;

        // Identify body panels by name (Three.js ferrari model uses 'body' mesh)
        if (child.name === 'body') {
          bodyRef.current = child;
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(targetColor),
            metalness: 0.9,
            roughness: 0.15,
            envMapIntensity: 1.5,
            aoMap: aoTexture,
          });
        }

        // Wheels & tyres
        if (child.name === 'rim_fl' || child.name === 'rim_fr' ||
            child.name === 'rim_rr' || child.name === 'rim_rl') {
          child.material = new THREE.MeshStandardMaterial({
            color: '#888888',
            metalness: 0.95,
            roughness: 0.05,
          });
        }

        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    setReady(true);
  }, [scene, aoTexture]);

  // Smooth color transition
  useEffect(() => {
    if (bodyRef.current) {
      const target = new THREE.Color(targetColor);
      gsap.to(bodyRef.current.material.color, {
        r: target.r, g: target.g, b: target.b,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }
  }, [targetColor]);

  // Entrance animation: car rolls in from the right
  useEffect(() => {
    if (groupRef.current && ready) {
      groupRef.current.position.x = 6;
      groupRef.current.rotation.y = -Math.PI / 4;
      groupRef.current.scale.set(0, 0, 0);

      gsap.timeline()
        .to(groupRef.current.scale, {
          x: 1, y: 1, z: 1, duration: 0.8, ease: 'power3.out',
        })
        .to(groupRef.current.position, {
          x: 0, duration: 1.2, ease: 'power3.out',
        }, '-=0.6')
        .to(groupRef.current.rotation, {
          y: 0, duration: 1.2, ease: 'power3.out',
        }, '<');
    }
  }, [ready]);

  // Gentle idle float while hovered
  const floatTime = useRef(0);
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    floatTime.current += delta * 0.6;
    groupRef.current.position.y = Math.sin(floatTime.current) * 0.02;
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function SceneLights({ car }) {
  const spotRef1 = useRef();
  const spotRef2 = useRef();

  useFrame(({ clock }) => {
    if (spotRef1.current) {
      spotRef1.current.position.x = Math.sin(clock.elapsedTime * 0.3) * 4;
    }
  });

  return (
    <>
      <ambientLight color={car.ambientColor} intensity={0.4} />
      <directionalLight
        color={car.lightColor}
        intensity={2}
        position={[5, 8, 5]}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      {/* Rim light from behind */}
      <directionalLight
        color={car.accentColor}
        intensity={1.5}
        position={[-6, 3, -6]}
      />
      {/* Fill light */}
      <directionalLight color="#334455" intensity={0.6} position={[0, -2, 4]} />
      {/* Moving key spot */}
      <spotLight
        ref={spotRef1}
        color={car.lightColor}
        intensity={80}
        position={[4, 10, 4]}
        angle={0.3}
        penumbra={0.8}
        castShadow
      />
    </>
  );
}

export default function CarScene() {
  const { activeCar, currentColor } = useCar();
  const prevCarId = useRef(activeCar.id);

  // Re-entrance animation trigger
  const [enterKey, setEnterKey] = useState(0);
  useEffect(() => {
    if (activeCar.id !== prevCarId.current) {
      prevCarId.current = activeCar.id;
      setEnterKey((k) => k + 1);
    }
  }, [activeCar.id]);

  return (
    <>
      <SceneLights car={activeCar} />

      <Environment
        preset="night"
        environmentIntensity={activeCar.envIntensity}
      />

      <ContactShadows
        position={[0, -0.51, 0]}
        opacity={0.7}
        scale={10}
        blur={2.5}
        far={1}
        color="#000000"
      />

      <CarModel key={enterKey} targetColor={currentColor} />
    </>
  );
}
