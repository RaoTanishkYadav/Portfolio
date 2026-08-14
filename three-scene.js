/* ============================================================
   THREE.JS HERO SCENE
   Metallic/glass icosahedron with a wireframe shell, particle
   field, purple/cyan lighting, mouse parallax and scroll-driven
   camera movement. Auto-reduces complexity on mobile.
   ============================================================ */
(function () {
  const canvas = document.getElementById("heroCanvas");
  if (!canvas || typeof THREE === "undefined") return;

  const isMobile = window.innerWidth < 760;
  const hero = document.querySelector(".hero");

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(hero.clientWidth, hero.clientHeight);

  // ---- Scene / Camera ----
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050507, isMobile ? 0.035 : 0.02);

  const camera = new THREE.PerspectiveCamera(
    45,
    hero.clientWidth / hero.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 9);

  // ---- Lights ----
  const purpleLight = new THREE.PointLight(0x8b6bff, 6, 30);
  purpleLight.position.set(-4, 3, 4);
  scene.add(purpleLight);

  const cyanLight = new THREE.PointLight(0x35e8e0, 6, 30);
  cyanLight.position.set(4, -2, 3);
  scene.add(cyanLight);

  const ambient = new THREE.AmbientLight(0x1a1a2e, 1.2);
  scene.add(ambient);

  // ---- Main object: metallic/glass icosahedron ----
  const geometry = new THREE.IcosahedronGeometry(2.1, 1);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x0d0d14,
    metalness: 0.85,
    roughness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
    transmission: 0.35,
    thickness: 1.2,
    envMapIntensity: 1.2,
  });
  const mainMesh = new THREE.Mesh(geometry, material);
  scene.add(mainMesh);

  // Wireframe secondary layer, slightly larger
  const wireGeometry = new THREE.IcosahedronGeometry(2.32, 1);
  const wireMaterial = new THREE.MeshBasicMaterial({
    color: 0x8b6bff,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
  scene.add(wireMesh);

  const group = new THREE.Group();
  group.add(mainMesh, wireMesh);
  group.position.set(2.4, 0, 0);
  scene.add(group);

  // ---- Particle field ----
  const particleCount = isMobile ? 260 : 900;
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 24;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x35e8e0,
    size: 0.028,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---- Mouse interaction ----
  let mouseX = 0, mouseY = 0;
  let targetRotX = 0, targetRotY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    targetRotY = mouseX * 0.4;
    targetRotX = mouseY * 0.25;
  });

  // ---- Scroll interaction ----
  let scrollFactor = 0;
  window.addEventListener(
    "scroll",
    () => {
      const heroHeight = hero.clientHeight;
      scrollFactor = Math.min(window.scrollY / heroHeight, 1.4);
    },
    { passive: true }
  );

  // ---- Resize ----
  window.addEventListener("resize", () => {
    const w = hero.clientWidth;
    const h = hero.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ---- Animation loop ----
  const clock = new THREE.Clock();

  function animate() {
    const elapsed = clock.getElapsedTime();

    // Idle auto-rotation, sped/tilted by mouse (lerp for smooth cinematic feel)
    mainMesh.rotation.y += 0.0022;
    mainMesh.rotation.x += 0.0009;
    wireMesh.rotation.y -= 0.0016;
    wireMesh.rotation.x += 0.0011;

    group.rotation.y += (targetRotY - group.rotation.y) * 0.04;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.04;

    // Gentle float
    group.position.y = Math.sin(elapsed * 0.6) * 0.18;

    // Scroll pushes the object back / down and fades it out with distance
    group.position.z = -scrollFactor * 3.5;
    group.position.x = 2.4 + scrollFactor * 1.2;
    camera.position.y = -scrollFactor * 1.2;

    // Particle drift
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.0001;

    // Light pulse
    purpleLight.intensity = 6 + Math.sin(elapsed * 0.8) * 1.2;
    cyanLight.intensity = 6 + Math.cos(elapsed * 0.9) * 1.2;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();
