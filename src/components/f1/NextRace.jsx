// src/components/f1/NextRace.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

// Default fallback data
const defaultRace = {
  name: "MIAMI GRAND PRIX",
  circuit: "Miami International Autodrome",
  location: "Miami, Florida",
  date: "May 4, 2025",
  time: "15:00 CET",
  lat: 25.9581,
  lng: -80.2389,
};

function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

export default function NextRace({ raceData = null }) {
  const mountRef = useRef(null);
  
  // Merge provided data with defaults
  const race = {
    ...defaultRace,
    ...(raceData || {}),
    name: raceData?.name ? raceData.name.toUpperCase() : defaultRace.name,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x0a1628, emissive: 0x050e1a,
        specular: 0x00aaff, shininess: 30,
        transparent: true, opacity: 0.95,
      })
    );
    scene.add(globe);

    // Teal wireframe
    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.005, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.12 })
    );
    scene.add(wireframe);

    // Outer glow ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.1, 1.18, 64),
      new THREE.MeshBasicMaterial({ color: 0x00aaff, side: THREE.DoubleSide, transparent: true, opacity: 0.18 })
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Red pin at race location
    const pinBasePos = latLngToVector3(race.lat, race.lng, 1.02);
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xe8002d })
    );
    pin.position.copy(pinBasePos);
    scene.add(pin);

    const glowMat = new THREE.MeshBasicMaterial({ color: 0xe8002d, transparent: true, opacity: 0.35 });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), glowMat);
    glow.position.copy(pinBasePos);
    scene.add(glow);

    // Lighting
    scene.add(new THREE.AmbientLight(0x002244, 0.8));
    const dirLight = new THREE.DirectionalLight(0x00aaff, 1.2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    const redLight = new THREE.PointLight(0xe8002d, 0.6, 10);
    redLight.position.set(-3, 1, 3);
    scene.add(redLight);

    globe.rotation.y = -(race.lng * Math.PI / 180) + Math.PI * 0.1;
    wireframe.rotation.y = globe.rotation.y;

    let time = 0;
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.005;
      globe.rotation.y += 0.001;
      wireframe.rotation.y = globe.rotation.y;
      const pinWorld = latLngToVector3(race.lat, race.lng, 1.02);
      pinWorld.applyAxisAngle(new THREE.Vector3(0, 1, 0), globe.rotation.y);
      pin.position.copy(pinWorld);
      glow.position.copy(pinWorld);
      glowMat.opacity = 0.2 + Math.sin(time * 4) * 0.18;
      glow.scale.setScalar(1 + Math.sin(time * 4) * 0.35);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [race.lat, race.lng]);

  const infoItems = [
    { label: "Location:", value: race.location },
    { label: "Race Day:", value: race.date },
    { label: "Lights Out:", value: race.time },
  ];

  return (
    <div>
      <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider mb-6">
        NEXT RACE
      </h2>

      <div className="relative flex flex-col sm:flex-row items-center gap-6">
        {/* Globe */}
        <div
          ref={mountRef}
          className="w-full sm:w-[280px] shrink-0 aspect-square"
          style={{ maxWidth: "300px" }}
        />

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex-1 w-full space-y-3"
        >
          {/* Race name — desktop */}
          <div className="mb-4">
            <div className="inline-block bg-[#E8002D] px-2 py-0.5 mb-1">
              <span className="font-heading text-[9px] font-bold text-white tracking-widest">NEXT RACE</span>
            </div>
            <p className="font-heading text-2xl font-black text-white leading-tight tracking-wide">
              {race.name}
            </p>
            <p className="font-heading text-[10px] text-white/50 tracking-wider mt-1">{race.circuit}</p>
          </div>

          {infoItems.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-md overflow-hidden"
              style={{
                background: "#1a1d24",
                borderLeft: "3px solid #E8002D",
              }}
            >
              <div className="px-3 py-2">
                <p className="font-heading text-[9px] text-white/50 tracking-widest">{label}</p>
                <p className="font-heading text-sm font-bold text-white tracking-wide">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
