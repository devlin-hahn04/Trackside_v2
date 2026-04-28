import { useEffect, useRef } from "react";
import * as THREE from "three";
import { MapPin, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

const nextRace = {
  name: "Spanish Grand Prix",
  circuit: "Circuit de Barcelona-Catalunya",
  location: "Barcelona, Spain",
  date: "May 4, 2025",
  time: "15:00 CET",
  lat: 41.57,
  lng: 2.26,
};

function latLngToVector3(lat, lng, radius) {
  const phi   = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
  );
}

const infoItems = [
  { icon: MapPin,   label: "Location",  key: "location" },
  { icon: Calendar, label: "Race Day",   key: "date" },
  { icon: Clock,    label: "Lights Out", key: "time" },
];

export default function RaceGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width  = container.clientWidth;
    const height = container.clientHeight;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globe = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshPhongMaterial({
        color: 0x1a1f2e, emissive: 0x0a0e18,
        specular: 0x333344, shininess: 15,
        transparent: true, opacity: 0.92,
      })
    );
    scene.add(globe);

    const wireframe = new THREE.Mesh(
      new THREE.SphereGeometry(1.005, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xe8002d, wireframe: true, transparent: true, opacity: 0.07 })
    );
    scene.add(wireframe);

    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.08, 1.14, 64),
      new THREE.MeshBasicMaterial({ color: 0xe8002d, side: THREE.DoubleSide, transparent: true, opacity: 0.12 })
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    const pinBasePos = latLngToVector3(nextRace.lat, nextRace.lng, 1.02);
    const pin = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xe8002d })
    );
    pin.position.copy(pinBasePos);
    scene.add(pin);

    const glowMat = new THREE.MeshBasicMaterial({ color: 0xe8002d, transparent: true, opacity: 0.3 });
    const glow = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), glowMat);
    glow.position.copy(pinBasePos);
    scene.add(glow);

    scene.add(new THREE.AmbientLight(0x404060, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 3, 5);
    scene.add(dirLight);
    const redLight = new THREE.PointLight(0xe8002d, 0.5, 10);
    redLight.position.set(-3, 2, 3);
    scene.add(redLight);

    globe.rotation.y     = -(nextRace.lng * Math.PI / 180) + Math.PI * 0.1;
    wireframe.rotation.y = globe.rotation.y;

    let time = 0;
    let animId;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.005;
      globe.rotation.y     += 0.001;
      wireframe.rotation.y  = globe.rotation.y;

      const pinWorld = latLngToVector3(nextRace.lat, nextRace.lng, 1.02);
      pinWorld.applyAxisAngle(new THREE.Vector3(0, 1, 0), globe.rotation.y);
      pin.position.copy(pinWorld);
      glow.position.copy(pinWorld);
      glowMat.opacity = 0.2 + Math.sin(time * 4) * 0.15;
      glow.scale.setScalar(1 + Math.sin(time * 4) * 0.3);

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
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 sm:mb-8">
        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
        <h2 className="font-heading text-xs sm:text-sm md:text-base tracking-widest uppercase text-foreground">
          Next Race
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div
          ref={mountRef}
          className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-none md:w-1/2 aspect-square shrink-0 mx-auto md:mx-0"
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex-1 w-full space-y-4 sm:space-y-5"
        >
          <div>
            <p className="font-heading text-lg sm:text-xl md:text-2xl font-bold text-foreground tracking-wide leading-tight">
              {nextRace.name}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground font-body mt-1">
              {nextRace.circuit}
            </p>
          </div>

          <div className="h-px bg-border" />

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 gap-3">
            {infoItems.map(({ icon: Icon, label, key }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-body">{label}</p>
                  <p className="text-xs sm:text-sm font-body text-foreground">{nextRace[key]}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
