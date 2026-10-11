/**
 * BIO3D NEXUS - Interactive Realistic 3D Segmented Anatomy Engine
 * Powered by Three.js & TWEEN.js
 * Featuring museum-grade anatomical specimens, procedural medical textures,
 * internal coronal dissections (heart valves & chordae tendineae), and full-body zoom matrix.
 */

class AnatomyViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentOrganId = 'full_body'; // Default view: Full Human Body!
        this.renderMode = 'realistic'; // realistic, xray, hologram, wireframe, glass
        this.explodeDistance = 0.0;
        this.isExploded = false;
        this.isCutawayActive = false; // Coronal dissection toggle (like heart_2.jpg)
        this.vitalMotionEnabled = true;
        this.autoRotateEnabled = false;
        this.labelsVisible = true;
        this.isSliceActive = false;

        // Three.js Core
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();

        // Organ Groups & Registries
        this.organGroup = new THREE.Group();
        this.hotspotsGroup = new THREE.Group();
        this.segmentsMap = new Map();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.hoveredSegment = null;
        this.selectedSegment = null;

        // Clipping Plane (Slicing tool)
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.3);

        // Procedural Textures & Materials Cache
        this.proceduralTextures = {};
        this.materialsCache = new Map();

        this.initTextures();
        this.initScene();
        this.initLights();
        this.initEventListeners();
        this.loadOrgan('full_body');
        this.animate();
    }

    /* -------------------------------------------------------------
       PROCEDURAL REALISTIC ANATOMICAL TEXTURES (Canvas Generators)
       ------------------------------------------------------------- */
    initTextures() {
        // 1. Myocardial Striated Muscle Texture (matches heart_1.jpg)
        this.proceduralTextures.muscle = this.generateMuscleTexture();

        // 2. Trabeculae Carneae & Interior Flesh (matches heart_2.jpg)
        this.proceduralTextures.trabeculae = this.generateTrabeculaeTexture();

        // 3. Epicardial Adipose Fat Granules (matches heart_1.jpg yellow fat pads)
        this.proceduralTextures.fat = this.generateFatTexture();

        // 4. Spongy Lung Parenchyma Texture
        this.proceduralTextures.lung = this.generateLungTexture();

        // 5. Cortical Bone Grain Texture
        this.proceduralTextures.bone = this.generateBoneTexture();
    }

    generateMuscleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Warm base muscle flesh
        ctx.fillStyle = '#c83818';
        ctx.fillRect(0, 0, 512, 512);

        // Striated muscle fibers
        ctx.lineWidth = 1.2;
        for (let y = 0; y < 512; y += 3) {
            ctx.strokeStyle = (y % 6 === 0) ? '#e65128' : '#a8240a';
            ctx.beginPath();
            ctx.moveTo(0, y + (Math.random() - 0.5) * 3);
            for (let x = 0; x <= 512; x += 32) {
                ctx.lineTo(x, y + Math.sin(x * 0.05) * 2 + (Math.random() - 0.5) * 1.5);
            }
            ctx.stroke();
        }

        // Subtle fine capillary branches
        ctx.strokeStyle = '#800000';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < 40; i++) {
            let cx = Math.random() * 512;
            let cy = Math.random() * 512;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        return texture;
    }

    generateTrabeculaeTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');

        // Deep cavity flesh tone (matches heart_2.jpg cross section)
        ctx.fillStyle = '#b83218';
        ctx.fillRect(0, 0, 512, 512);

        // Trabecular muscular ridges and honeycomb meshes
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = 8 + Math.random() * 18;
            ctx.fillStyle = (i % 2 === 0) ? '#d95332' : '#881c08';
            ctx.beginPath();
            ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    generateFatTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        // Yellow adipose baseline
        ctx.fillStyle = '#eab308';
        ctx.fillRect(0, 0, 256, 256);

        // Lipid globules
        for (let i = 0; i < 300; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const r = 3 + Math.random() * 7;
            ctx.fillStyle = (i % 2 === 0) ? '#fef08a' : '#ca8a04';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 3);
        return texture;
    }

    generateLungTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#f472b6';
        ctx.fillRect(0, 0, 256, 256);

        // Spongy alveolar stipples
        for (let i = 0; i < 600; i++) {
            ctx.fillStyle = (i % 3 === 0) ? '#db2777' : '#fbcfe8';
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }

    generateBoneTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(0, 0, 256, 256);

        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        for (let y = 0; y < 256; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(256, y + (Math.random() - 0.5) * 3);
            ctx.stroke();
        }

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    /* -------------------------------------------------------------
       SCENE & RENDERER SETUP
       ------------------------------------------------------------- */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060913);
        this.scene.fog = new THREE.FogExp2(0x060913, 0.035);

        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(0, 0.8, 5.2);

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.localClippingEnabled = true;

        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.8;
        this.controls.zoomSpeed = 1.0;
        this.controls.minDistance = 1.0;
        this.controls.maxDistance = 14.0;
        this.controls.target.set(0, 0.2, 0);

        this.scene.add(this.organGroup);
        this.scene.add(this.hotspotsGroup);

        // Ground grid
        const grid = new THREE.GridHelper(12, 24, 0x00f0ff, 0x1e293b);
        grid.position.y = -2.4;
        grid.material.opacity = 0.22;
        grid.material.transparent = true;
        this.scene.add(grid);

        // Dust particles
        this.createAmbientDust();
    }

    createAmbientDust() {
        const count = 250;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            pos[i] = (Math.random() - 0.5) * 10;
            pos[i + 1] = (Math.random() - 0.5) * 8;
            pos[i + 2] = (Math.random() - 0.5) * 10;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 0.035,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        this.dustParticles = new THREE.Points(geo, mat);
        this.scene.add(this.dustParticles);
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
        this.scene.add(ambientLight);

        // Key light
        this.keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        this.keyLight.position.set(4, 5, 4);
        this.keyLight.castShadow = true;
        this.scene.add(this.keyLight);

        // Fill Light (Medical Cyan tint)
        this.fillLight = new THREE.DirectionalLight(0x00f0ff, 0.85);
        this.fillLight.position.set(-4, 3, 2);
        this.scene.add(this.fillLight);

        // Rim Light (Vibrant Magenta/Crimson)
        this.rimLight = new THREE.DirectionalLight(0xff3366, 1.2);
        this.rimLight.position.set(0, -3, -4);
        this.scene.add(this.rimLight);

        // Overhead soft light
        const topLight = new THREE.PointLight(0xffffff, 0.8, 12);
        topLight.position.set(0, 5, 0);
        this.scene.add(topLight);
    }

    /* -------------------------------------------------------------
       MATERIAL GENERATOR (Realistic Specimen, X-Ray, Hologram, Glass)
       ------------------------------------------------------------- */
    getMaterial(baseColorHex, segmentId, textureType = null) {
        const color = new THREE.Color(baseColorHex);
        const cacheKey = `${segmentId}_${this.renderMode}_${this.isSliceActive}`;

        if (this.materialsCache.has(cacheKey)) {
            return this.materialsCache.get(cacheKey);
        }

        let mat;
        const clipping = this.isSliceActive ? [this.clippingPlane] : null;

        switch (this.renderMode) {
            case 'xray':
                mat = new THREE.MeshPhysicalMaterial({
                    color: color.clone().offsetHSL(0, -0.2, 0.15),
                    emissive: 0x00b4d8,
                    emissiveIntensity: 0.55,
                    roughness: 0.1,
                    metalness: 0.1,
                    transmission: 0.85,
                    opacity: 0.65,
                    transparent: true,
                    side: THREE.DoubleSide,
                    clippingPlanes: clipping
                });
                break;

            case 'hologram':
                mat = new THREE.MeshStandardMaterial({
                    color: 0x00f0ff,
                    emissive: 0x00f0ff,
                    emissiveIntensity: 0.75,
                    wireframe: false,
                    roughness: 0.25,
                    metalness: 0.85,
                    transparent: true,
                    opacity: 0.65,
                    clippingPlanes: clipping
                });
                break;

            case 'wireframe':
                mat = new THREE.MeshBasicMaterial({
                    color: color.clone().offsetHSL(0, 0, 0.2),
                    wireframe: true,
                    clippingPlanes: clipping
                });
                break;

            case 'glass':
                mat = new THREE.MeshPhysicalMaterial({
                    color: color,
                    roughness: 0.05,
                    metalness: 0.1,
                    transmission: 0.92,
                    ior: 1.45,
                    transparent: true,
                    opacity: 0.52,
                    side: THREE.DoubleSide,
                    clippingPlanes: clipping
                });
                break;

            case 'realistic':
            default:
                const tex = textureType ? this.proceduralTextures[textureType] : null;
                mat = new THREE.MeshPhysicalMaterial({
                    color: color,
                    map: tex || null,
                    roughness: 0.35,
                    metalness: 0.05,
                    clearcoat: 0.5,
                    clearcoatRoughness: 0.2,
                    reflectivity: 0.65,
                    side: THREE.DoubleSide,
                    clippingPlanes: clipping
                });
                break;
        }

        this.materialsCache.set(cacheKey, mat);
        return mat;
    }

    setRenderMode(mode) {
        this.renderMode = mode;
        this.materialsCache.clear();

        this.segmentsMap.forEach((item, id) => {
            const newMat = this.getMaterial(item.meta.color, id, item.textureType);
            if (item.mesh.isGroup) {
                item.mesh.traverse((c) => {
                    if (c.isMesh && !c.userData.keepSpecialMat) c.material = newMat;
                });
            } else {
                item.mesh.material = newMat;
            }
            item.originalMaterial = newMat;
        });
    }

    /* -------------------------------------------------------------
       ORGAN LOADER & REGISTRATION
       ------------------------------------------------------------- */
    loadOrgan(organId) {
        this.currentOrganId = organId;
        const loader = document.getElementById('viewportLoader');
        if (loader) loader.classList.remove('hidden');

        this.clearCurrentOrgan();

        setTimeout(() => {
            switch (organId) {
                case 'full_body':
                    this.buildFullBody();
                    break;
                case 'heart':
                    this.buildHeart();
                    break;
                case 'lungs':
                    this.buildLungs();
                    break;
                case 'brain':
                    this.buildBrain();
                    break;
                case 'eye':
                    this.buildEye();
                    break;
                case 'kidney':
                    this.buildKidneys();
                    break;
                case 'liver':
                    this.buildLiver();
                    break;
                case 'stomach':
                    this.buildStomach();
                    break;
                case 'intestines':
                    this.buildIntestines();
                    break;
                case 'pancreas_spleen':
                    this.buildPancreasSpleen();
                    break;
                case 'bladder':
                    this.buildBladder();
                    break;
                case 'skeleton':
                    this.buildSkeleton();
                    break;
                default:
                    this.buildFullBody();
                    break;
            }

            this.resetCamera();
            this.setExplode(0.0);

            if (loader) loader.classList.add('hidden');

            // Toggle zoom out button visibility on canvas
            const zoomOutBtn = document.getElementById('zoomOutBodyBtn');
            if (zoomOutBtn) {
                zoomOutBtn.style.display = (organId === 'full_body') ? 'none' : 'flex';
            }

            window.dispatchEvent(new CustomEvent('organLoaded', { detail: { organId } }));
        }, 120);
    }

    clearCurrentOrgan() {
        while (this.organGroup.children.length > 0) {
            const obj = this.organGroup.children[0];
            this.organGroup.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                else obj.material.dispose();
            }
        }
        while (this.hotspotsGroup.children.length > 0) {
            this.hotspotsGroup.remove(this.hotspotsGroup.children[0]);
        }
        this.segmentsMap.clear();
        this.materialsCache.clear();
        this.hoveredSegment = null;
        this.selectedSegment = null;
    }

    registerSegment(id, mesh, meta, explodeVector, textureType = null) {
        mesh.userData = {
            segmentId: id,
            meta: meta,
            originalPos: mesh.position.clone(),
            explodeVector: explodeVector || mesh.position.clone().normalize().multiplyScalar(1.2)
        };

        const item = {
            id: id,
            mesh: mesh,
            originalPos: mesh.position.clone(),
            explodeVector: mesh.userData.explodeVector,
            meta: meta,
            textureType: textureType,
            originalMaterial: mesh.material,
            visible: true
        };

        this.segmentsMap.set(id, item);
        this.organGroup.add(mesh);

        this.createHotspotPin(item);
    }

    createHotspotPin(item) {
        const pinGroup = new THREE.Group();
        pinGroup.userData = { segmentId: item.id };

        const sphereGeo = new THREE.SphereGeometry(0.045, 16, 16);
        const sphereMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            transparent: true,
            opacity: 0.85
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);

        const ringGeo = new THREE.RingGeometry(0.06, 0.08, 16);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.lookAt(this.camera.position);

        pinGroup.add(sphere);
        pinGroup.add(ring);
        pinGroup.position.copy(item.originalPos);
        pinGroup.visible = this.labelsVisible;

        item.pinGroup = pinGroup;
        this.hotspotsGroup.add(pinGroup);
    }

    /* -------------------------------------------------------------
       1. HUMAN HEART (MATCHING heart_1.jpg & heart_2.jpg SPECIMEN)
       ------------------------------------------------------------- */
    buildHeart() {
        if (!this.isCutawayActive) {
            // EXTERIOR SPECIMEN (MATCHING heart_1.jpg)
            // A. Ventricular Myocardium Cone (Warm orange-red striated muscle)
            const ventGeo = new THREE.CylinderGeometry(0.72, 0.22, 1.55, 32, 24);
            ventGeo.scale(1.15, 1.0, 0.95);
            this.deformHeartMyocardium(ventGeo);
            const ventMat = this.getMaterial('#d94828', 'ventricles_myocardium', 'muscle');
            const ventMesh = new THREE.Mesh(ventGeo, ventMat);
            ventMesh.position.set(-0.08, -0.4, 0.1);
            ventMesh.rotation.z = -0.18;
            this.registerSegment('ventricles_myocardium', ventMesh, {
                name: 'Muscular Ventricles (Myocardium)',
                color: '#d94828'
            }, new THREE.Vector3(-0.9, -0.6, 0.3), 'muscle');

            // B. Epicardial Adipose Fat Pads (Golden yellow fat along grooves)
            const fatGroup = new THREE.Group();
            const fatMat = this.getMaterial('#eab308', 'epicardial_fat', 'fat');

            // Anterior interventricular groove fat pad
            const antFatCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.12, 0.2, 0.45),
                new THREE.Vector3(0.1, -0.15, 0.5),
                new THREE.Vector3(0.04, -0.55, 0.42),
                new THREE.Vector3(-0.05, -0.85, 0.25)
            ]);
            const antFatGeo = new THREE.TubeGeometry(antFatCurve, 20, 0.12, 12, false);
            fatGroup.add(new THREE.Mesh(antFatGeo, fatMat));

            // Atrioventricular sulcus fat collar
            const avFatCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.6, 0.25, 0.0),
                new THREE.Vector3(-0.2, 0.28, 0.45),
                new THREE.Vector3(0.4, 0.22, 0.35),
                new THREE.Vector3(0.65, 0.15, -0.1)
            ]);
            fatGroup.add(new THREE.Mesh(new THREE.TubeGeometry(avFatCurve, 24, 0.1, 12, false), fatMat));
            this.registerSegment('epicardial_fat', fatGroup, {
                name: 'Epicardial Adipose Fat Pads',
                color: '#eab308'
            }, new THREE.Vector3(0.2, -0.1, 1.1), 'fat');

            // C. Coronary Arteries (Red) & Cardiac Veins (Blue) branching network
            const vesselsGroup = new THREE.Group();
            const artMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
            const veinMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.3 });

            // LAD Artery (Left Anterior Descending - Red)
            const ladCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.12, 0.22, 0.47),
                new THREE.Vector3(0.11, -0.1, 0.52),
                new THREE.Vector3(0.06, -0.5, 0.44),
                new THREE.Vector3(-0.04, -0.85, 0.26)
            ]);
            vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ladCurve, 24, 0.038, 8, false), artMat));

            // Great Cardiac Vein (Blue companion)
            const veinCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.06, 0.2, 0.46),
                new THREE.Vector3(0.05, -0.12, 0.51),
                new THREE.Vector3(0.02, -0.48, 0.43)
            ]);
            vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(veinCurve, 16, 0.032, 8, false), veinMat));

            // Fine vascular lateral ramifications
            for (let i = 0; i < 5; i++) {
                const y = 0.1 - i * 0.16;
                const bCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.1, y, 0.5 - i * 0.04),
                    new THREE.Vector3(0.25 + i * 0.04, y - 0.08, 0.4 - i * 0.05),
                    new THREE.Vector3(0.42 + i * 0.03, y - 0.15, 0.28 - i * 0.04)
                ]);
                vesselsGroup.add(new THREE.Mesh(new THREE.TubeGeometry(bCurve, 12, 0.018, 6, false), (i % 2 === 0) ? artMat : veinMat));
            }
            this.registerSegment('coronary_network', vesselsGroup, {
                name: 'Coronary Arteries & Veins',
                color: '#ef4444'
            }, new THREE.Vector3(0.2, -0.2, 1.4));

            // D. Pulmonary Trunk & Arteries (Vibrant anatomical blue trunk crossing anteriorly)
            const ptGroup = new THREE.Group();
            const ptMat = new THREE.MeshStandardMaterial({
                color: 0x1d4ed8,
                roughness: 0.35,
                metalness: 0.1
            });
            const ptCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.15, 0.15, 0.32),
                new THREE.Vector3(0.1, 0.85, 0.24),
                new THREE.Vector3(-0.15, 1.15, 0.05)
            ]);
            ptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(ptCurve, 24, 0.22, 16, false), ptMat));

            // Left & Right Pulmonary artery branches
            const lpaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.15, 1.15, 0.05),
                new THREE.Vector3(-0.65, 1.25, -0.15)
            ]);
            ptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(lpaCurve, 12, 0.16, 12, false), ptMat));

            const rpaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.15, 1.15, 0.05),
                new THREE.Vector3(0.65, 1.1, -0.25)
            ]);
            ptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rpaCurve, 12, 0.16, 12, false), ptMat));
            this.registerSegment('pulmonary_trunk', ptGroup, {
                name: 'Pulmonary Trunk & Arteries',
                color: '#1d4ed8'
            }, new THREE.Vector3(0.3, 1.3, 0.8));

            // E. Ascending Aorta & Arch (Grand red arched arterial trunk)
            const aortaGroup = new THREE.Group();
            const aortaMat = new THREE.MeshStandardMaterial({
                color: 0xe11d48,
                roughness: 0.3,
                metalness: 0.08
            });
            const aortaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.08, 0.3, 0.05),
                new THREE.Vector3(-0.02, 1.05, -0.05),
                new THREE.Vector3(0.02, 1.5, -0.12),
                new THREE.Vector3(-0.48, 1.45, -0.35),
                new THREE.Vector3(-0.45, 0.65, -0.5)
            ]);
            aortaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 32, 0.25, 16, false), aortaMat));

            // 3 Brachiocephalic branch pipes atop arch
            for (let i = 0; i < 3; i++) {
                const bCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-0.35 + i * 0.18, 1.55, -0.25 + i * 0.04),
                    new THREE.Vector3(-0.42 + i * 0.2, 1.95, -0.22 + i * 0.04)
                ]);
                aortaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(bCurve, 10, 0.07, 10, false), aortaMat));
            }
            this.registerSegment('aorta', aortaGroup, {
                name: 'Ascending Aorta & Arch',
                color: '#e11d48'
            }, new THREE.Vector3(-0.2, 1.6, -0.3));

            // F. Superior & Inferior Vena Cava (Blue venous channels)
            const svcGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.5, 16);
            const svcMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35 });
            const svcMesh = new THREE.Mesh(svcGeo, svcMat);
            svcMesh.position.set(0.72, 0.85, -0.35);
            this.registerSegment('vena_cava', svcMesh, {
                name: 'Superior & Inferior Vena Cava',
                color: '#2563eb'
            }, new THREE.Vector3(1.3, 1.1, -0.6));

            // G. Atria & Auricles (Scalloped pale auricular tissue)
            const atriaGroup = new THREE.Group();
            const aurMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.45 });

            // Right Auricle
            const raGeo = new THREE.SphereGeometry(0.48, 16, 16);
            raGeo.scale(0.8, 1.0, 1.1);
            const raMesh = new THREE.Mesh(raGeo, aurMat);
            raMesh.position.set(0.62, 0.42, 0.12);
            atriaGroup.add(raMesh);

            // Left Auricle
            const laGeo = new THREE.SphereGeometry(0.44, 16, 16);
            laGeo.scale(0.8, 1.0, 1.0);
            const laMesh = new THREE.Mesh(laGeo, aurMat);
            laMesh.position.set(-0.58, 0.48, -0.15);
            atriaGroup.add(laMesh);
            this.registerSegment('atria_auricles', atriaGroup, {
                name: 'Left & Right Atria & Auricles',
                color: '#f1f5f9'
            }, new THREE.Vector3(-1.1, 0.7, -0.4));

        } else {
            // CORONAL CUTAWAY DISSECTION MODE (MATCHING heart_2.jpg EXACTLY!)
            // A. Opened Posterior Ventricles Shell with Trabeculae Carneae
            const cavityGeo = new THREE.CylinderGeometry(0.72, 0.22, 1.55, 32, 24, false, Math.PI * 0.5, Math.PI);
            cavityGeo.scale(1.15, 1.0, 0.95);
            const cavityMat = this.getMaterial('#b83218', 'ventricles_myocardium', 'trabeculae');
            const cavityMesh = new THREE.Mesh(cavityGeo, cavityMat);
            cavityMesh.position.set(-0.08, -0.4, 0.1);
            cavityMesh.rotation.z = -0.18;
            this.registerSegment('ventricles_myocardium', cavityMesh, {
                name: 'Ventricular Chamber Walls & Trabeculae',
                color: '#b83218'
            }, new THREE.Vector3(-0.6, -0.5, -0.2), 'trabeculae');

            // B. Interventricular Muscular Septum
            const septumGeo = new THREE.BoxGeometry(0.24, 1.3, 0.6);
            const septumMat = new THREE.MeshStandardMaterial({
                color: 0xc83818,
                roughness: 0.35,
                map: this.proceduralTextures.muscle
            });
            const septumMesh = new THREE.Mesh(septumGeo, septumMat);
            septumMesh.position.set(-0.08, -0.42, 0.05);
            this.registerSegment('epicardial_fat', septumMesh, {
                name: 'Interventricular Septum (Septal Wall)',
                color: '#c83818'
            }, new THREE.Vector3(0, 0, 0.4));

            // C. Heart Valves & Fibrous Chordae Tendineae (Parachute strings like heart_2.jpg!)
            const valveGroup = new THREE.Group();
            const valveMat = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.2,
                metalness: 0.05,
                side: THREE.DoubleSide
            });

            // Left Ventricle Mitral/Bicuspid Valve (White parachute cusps)
            const mitralCuspGeo = new THREE.ConeGeometry(0.22, 0.35, 16, 1, true);
            const mitralMesh = new THREE.Mesh(mitralCuspGeo, valveMat);
            mitralMesh.position.set(-0.35, -0.1, 0.05);
            mitralMesh.rotation.x = Math.PI;
            valveGroup.add(mitralMesh);

            // Chordae Tendineae strings (Mitral)
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const sCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-0.35 + Math.cos(angle) * 0.15, -0.15, 0.05 + Math.sin(angle) * 0.15),
                    new THREE.Vector3(-0.38, -0.55, 0.05)
                ]);
                valveGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sCurve, 8, 0.012, 6, false), valveMat));
            }

            // Right Ventricle Tricuspid Valve
            const triCuspGeo = new THREE.ConeGeometry(0.24, 0.35, 16, 1, true);
            const triMesh = new THREE.Mesh(triCuspGeo, valveMat);
            triMesh.position.set(0.25, -0.1, 0.08);
            triMesh.rotation.x = Math.PI;
            valveGroup.add(triMesh);

            // Chordae Tendineae strings (Tricuspid)
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2;
                const sCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.25 + Math.cos(angle) * 0.16, -0.15, 0.08 + Math.sin(angle) * 0.16),
                    new THREE.Vector3(0.28, -0.52, 0.08)
                ]);
                valveGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sCurve, 8, 0.012, 6, false), valveMat));
            }
            this.registerSegment('heart_valves', valveGroup, {
                name: 'Heart Valves & Chordae Tendineae',
                color: '#ffffff'
            }, new THREE.Vector3(0, 0.2, 0.9));

            // Great vessels staying visible above cut
            const aortaCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.02, 0.8, -0.05),
                new THREE.Vector3(0.02, 1.5, -0.12),
                new THREE.Vector3(-0.48, 1.45, -0.35),
                new THREE.Vector3(-0.45, 0.65, -0.5)
            ]);
            const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 24, 0.25, 16, false), new THREE.MeshStandardMaterial({ color: 0xe11d48 }));
            this.registerSegment('aorta', aortaMesh, { name: 'Aortic Arch', color: '#e11d48' }, new THREE.Vector3(0, 1.2, 0));

            const ptCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.1, 0.65, 0.24),
                new THREE.Vector3(-0.15, 1.15, 0.05)
            ]);
            const ptMesh = new THREE.Mesh(new THREE.TubeGeometry(ptCurve, 16, 0.22, 16, false), new THREE.MeshStandardMaterial({ color: 0x1d4ed8 }));
            this.registerSegment('pulmonary_trunk', ptMesh, { name: 'Pulmonary Trunk', color: '#1d4ed8' }, new THREE.Vector3(0.3, 1.0, 0.5));
        }
    }

    deformHeartMyocardium(geo) {
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i);
            let y = pos.getY(i);
            let z = pos.getZ(i);
            // Anatomical heart curvature: apex curves anterior-leftward
            if (y < 0) {
                x -= Math.pow(-y / 0.8, 1.8) * 0.15;
                z += Math.pow(-y / 0.8, 1.6) * 0.12;
            }
            // Sulcus groove indentation
            if (Math.abs(x) < 0.15 && z > 0.3) {
                z -= 0.06;
            }
            pos.setXYZ(i, x, y, z);
        }
        geo.computeVertexNormals();
    }

    /* -------------------------------------------------------------
       2. FULL HUMAN BODY MULTI-SYSTEM MATRIX (DEFAULT START VIEW!)
       ------------------------------------------------------------- */
    buildFullBody() {
        // Holographic Translucent Human Silhouette Body Chassis
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x0ea5e9,
            roughness: 0.1,
            metalness: 0.1,
            transmission: 0.88,
            transparent: true,
            opacity: 0.25,
            wireframe: false
        });

        // Head / Neurocranium
        const headGeo = new THREE.SphereGeometry(0.5, 24, 24);
        headGeo.scale(0.85, 1.15, 0.95);
        const headMesh = new THREE.Mesh(headGeo, bodyMat);
        headMesh.position.set(0, 2.1, 0);
        this.organGroup.add(headMesh);

        // Neck
        const neckGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.45, 16);
        const neckMesh = new THREE.Mesh(neckGeo, bodyMat);
        neckMesh.position.set(0, 1.55, 0);
        this.organGroup.add(neckMesh);

        // Thorax & Abdomen
        const torsoGeo = new THREE.CylinderGeometry(0.58, 0.45, 1.85, 24);
        torsoGeo.scale(1.25, 1.0, 0.75);
        const torsoMesh = new THREE.Mesh(torsoGeo, bodyMat);
        torsoMesh.position.set(0, 0.72, 0);
        this.organGroup.add(torsoMesh);

        // Pelvis & Lower Trunk
        const pelvisGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.75, 20);
        pelvisGeo.scale(1.15, 1.0, 0.8);
        const pelvisMesh = new THREE.Mesh(pelvisGeo, bodyMat);
        pelvisMesh.position.set(0, -0.55, 0);
        this.organGroup.add(pelvisMesh);

        // Arms & Shoulders outline
        for (let side of [-1, 1]) {
            const armGeo = new THREE.CylinderGeometry(0.14, 0.11, 1.6, 12);
            const armMesh = new THREE.Mesh(armGeo, bodyMat);
            armMesh.position.set(side * 0.95, 0.65, 0);
            armMesh.rotation.z = side * -0.15;
            this.organGroup.add(armMesh);
        }

        // Legs outline
        for (let side of [-1, 1]) {
            const legGeo = new THREE.CylinderGeometry(0.18, 0.13, 2.0, 16);
            const legMesh = new THREE.Mesh(legGeo, bodyMat);
            legMesh.position.set(side * 0.32, -1.8, 0);
            this.organGroup.add(legMesh);
        }

        // INTERNAL ORGANS PLACED IN ANATOMICAL POSITIONS (CLICKABLE JUMP ANCHORS!)
        // 1. Brain in cranium
        const miniBrainGeo = new THREE.SphereGeometry(0.36, 16, 16);
        this.deformBrainGyri(miniBrainGeo, 0.05);
        const mbMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 });
        const mbMesh = new THREE.Mesh(miniBrainGeo, mbMat);
        mbMesh.position.set(0, 2.1, 0.02);
        this.registerSegment('body_brain', mbMesh, {
            name: 'Brain (Encephalon)',
            color: '#38bdf8',
            targetOrgan: 'brain'
        }, new THREE.Vector3(0, 1.5, 0));

        // 2. Thoracic Heart
        const miniHeartGeo = new THREE.SphereGeometry(0.26, 16, 16);
        miniHeartGeo.scale(0.9, 1.15, 0.9);
        const mhMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
        const mhMesh = new THREE.Mesh(miniHeartGeo, mhMat);
        mhMesh.position.set(-0.08, 0.95, 0.08);
        this.registerSegment('body_heart', mhMesh, {
            name: 'Thoracic Heart & Aorta',
            color: '#ef4444',
            targetOrgan: 'heart'
        }, new THREE.Vector3(0, 0.4, 1.4));

        // 3. Bilateral Lungs
        const lungGroup = new THREE.Group();
        const mLungGeo = new THREE.SphereGeometry(0.28, 16, 16);
        mLungGeo.scale(0.85, 1.45, 0.85);
        const mlMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 });
        const rLM = new THREE.Mesh(mLungGeo, mlMat);
        rLM.position.set(0.38, 0.92, 0.0);
        const lLM = new THREE.Mesh(mLungGeo, mlMat);
        lLM.position.set(-0.38, 0.92, 0.0);
        lungGroup.add(rLM);
        lungGroup.add(lLM);
        this.registerSegment('body_lungs', lungGroup, {
            name: 'Pulmonary Lungs',
            color: '#ec4899',
            targetOrgan: 'lungs'
        }, new THREE.Vector3(0, 0.4, -1.3));

        // 4. Hepatic Liver
        const mLiveGeo = new THREE.SphereGeometry(0.34, 16, 16);
        mLiveGeo.scale(1.2, 0.75, 0.85);
        const mLiveMesh = new THREE.Mesh(mLiveGeo, new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.35 }));
        mLiveMesh.position.set(0.35, 0.25, 0.08);
        this.registerSegment('body_liver', mLiveMesh, {
            name: 'Liver (Hepar)',
            color: '#9a3412',
            targetOrgan: 'liver'
        }, new THREE.Vector3(1.3, 0.1, 0.5));

        // 5. Gastric Stomach
        const mStomGeo = new THREE.SphereGeometry(0.25, 16, 16);
        mStomGeo.scale(1.1, 0.9, 0.8);
        const mStomMesh = new THREE.Mesh(mStomGeo, new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35 }));
        mStomMesh.position.set(-0.3, 0.22, 0.05);
        this.registerSegment('body_stomach', mStomMesh, {
            name: 'Stomach (Gaster)',
            color: '#f59e0b',
            targetOrgan: 'stomach'
        }, new THREE.Vector3(-1.3, 0.1, 0.5));

        // 6. Kidneys
        const kidGroup = new THREE.Group();
        const mKidGeo = new THREE.SphereGeometry(0.18, 12, 12);
        mKidGeo.scale(0.8, 1.3, 0.7);
        const kidMat = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.35 });
        const rK = new THREE.Mesh(mKidGeo, kidMat);
        rK.position.set(0.28, -0.15, -0.12);
        const lK = new THREE.Mesh(mKidGeo, kidMat);
        lK.position.set(-0.28, -0.15, -0.12);
        kidGroup.add(rK);
        kidGroup.add(lK);
        this.registerSegment('body_kidneys', kidGroup, {
            name: 'Renal Kidneys',
            color: '#be123c',
            targetOrgan: 'kidney'
        }, new THREE.Vector3(0, -0.4, -1.4));

        // 7. Intestines Complex
        const mIntGeo = new THREE.SphereGeometry(0.35, 16, 16);
        mIntGeo.scale(1.1, 0.9, 0.85);
        const mIntMesh = new THREE.Mesh(mIntGeo, new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4 }));
        mIntMesh.position.set(0, -0.45, 0.06);
        this.registerSegment('body_intestines', mIntMesh, {
            name: 'Intestines Tract',
            color: '#10b981',
            targetOrgan: 'intestines'
        }, new THREE.Vector3(0, -0.8, 1.2));

        // 8. Skeletal Spine & Ribcage
        const spineCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.8, -0.1),
            new THREE.Vector3(0, 0.85, -0.15),
            new THREE.Vector3(0, -0.7, -0.1)
        ]);
        const spineMesh = new THREE.Mesh(new THREE.TubeGeometry(spineCurve, 20, 0.07, 8, false), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 }));
        this.registerSegment('body_skeleton', spineMesh, {
            name: 'Axial Skeletal Chassis',
            color: '#cbd5e1',
            targetOrgan: 'skeleton'
        }, new THREE.Vector3(-1.3, 0, 0));
    }

    /* -------------------------------------------------------------
       3. RESPIRATORY LUNGS ANATOMY
       ------------------------------------------------------------- */
    buildLungs() {
        const tracheaGroup = new THREE.Group();
        const tMat = this.getMaterial('#06d6a0', 'trachea_tree');
        const tCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 1.85, 0), new THREE.Vector3(0, 0.85, 0)]);
        tracheaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(tCurve, 16, 0.17, 16, false), tMat));

        for (let y = 0.95; y <= 1.8; y += 0.12) {
            const rMesh = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 8, 24), tMat);
            rMesh.position.y = y;
            rMesh.rotation.x = Math.PI / 2;
            tracheaGroup.add(rMesh);
        }
        // Bronchi
        const lbCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.85, 0), new THREE.Vector3(-0.65, 0.4, 0.08)]);
        tracheaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(lbCurve, 12, 0.12, 12, false), tMat));
        const rbCurve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0.85, 0), new THREE.Vector3(0.65, 0.45, 0.08)]);
        tracheaGroup.add(new THREE.Mesh(new THREE.TubeGeometry(rbCurve, 12, 0.12, 12, false), tMat));
        this.registerSegment('trachea_tree', tracheaGroup, { name: 'Trachea & Bronchial Tree', color: '#06d6a0' }, new THREE.Vector3(0, 1.4, 0));

        // Right Lung (3 lobes)
        const rLungGeo = new THREE.CylinderGeometry(0.85, 0.95, 1.85, 24);
        rLungGeo.scale(0.95, 1.0, 1.05);
        this.deformOrganGeometry(rLungGeo, 0.08);
        const rLungMesh = new THREE.Mesh(rLungGeo, this.getMaterial('#ec4899', 'right_lung', 'lung'));
        rLungMesh.position.set(1.05, 0.05, 0.0);
        this.registerSegment('right_lung', rLungMesh, { name: 'Right Lung (3 Lobes)', color: '#ec4899' }, new THREE.Vector3(1.5, 0.2, 0.4), 'lung');

        // Left Lung (2 lobes + cardiac notch)
        const lLungGeo = new THREE.CylinderGeometry(0.82, 0.9, 1.8, 24);
        lLungGeo.scale(0.9, 1.0, 1.0);
        this.deformOrganGeometry(lLungGeo, 0.08);
        const lLungMesh = new THREE.Mesh(lLungGeo, this.getMaterial('#f43f5e', 'left_lung', 'lung'));
        lLungMesh.position.set(-1.05, 0.0, 0.0);
        this.registerSegment('left_lung', lLungMesh, { name: 'Left Lung & Cardiac Notch', color: '#f43f5e' }, new THREE.Vector3(-1.5, 0.2, 0.4), 'lung');

        // Diaphragm
        const diaGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.35, 32);
        const diaMesh = new THREE.Mesh(diaGeo, this.getMaterial('#8b5cf6', 'diaphragm'));
        diaMesh.position.set(0, -1.5, 0);
        this.registerSegment('diaphragm', diaMesh, { name: 'Muscular Diaphragm Base', color: '#8b5cf6' }, new THREE.Vector3(0, -1.6, 0));
    }

    /* -------------------------------------------------------------
       4. HUMAN BRAIN & ENCEPHALON
       ------------------------------------------------------------- */
    buildBrain() {
        const ctxGeo = new THREE.SphereGeometry(1.05, 32, 32);
        ctxGeo.scale(1.15, 0.92, 1.25);
        this.deformBrainGyri(ctxGeo, 0.09);
        const ctxMesh = new THREE.Mesh(ctxGeo, this.getMaterial('#38bdf8', 'cerebral_cortex'));
        ctxMesh.position.set(0, 0.42, 0.1);
        this.registerSegment('cerebral_cortex', ctxMesh, { name: 'Cerebral Hemispheres (Gyri & Sulci)', color: '#38bdf8' }, new THREE.Vector3(0, 1.1, 0.8));

        // Cerebellum
        const cerGeo = new THREE.SphereGeometry(0.68, 24, 24);
        cerGeo.scale(1.2, 0.7, 0.85);
        const cerMesh = new THREE.Mesh(cerGeo, this.getMaterial('#10b981', 'cerebellum'));
        cerMesh.position.set(0, -0.72, -0.75);
        this.registerSegment('cerebellum', cerMesh, { name: 'Cerebellum (Folia)', color: '#10b981' }, new THREE.Vector3(0, -1.1, -1.2));

        // Brainstem
        const bsGeo = new THREE.CylinderGeometry(0.24, 0.16, 1.3, 16);
        const bsMesh = new THREE.Mesh(bsGeo, this.getMaterial('#f59e0b', 'brainstem'));
        bsMesh.position.set(0, -1.1, -0.15);
        this.registerSegment('brainstem', bsMesh, { name: 'Brainstem (Pons & Medulla)', color: '#f59e0b' }, new THREE.Vector3(0, -1.5, 0.2));
    }

    /* -------------------------------------------------------------
       5. HUMAN EYE (OCULAR GLOBE)
       ------------------------------------------------------------- */
    buildEye() {
        // Sclera & Retina globe
        const eyeGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const eyeMesh = new THREE.Mesh(eyeGeo, this.getMaterial('#f1f5f9', 'sclera_retina'));
        this.registerSegment('sclera_retina', eyeMesh, { name: 'Sclera Shell & Retina', color: '#f1f5f9' }, new THREE.Vector3(0, 0, -0.4));

        // Cornea
        const cGeo = new THREE.SphereGeometry(0.82, 32, 16, 0, Math.PI * 2, 0, 0.7);
        const cMat = new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, transmission: 0.95, roughness: 0.05, transparent: true });
        const cMesh = new THREE.Mesh(cGeo, cMat);
        cMesh.position.set(0, 0, 0.78);
        this.registerSegment('cornea', cMesh, { name: 'Cornea Window', color: '#00f0ff' }, new THREE.Vector3(0, 0, 1.6));

        // Iris
        const irisMesh = new THREE.Mesh(new THREE.RingGeometry(0.28, 0.78, 32), this.getMaterial('#14b8a6', 'iris_pupil'));
        irisMesh.position.set(0, 0, 0.65);
        this.registerSegment('iris_pupil', irisMesh, { name: 'Iris & Pupil', color: '#14b8a6' }, new THREE.Vector3(0, 0, 1.1));

        // Lens
        const lensGeo = new THREE.SphereGeometry(0.55, 32, 16);
        lensGeo.scale(1, 1, 0.4);
        const lensMesh = new THREE.Mesh(lensGeo, new THREE.MeshPhysicalMaterial({ color: 0xa5f3fc, transmission: 0.9, roughness: 0.08 }));
        lensMesh.position.set(0, 0, 0.42);
        this.registerSegment('lens', lensMesh, { name: 'Crystalline Lens', color: '#a5f3fc' }, new THREE.Vector3(0, 0, 0.7));
    }

    /* -------------------------------------------------------------
       6. KIDNEYS & ADRENALS
       ------------------------------------------------------------- */
    buildKidneys() {
        // Renal Parenchyma (Cortex)
        const kGeo = new THREE.SphereGeometry(0.9, 24, 24);
        kGeo.scale(0.85, 1.45, 0.65);
        this.deformBeanKidney(kGeo);
        const kMesh = new THREE.Mesh(kGeo, this.getMaterial('#be123c', 'renal_parenchyma'));
        kMesh.position.set(0.65, 0.1, 0.0);
        this.registerSegment('renal_parenchyma', kMesh, { name: 'Renal Cortex & Glomeruli', color: '#be123c' }, new THREE.Vector3(1.3, 0.2, 0.4));

        // Medulla & Pelvis
        const medGeo = new THREE.ConeGeometry(0.45, 0.75, 16);
        const medMesh = new THREE.Mesh(medGeo, this.getMaterial('#881337', 'renal_medulla_pelvis'));
        medMesh.position.set(0.35, 0.05, 0.0);
        medMesh.rotation.z = Math.PI / 2;
        this.registerSegment('renal_medulla_pelvis', medMesh, { name: 'Medullary Pyramids & Pelvis', color: '#881337' }, new THREE.Vector3(0.9, 0.1, -0.5));

        // Adrenal Gland
        const adrGeo = new THREE.ConeGeometry(0.45, 0.55, 16);
        adrGeo.scale(1.2, 0.6, 0.7);
        const adrMesh = new THREE.Mesh(adrGeo, this.getMaterial('#eab308', 'adrenal_glands', 'fat'));
        adrMesh.position.set(0.55, 1.25, 0.0);
        adrMesh.rotation.z = -0.3;
        this.registerSegment('adrenal_glands', adrMesh, { name: 'Suprarenal Adrenal Gland', color: '#eab308' }, new THREE.Vector3(0.9, 1.5, 0.2), 'fat');

        // Vessels & Ureter
        const vGroup = new THREE.Group();
        vGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.85, 12), new THREE.MeshStandardMaterial({ color: 0xdc2626 })));
        vGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.85, 12), new THREE.MeshStandardMaterial({ color: 0x2563eb })));
        this.registerSegment('renal_vessels_ureter', vGroup, { name: 'Renal Pedicle & Ureter', color: '#dc2626' }, new THREE.Vector3(-0.9, 0.3, 0.3));
    }

    /* -------------------------------------------------------------
       7. LIVER & GALLBLADDER
       ------------------------------------------------------------- */
    buildLiver() {
        // Right Lobe
        const rGeo = new THREE.SphereGeometry(1.1, 24, 24);
        rGeo.scale(1.2, 0.85, 0.95);
        this.deformOrganGeometry(rGeo, 0.07);
        const rMesh = new THREE.Mesh(rGeo, this.getMaterial('#9a3412', 'right_hepatic_lobe'));
        rMesh.position.set(0.45, 0.05, 0.05);
        this.registerSegment('right_hepatic_lobe', rMesh, { name: 'Right Hepatic Lobe', color: '#9a3412' }, new THREE.Vector3(1.2, 0.2, 0.3));

        // Left Lobe
        const lGeo = new THREE.SphereGeometry(0.85, 20, 20);
        lGeo.scale(1.0, 0.75, 0.8);
        this.deformOrganGeometry(lGeo, 0.06);
        const lMesh = new THREE.Mesh(lGeo, this.getMaterial('#7c2d12', 'left_hepatic_lobe'));
        lMesh.position.set(-0.65, 0.15, 0.1);
        this.registerSegment('left_hepatic_lobe', lMesh, { name: 'Left Hepatic Lobe', color: '#7c2d12' }, new THREE.Vector3(-1.2, 0.2, 0.3));

        // Gallbladder (Emerald Green!)
        const gbGeo = new THREE.SphereGeometry(0.35, 16, 16);
        gbGeo.scale(0.7, 1.3, 0.7);
        const gbMesh = new THREE.Mesh(gbGeo, this.getMaterial('#10b981', 'gallbladder_biliary'));
        gbMesh.position.set(0.25, -0.65, 0.35);
        gbMesh.rotation.z = 0.25;
        this.registerSegment('gallbladder_biliary', gbMesh, { name: 'Gallbladder & Bile Ducts', color: '#10b981' }, new THREE.Vector3(0.5, -1.2, 0.8));

        // Portal Triad
        const ptGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 12);
        const ptMesh = new THREE.Mesh(ptGeo, this.getMaterial('#1d4ed8', 'hepatic_portal_triad'));
        ptMesh.position.set(-0.05, -0.55, -0.2);
        this.registerSegment('hepatic_portal_triad', ptMesh, { name: 'Hepatic Portal Triad', color: '#1d4ed8' }, new THREE.Vector3(0, -1.0, -0.6));
    }

    /* -------------------------------------------------------------
       8. STOMACH & GASTRIC RUGAE
       ------------------------------------------------------------- */
    buildStomach() {
        const stomCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.35, 0.9, -0.1),
            new THREE.Vector3(-0.5, 0.55, 0.05),
            new THREE.Vector3(-0.4, -0.2, 0.15),
            new THREE.Vector3(0.1, -0.45, 0.15),
            new THREE.Vector3(0.65, -0.35, 0.1)
        ]);
        const stomGeo = new THREE.TubeGeometry(stomCurve, 32, 0.45, 20, false);
        this.deformOrganGeometry(stomGeo, 0.05);
        const stomMesh = new THREE.Mesh(stomGeo, this.getMaterial('#f59e0b', 'fundus_body'));
        this.registerSegment('fundus_body', stomMesh, { name: 'Gastric Fundus & Body', color: '#f59e0b' }, new THREE.Vector3(0, 0.8, 0.5));

        const curvMesh = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.15, 12, 24, Math.PI), this.getMaterial('#ea580c', 'greater_lesser_curvature'));
        curvMesh.position.set(-0.1, -0.15, 0.1);
        curvMesh.rotation.z = Math.PI / 2;
        this.registerSegment('greater_lesser_curvature', curvMesh, { name: 'Greater & Lesser Curvatures', color: '#ea580c' }, new THREE.Vector3(-0.8, -0.6, 0.4));

        const pylGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16);
        const pylMesh = new THREE.Mesh(pylGeo, this.getMaterial('#d97706', 'pylorus_antrum'));
        pylMesh.position.set(0.65, -0.35, 0.1);
        pylMesh.rotation.z = Math.PI / 3;
        this.registerSegment('pylorus_antrum', pylMesh, { name: 'Pyloric Antrum & Sphincter', color: '#d97706' }, new THREE.Vector3(1.2, -0.6, 0.3));

        const cardGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.6, 16);
        const cardMesh = new THREE.Mesh(cardGeo, this.getMaterial('#fb7185', 'esophageal_junction'));
        cardMesh.position.set(-0.35, 1.1, -0.1);
        this.registerSegment('esophageal_junction', cardMesh, { name: 'Cardia & Lower Esophageal Junction', color: '#fb7185' }, new THREE.Vector3(-0.8, 1.3, -0.2));
    }

    /* -------------------------------------------------------------
       9. INTESTINES (ENTERIC TRACT)
       ------------------------------------------------------------- */
    buildIntestines() {
        // Small intestine coils
        const siGroup = new THREE.Group();
        const siMat = this.getMaterial('#fb923c', 'small_intestine_coils');
        for (let i = 0; i < 7; i++) {
            const loopGeo = new THREE.TorusGeometry(0.45 + (i % 2) * 0.15, 0.12, 10, 24);
            const loopMesh = new THREE.Mesh(loopGeo, siMat);
            loopMesh.position.set((i % 3 - 1) * 0.22, -0.2 + (i * 0.08), (i % 2) * 0.1);
            loopMesh.rotation.x = Math.PI / 4 + i * 0.3;
            siGroup.add(loopMesh);
        }
        this.registerSegment('small_intestine_coils', siGroup, { name: 'Small Intestine (Jejunum/Ileum)', color: '#fb923c' }, new THREE.Vector3(0, 0, 1.2));

        // Large Colon (Ascending, Transverse, Descending)
        const colonCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.9, -0.85, 0.15),
            new THREE.Vector3(0.95, 0.45, 0.1),
            new THREE.Vector3(0, 0.6, 0.12),
            new THREE.Vector3(-0.95, 0.45, 0.1),
            new THREE.Vector3(-0.9, -0.85, 0.1)
        ]);
        const colonGeo = new THREE.TubeGeometry(colonCurve, 32, 0.22, 16, false);
        const colonMesh = new THREE.Mesh(colonGeo, this.getMaterial('#10b981', 'ascending_transverse_colon'));
        this.registerSegment('ascending_transverse_colon', colonMesh, { name: 'Large Colon (Haustra)', color: '#10b981' }, new THREE.Vector3(0, 1.1, 0.4));

        // Cecum & Appendix
        const apGeo = new THREE.CylinderGeometry(0.06, 0.04, 0.45, 12);
        const apMesh = new THREE.Mesh(apGeo, this.getMaterial('#e11d48', 'cecum_appendix'));
        apMesh.position.set(0.95, -1.05, 0.18);
        apMesh.rotation.z = -0.4;
        this.registerSegment('cecum_appendix', apMesh, { name: 'Cecum & Vermiform Appendix', color: '#e11d48' }, new THREE.Vector3(1.3, -1.3, 0.3));

        // Sigmoid & Rectum
        const sigCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.9, -0.85, 0.1),
            new THREE.Vector3(-0.45, -1.15, -0.05),
            new THREE.Vector3(0, -1.45, -0.1)
        ]);
        const sigMesh = new THREE.Mesh(new THREE.TubeGeometry(sigCurve, 16, 0.2, 12, false), this.getMaterial('#059669', 'rectum_sigmoid'));
        this.registerSegment('rectum_sigmoid', sigMesh, { name: 'Sigmoid Colon & Rectum', color: '#059669' }, new THREE.Vector3(-0.6, -1.5, -0.3));
    }

    /* -------------------------------------------------------------
       10. PANCREAS & SPLEEN
       ------------------------------------------------------------- */
    buildPancreasSpleen() {
        const pancGeo = new THREE.CylinderGeometry(0.18, 0.08, 1.5, 16);
        pancGeo.scale(1.2, 1.0, 0.6);
        const pancMesh = new THREE.Mesh(pancGeo, this.getMaterial('#facc15', 'pancreas_head_body'));
        pancMesh.position.set(0.15, 0.05, 0.05);
        pancMesh.rotation.z = Math.PI / 2.3;
        this.registerSegment('pancreas_head_body', pancMesh, { name: 'Pancreas (Head, Body & Tail)', color: '#facc15' }, new THREE.Vector3(0.5, 0.5, 0.4));

        const spGeo = new THREE.SphereGeometry(0.55, 20, 20);
        spGeo.scale(0.85, 1.15, 0.75);
        this.deformOrganGeometry(spGeo, 0.06);
        const spMesh = new THREE.Mesh(spGeo, this.getMaterial('#881337', 'spleen_lymphoid'));
        spMesh.position.set(-1.05, 0.35, -0.2);
        this.registerSegment('spleen_lymphoid', spMesh, { name: 'Spleen (Red & White Pulp)', color: '#881337' }, new THREE.Vector3(-1.3, 0.5, -0.4));

        const duoMesh = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.15, 12, 24, Math.PI * 1.3), this.getMaterial('#fb923c', 'duodenal_loop'));
        duoMesh.position.set(0.85, -0.15, 0.15);
        duoMesh.rotation.z = Math.PI;
        this.registerSegment('duodenal_loop', duoMesh, { name: 'Duodenal C-Loop', color: '#fb923c' }, new THREE.Vector3(1.2, -0.5, 0.3));
    }

    /* -------------------------------------------------------------
       11. URINARY BLADDER
       ------------------------------------------------------------- */
    buildBladder() {
        const bladGeo = new THREE.SphereGeometry(0.85, 24, 24);
        bladGeo.scale(1.15, 1.1, 1.05);
        this.deformOrganGeometry(bladGeo, 0.05);
        const bladMesh = new THREE.Mesh(bladGeo, this.getMaterial('#f43f5e', 'detrusor_body'));
        bladMesh.position.set(0, 0.15, 0.05);
        this.registerSegment('detrusor_body', bladMesh, { name: 'Detrusor Muscle Dome', color: '#f43f5e' }, new THREE.Vector3(0, 0.8, 0.2));

        const trigGeo = new THREE.ConeGeometry(0.45, 0.55, 16);
        const trigMesh = new THREE.Mesh(trigGeo, this.getMaterial('#fbbf24', 'trigone_neck'));
        trigMesh.position.set(0, -0.45, 0.15);
        trigMesh.rotation.x = Math.PI;
        this.registerSegment('trigone_neck', trigMesh, { name: 'Bladder Trigone & Internal Neck', color: '#fbbf24' }, new THREE.Vector3(0, -0.8, 0.5));

        const ureterGroup = new THREE.Group();
        const uMat = this.getMaterial('#f8fafc', 'ureters_inflow');
        ureterGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 12), uMat));
        ureterGroup.position.set(0, 0.55, -0.25);
        this.registerSegment('ureters_inflow', ureterGroup, { name: 'Bilateral Ureteral Inflows', color: '#f8fafc' }, new THREE.Vector3(0, 1.2, -0.6));
    }

    /* -------------------------------------------------------------
       12. SKELETAL SPINE & RIBCAGE
       ------------------------------------------------------------- */
    buildSkeleton() {
        // Articulated Vertebral Column & Discs
        const vertGroup = new THREE.Group();
        const boneMat = this.getMaterial('#e2e8f0', 'vertebral_column', 'bone');
        for (let y = -1.2; y <= 1.5; y += 0.16) {
            const vMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.11, 16), boneMat);
            vMesh.position.set(0, y, Math.sin((y + 1.2) * 1.5) * 0.12 - 0.25);
            vertGroup.add(vMesh);
        }
        this.registerSegment('vertebral_column', vertGroup, { name: 'Articulated Vertebral Column', color: '#e2e8f0' }, new THREE.Vector3(0, 0, -1.2), 'bone');

        // Ribcage arches
        const ribGroup = new THREE.Group();
        const ribMat = this.getMaterial('#cbd5e1', 'ribcage_cage', 'bone');
        for (let i = 0; i < 10; i++) {
            const y = 1.1 - i * 0.16;
            const radius = 0.65 + Math.sin((i / 9) * Math.PI) * 0.45;
            const ribMesh = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.04, 8, 24, Math.PI * 1.6), ribMat);
            ribMesh.position.set(0, y, 0.05);
            ribMesh.rotation.x = Math.PI / 2.3;
            ribMesh.rotation.z = Math.PI * 0.2;
            ribGroup.add(ribMesh);
        }
        this.registerSegment('ribcage_cage', ribGroup, { name: 'Thoracic Ribcage (12 Costal Pairs)', color: '#cbd5e1' }, new THREE.Vector3(0, 0.4, 0.8), 'bone');

        // Sternum
        const stGeo = new THREE.BoxGeometry(0.18, 1.15, 0.08);
        const stMesh = new THREE.Mesh(stGeo, this.getMaterial('#94a3b8', 'sternum_manubrium', 'bone'));
        stMesh.position.set(0, 0.65, 0.65);
        this.registerSegment('sternum_manubrium', stMesh, { name: 'Sternum & Manubrium', color: '#94a3b8' }, new THREE.Vector3(0, 0.8, 1.4), 'bone');

        // Pelvic Girdle Basin
        const pelvGeo = new THREE.TorusGeometry(0.85, 0.22, 12, 24, Math.PI * 1.4);
        const pelvMesh = new THREE.Mesh(pelvGeo, this.getMaterial('#cbd5e1', 'pelvic_girdle', 'bone'));
        pelvMesh.position.set(0, -1.15, -0.05);
        pelvMesh.rotation.x = Math.PI / 2.2;
        pelvMesh.rotation.z = Math.PI * 0.3;
        this.registerSegment('pelvic_girdle', pelvMesh, { name: 'Pelvic Girdle Basin', color: '#cbd5e1' }, new THREE.Vector3(0, -1.3, 0), 'bone');
    }

    /* -------------------------------------------------------------
       GEOMETRY DEFORMATION UTILITIES
       ------------------------------------------------------------- */
    deformOrganGeometry(geo, intensity) {
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const noise = Math.sin(x * 3.5) * Math.cos(y * 4.0) * Math.sin(z * 3.0);
            pos.setXYZ(i, x + noise * intensity, y + noise * intensity * 0.8, z + noise * intensity);
        }
        geo.computeVertexNormals();
    }

    deformBrainGyri(geo, intensity) {
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            const gyri = Math.sin(x * 12.0) * Math.cos(y * 12.0) + Math.sin(z * 10.0);
            pos.setXYZ(i, x + gyri * intensity * 0.45, y + gyri * intensity * 0.45, z + gyri * intensity * 0.45);
        }
        geo.computeVertexNormals();
    }

    deformBeanKidney(geo) {
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            let x = pos.getX(i);
            let y = pos.getY(i);
            let z = pos.getZ(i);
            if (x < 0) x *= 0.65;
            pos.setXYZ(i, x, y, z);
        }
        geo.computeVertexNormals();
    }

    /* -------------------------------------------------------------
       CORONAL CUTAWAY & EXPLODED SEGMENTATION INTERPOLATION
       ------------------------------------------------------------- */
    toggleCutaway() {
        this.isCutawayActive = !this.isCutawayActive;
        this.loadOrgan(this.currentOrganId);
        return this.isCutawayActive;
    }

    setExplode(ratio) {
        this.explodeDistance = Math.max(0, Math.min(1, ratio));

        this.segmentsMap.forEach((item) => {
            const targetPos = item.originalPos.clone().add(
                item.explodeVector.clone().multiplyScalar(this.explodeDistance)
            );
            item.mesh.position.copy(targetPos);
            if (item.pinGroup) item.pinGroup.position.copy(targetPos);
        });

        const display = document.getElementById('explodeValueDisplay');
        if (display) display.textContent = `${Math.round(this.explodeDistance * 100)}%`;

        const slider = document.getElementById('explodeSlider');
        if (slider && Number(slider.value) !== Math.round(this.explodeDistance * 100)) {
            slider.value = Math.round(this.explodeDistance * 100);
        }
    }

    toggleExplode() {
        this.isExploded = !this.isExploded;
        const target = this.isExploded ? 0.75 : 0.0;

        new TWEEN.Tween({ d: this.explodeDistance })
            .to({ d: target }, 600)
            .easing(TWEEN.Easing.Cubic.Out)
            .onUpdate((obj) => this.setExplode(obj.d))
            .start();

        const statusLabel = document.getElementById('explodeStatus');
        const btn = document.getElementById('explodeToggleBtn');
        if (statusLabel) statusLabel.textContent = this.isExploded ? 'ON' : 'OFF';
        if (btn) btn.classList.toggle('active', this.isExploded);
    }

    setSegmentVisibility(segmentId, visible) {
        const item = this.segmentsMap.get(segmentId);
        if (item) {
            item.visible = visible;
            item.mesh.visible = visible;
            if (item.pinGroup) item.pinGroup.visible = visible && this.labelsVisible;
        }
    }

    showAllSegments() {
        this.segmentsMap.forEach((item) => {
            item.visible = true;
            item.mesh.visible = true;
            if (item.pinGroup) item.pinGroup.visible = this.labelsVisible;
        });
    }

    isolateSegment(segmentId) {
        this.segmentsMap.forEach((item, id) => {
            const isMatch = (id === segmentId);
            item.visible = isMatch;
            item.mesh.visible = isMatch;
            if (item.pinGroup) item.pinGroup.visible = isMatch && this.labelsVisible;
        });
    }

    /* -------------------------------------------------------------
       INTERACTION & RAYCASTING (CLICK ZOOMING & ISOLATION)
       ------------------------------------------------------------- */
    initEventListeners() {
        window.addEventListener('resize', () => this.onWindowResize());
        this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.renderer.domElement.addEventListener('click', (e) => this.onCanvasClick(e));
    }

    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    onPointerMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycastCheck();
    }

    raycastCheck() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = [];
        this.segmentsMap.forEach((item) => {
            if (item.visible) {
                if (item.mesh.isGroup) item.mesh.traverse((c) => { if (c.isMesh) meshes.push(c); });
                else meshes.push(item.mesh);
            }
        });

        const intersects = this.raycaster.intersectObjects(meshes, false);
        if (intersects.length > 0) {
            let hit = intersects[0].object;
            while (hit.parent && hit.parent !== this.organGroup && !hit.userData.segmentId) {
                hit = hit.parent;
            }
            const segId = hit.userData.segmentId;
            if (segId && this.hoveredSegment !== segId) {
                this.hoveredSegment = segId;
                this.renderer.domElement.style.cursor = 'pointer';
                window.dispatchEvent(new CustomEvent('segmentHovered', { detail: { segmentId: segId } }));
            }
        } else {
            if (this.hoveredSegment) {
                window.dispatchEvent(new CustomEvent('segmentUnhovered', { detail: { segmentId: this.hoveredSegment } }));
                this.hoveredSegment = null;
                this.renderer.domElement.style.cursor = 'default';
            }
        }
    }

    onCanvasClick(event) {
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Check hotspot pin click
        const pinSpheres = [];
        this.hotspotsGroup.traverse((c) => {
            if (c.isMesh && c.parent && c.parent.userData.segmentId) pinSpheres.push(c);
        });
        const pinHits = this.raycaster.intersectObjects(pinSpheres);
        if (pinHits.length > 0) {
            const segId = pinHits[0].object.parent.userData.segmentId;
            this.selectSegment(segId, event);
            return;
        }

        // Check mesh click
        const meshes = [];
        this.segmentsMap.forEach((item) => {
            if (item.visible) {
                if (item.mesh.isGroup) item.mesh.traverse(c => { if (c.isMesh) meshes.push(c); });
                else meshes.push(item.mesh);
            }
        });

        const hits = this.raycaster.intersectObjects(meshes, false);
        if (hits.length > 0) {
            let hit = hits[0].object;
            while (hit.parent && hit.parent !== this.organGroup && !hit.userData.segmentId) {
                hit = hit.parent;
            }
            if (hit.userData.segmentId) {
                this.selectSegment(hit.userData.segmentId, event);
            }
        }
    }

    selectSegment(segmentId, clickEvent) {
        this.selectedSegment = segmentId;
        const item = this.segmentsMap.get(segmentId);
        if (!item) return;

        // If clicked in Full Body view, check if this segment points to a detailed organ!
        if (this.currentOrganId === 'full_body' && item.meta.targetOrgan) {
            const targetOrgan = item.meta.targetOrgan;
            // Cinematic zoom transition to that organ!
            const worldPos = new THREE.Vector3();
            item.mesh.getWorldPosition(worldPos);

            new TWEEN.Tween(this.camera.position)
                .to({ x: worldPos.x, y: worldPos.y, z: worldPos.z + 1.8 }, 600)
                .easing(TWEEN.Easing.Cubic.Out)
                .onComplete(() => {
                    if (window.uiController) {
                        window.uiController.switchOrgan(targetOrgan);
                    } else {
                        this.loadOrgan(targetOrgan);
                    }
                })
                .start();
            return;
        }

        window.dispatchEvent(new CustomEvent('segmentSelected', {
            detail: {
                segmentId: segmentId,
                meta: item.meta,
                clientX: clickEvent ? clickEvent.clientX : null,
                clientY: clickEvent ? clickEvent.clientY : null
            }
        }));

        // Camera focus toward clicked segment
        const worldPos = new THREE.Vector3();
        item.mesh.getWorldPosition(worldPos);

        new TWEEN.Tween(this.controls.target)
            .to({ x: worldPos.x * 0.4, y: worldPos.y * 0.4, z: worldPos.z * 0.4 }, 500)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    /* -------------------------------------------------------------
       CAMERA UTILITIES
       ------------------------------------------------------------- */
    resetCamera() {
        const isBody = (this.currentOrganId === 'full_body');
        const targetPos = isBody ? { x: 0, y: 0.6, z: 6.0 } : { x: 0, y: 0.4, z: 4.8 };
        const targetLook = isBody ? { x: 0, y: 0.3, z: 0 } : { x: 0, y: 0, z: 0 };

        new TWEEN.Tween(this.camera.position)
            .to(targetPos, 700)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        new TWEEN.Tween(this.controls.target)
            .to(targetLook, 700)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    toggleAutoRotate() {
        this.autoRotateEnabled = !this.autoRotateEnabled;
        this.controls.autoRotate = this.autoRotateEnabled;
        this.controls.autoRotateSpeed = 2.0;
        return this.autoRotateEnabled;
    }

    toggleLabels() {
        this.labelsVisible = !this.labelsVisible;
        this.hotspotsGroup.children.forEach(hs => { hs.visible = this.labelsVisible; });
        return this.labelsVisible;
    }

    toggleSlicePlane() {
        this.isSliceActive = !this.isSliceActive;
        this.setRenderMode(this.renderMode);
        return this.isSliceActive;
    }

    captureSnapshot() {
        this.renderer.render(this.scene, this.camera);
        const dataUrl = this.renderer.domElement.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `Bio3D_${this.currentOrganId}_${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
    }

    /* -------------------------------------------------------------
       ANIMATION LOOP & PHYSIOLOGICAL SIMULATIONS
       ------------------------------------------------------------- */
    animate() {
        requestAnimationFrame(() => this.animate());

        TWEEN.update();
        this.controls.update();

        const time = this.clock.getElapsedTime();

        if (this.dustParticles) {
            this.dustParticles.rotation.y = time * 0.025;
        }

        if (this.vitalMotionEnabled) {
            if (this.currentOrganId === 'heart') {
                // Cardiac lub-dub rhythmic contraction & twist
                const beatPhase = (time * 1.25) % 1.0;
                let scalePulse = 1.0;
                if (beatPhase < 0.15) {
                    scalePulse = 1.0 + Math.sin(beatPhase / 0.15 * Math.PI) * 0.06;
                } else if (beatPhase > 0.18 && beatPhase < 0.32) {
                    scalePulse = 1.0 + Math.sin((beatPhase - 0.18) / 0.14 * Math.PI) * 0.035;
                }
                this.organGroup.scale.set(scalePulse, scalePulse * 1.02, scalePulse);
            } else if (this.currentOrganId === 'lungs') {
                // Respiratory breathing expansion
                const breathCycle = Math.sin(time * 1.4) * 0.5 + 0.5;
                const breathExpansion = 1.0 + breathCycle * 0.065;
                this.organGroup.scale.set(breathExpansion, 1.0 + breathCycle * 0.08, breathExpansion);
            } else if (this.currentOrganId === 'brain') {
                // Neural electrical ripple
                const neuralGlow = Math.sin(time * 2.8) * 0.015;
                this.organGroup.scale.set(1.0 + neuralGlow, 1.0 + neuralGlow, 1.0 + neuralGlow);
            } else {
                this.organGroup.scale.set(1, 1, 1);
            }
        } else {
            this.organGroup.scale.set(1, 1, 1);
        }

        this.hotspotsGroup.children.forEach(hs => {
            if (hs.children[1]) hs.children[1].lookAt(this.camera.position);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

window.anatomyViewer = null;
window.addEventListener('DOMContentLoaded', () => {
    window.anatomyViewer = new AnatomyViewer('canvasContainer');
});
