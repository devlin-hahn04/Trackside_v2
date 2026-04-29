import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MapPin, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

// Default fallback data in case no data is provided
const defaultRace = {
  name: "Miami Grand Prix",
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

const infoItems = [
  { icon: MapPin, label: "Location", key: "location" },
  { icon: Calendar, label: "Race Day", key: "date" },
  { icon: Clock, label: "Lights Out", key: "time" },
];

export default function RaceGlobe({ raceData = null }) {
  const mountRef = useRef(null);
  
  // Use the passed raceData, or fall back to default
  const race = raceData || defaultRace;

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
    renderer.setClearColor(0x111318, 1);
    container.appendChild(renderer.domElement);

    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const earthTexture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    
    // Create Earth globe with realistic texture
    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 128, 128),
      new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.5,
        metalness: 0.1,
      })
    );
    scene.add(globe);

    // Outer glow ring (kept this - adds nice F1 aesthetic)
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.08, 1.14, 64),
      new THREE.MeshBasicMaterial({ 
        color: 0xe8002d, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.15 
      })
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // Red pin at race location
    const pinBasePos = latLngToVector3(race.lat, race.lng, 1.02);
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.045, 32, 32),
      new THREE.MeshStandardMaterial({ 
        color: 0xe8002d, 
        emissive: 0x440000, 
        emissiveIntensity: 0.8 
      })
    );
    pin.position.copy(pinBasePos);
    scene.add(pin);

    // Glow effect for pin
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xe8002d, transparent: true, opacity: 0.4 });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), glowMat);
    glow.position.copy(pinBasePos);
    scene.add(glow);

    // Add stars background
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 25;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.15, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Lighting
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0x4466cc, 0.4);
    fillLight.position.set(-3, 1, -4);
    scene.add(fillLight);
    const redLight = new THREE.PointLight(0xe8002d, 0.4, 10);
    redLight.position.set(-2, 1, 3);
    scene.add(redLight);

    globe.rotation.y = -(race.lng * Math.PI / 180) + Math.PI * 0.1;

    let time = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.003;
      
      // Slow rotation for the globe
      globe.rotation.y += 0.002;
      
      // Update pin position based on globe rotation
      const pinWorld = latLngToVector3(race.lat, race.lng, 1.02);
      pinWorld.applyAxisAngle(new THREE.Vector3(0, 1, 0), globe.rotation.y);
      pin.position.copy(pinWorld);
      glow.position.copy(pinWorld);
      
      // Pulsing glow effect
      glowMat.opacity = 0.25 + Math.sin(time * 5) * 0.15;
      glow.scale.setScalar(1 + Math.sin(time * 5) * 0.3);
      
      // Rotate stars
      stars.rotation.y += 0.0002;
      
      // Rotate ring
      ring.rotation.z += 0.001;
      
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#E8002D] shrink-0" />
        <h2 className="font-heading text-xs sm:text-sm md:text-base tracking-widest uppercase text-white">
          Next Race
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div
          ref={mountRef}
          className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-none md:w-1/2 aspect-square shrink-0 mx-auto md:mx-0"
          style={{ minWidth: "250px", minHeight: "250px" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex-1 w-full space-y-4 sm:space-y-5"
        >
          <div>
            <p className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide leading-tight">
              {race.name}
            </p>
            <p className="text-xs sm:text-sm text-gray-400 font-body mt-1">
              {race.circuit}
            </p>
          </div>

          <div className="h-px bg-gray-700" />

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
            {infoItems.map(({ icon: Icon, label, key }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#E8002D]/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E8002D]" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-gray-400 font-body">{label}</p>
                  <p className="text-xs sm:text-sm font-body text-white">{race[key]}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
