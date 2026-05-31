// ── THREE.JS BACKGROUND ANIMATION ──
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  // ── Particle field ──
  const particleCount = 600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const accentColors = [
    new THREE.Color('#00f5c4'), new THREE.Color('#7c3aed'),
    new THREE.Color('#f97316'), new THREE.Color('#3b82f6')
  ];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
    const c = accentColors[Math.floor(Math.random() * accentColors.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({ size: 0.08, vertexColors: true, transparent: true, opacity: 0.7 });
  scene.add(new THREE.Points(pGeo, pMat));

  // ── Wireframe torus ──
  const torusGeo = new THREE.TorusKnotGeometry(2.5, 0.4, 128, 32);
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0x00f5c4, wireframe: true, transparent: true, opacity: 0.12
  });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  torus.position.set(5, 0, -3);
  scene.add(torus);

  // ── Icosahedron ──
  const icoGeo = new THREE.IcosahedronGeometry(1.8, 1);
  const icoMat = new THREE.MeshBasicMaterial({
    color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.18
  });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-5, 2, -2);
  scene.add(ico);

  // ── Floating cubes ──
  const cubes = [];
  for (let i = 0; i < 8; i++) {
    const size = Math.random() * 0.4 + 0.1;
    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshBasicMaterial({
      color: accentColors[i % accentColors.length],
      wireframe: true, transparent: true, opacity: 0.4
    });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.set(
      (Math.random() - 0.5) * 14,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 5
    );
    cube.userData = {
      rx: (Math.random() - 0.5) * 0.02,
      ry: (Math.random() - 0.5) * 0.02,
      fy: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.005
    };
    scene.add(cube);
    cubes.push(cube);
  }

  // ── Grid lines ──
  const gridHelper = new THREE.GridHelper(30, 20, 0x00f5c410, 0x00f5c408);
  gridHelper.position.set(0, -5, -2);
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.15;
  scene.add(gridHelper);

  // ── Mouse parallax ──
  const mouse = { x: 0, y: 0 };
  document.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  let clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    torus.rotation.x = t * 0.15;
    torus.rotation.y = t * 0.2;
    ico.rotation.x = t * 0.1;
    ico.rotation.y = t * 0.15;

    cubes.forEach(c => {
      c.rotation.x += c.userData.rx;
      c.rotation.y += c.userData.ry;
      c.position.y += Math.sin(t * c.userData.speed + c.userData.fy) * 0.002;
    });

    camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    pGeo.attributes.position.array.forEach((_, i) => {
      if (i % 3 === 1) {
        const idx = Math.floor(i / 3);
        positions[i] = (Math.sin(t * 0.2 + idx * 0.01) * 0.002 + positions[i]);
      }
    });
    pGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  // ── About section canvas ──
  const aboutCanvas = document.getElementById('about-canvas');
  if (aboutCanvas) {
    const r2 = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true, antialias: true });
    r2.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r2.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);

    const s2 = new THREE.Scene();
    const c2 = new THREE.PerspectiveCamera(50, aboutCanvas.clientWidth / aboutCanvas.clientHeight, 0.1, 100);
    c2.position.z = 5;

    const sphereGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const sphereMat = new THREE.MeshBasicMaterial({ color: 0x00f5c4, wireframe: true, transparent: true, opacity: 0.3 });
    const sphere = new THREE.Mesh(sphereGeo, sphereMat);
    s2.add(sphere);

    const ringGeo = new THREE.TorusGeometry(2.8, 0.03, 8, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.5 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    s2.add(ring);

    const ring2 = ring.clone();
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    ring2.material = new THREE.MeshBasicMaterial({ color: 0xf97316, transparent: true, opacity: 0.4 });
    s2.add(ring2);

    const cl2 = new THREE.Clock();
    function animate2() {
      requestAnimationFrame(animate2);
      const t2 = cl2.getElapsedTime();
      sphere.rotation.y = t2 * 0.3;
      sphere.rotation.x = t2 * 0.1;
      ring.rotation.z = t2 * 0.2;
      ring2.rotation.y = t2 * 0.15;
      r2.render(s2, c2);
    }
    animate2();
  }
})();
