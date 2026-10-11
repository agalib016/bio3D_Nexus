/**
 * BIO3D NEXUS - Interactive Realistic 3D Anatomical Organ Engine
 * Inspired by museum-grade medical specimens & Sketchfab Doctor Jana (@docjana)
 * Powered by Three.js & TWEEN.js
 * 
 * Features:
 * - High-fidelity authentic 3D organ sculpts (Heart, Brain, Lungs, Liver, Kidneys, Stomach, Skeleton, Eye, Full Body)
 * - Photorealistic PBR materials with normal maps, wet organ clearcoat sheen, and tissue striations
 * - Internal coronal dissection & chamber cutaway (heart valves, trabeculae carneae, chordae tendineae)
 * - Rhythmic physiological vital motions (Lub-Dub cardiac beat, respiratory tidal expansion)
 * - Interactive multi-system human matrix with clickable cinematic zoom anchors
 * - Real-time medical rendering modes (Realistic Specimen, X-Ray, Hologram, Glass, Wireframe)
 */

class AnatomyViewer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentOrganId = 'full_body';
        this.renderMode = 'realistic'; // realistic, xray, hologram, wireframe, glass
        this.explodeDistance = 0.0;
        this.isExploded = false;
        this.isCutawayActive = false; // Coronal dissection toggle (matching heart_2.jpg & heart_3.mp4)
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

        // Clipping Plane (Coronal Section / Dissection Tool)
        this.clippingPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.15);
        this.heartCutPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.08);

        // GLTF Loader, DRACO Loader & Model Cache
        this.gltfLoader = (typeof THREE.GLTFLoader !== 'undefined') ? new THREE.GLTFLoader() : null;
        if (this.gltfLoader && typeof THREE.DRACOLoader !== 'undefined') {
            const dracoLoader = new THREE.DRACOLoader();
            dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');
            this.gltfLoader.setDRACOLoader(dracoLoader);
        }
        this.modelCache = new Map();

        // Procedural Textures & Materials Cache
        this.proceduralTextures = {};
        this.materialsCache = new Map();

        // Organ Model Configuration Registry
        this.modelConfigs = {
            heart: {
                url: '/static/models/heart.glb',
                targetScale: 2.9,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'ventricles_myocardium', name: 'Muscular Ventricles (Myocardium)', color: '#d94828', pos: [-0.08, -0.4, 0.2], explode: [-0.9, -0.6, 0.3] },
                    { id: 'epicardial_fat', name: 'Epicardial Adipose Tissue (Fat Pads)', color: '#eab308', pos: [0.1, -0.15, 0.55], explode: [0.2, -0.1, 1.1] },
                    { id: 'coronary_network', name: 'Coronary Arteries & Cardiac Veins', color: '#ef4444', pos: [0.12, 0.22, 0.52], explode: [0.2, -0.2, 1.4] },
                    { id: 'pulmonary_trunk', name: 'Pulmonary Trunk & Arteries', color: '#1d4ed8', pos: [0.1, 0.85, 0.32], explode: [0.3, 1.3, 0.8] },
                    { id: 'aorta', name: 'Ascending Aorta & Aortic Arch', color: '#e11d48', pos: [-0.05, 1.25, -0.1], explode: [-0.2, 1.6, -0.3] },
                    { id: 'vena_cava', name: 'Superior & Inferior Vena Cava', color: '#2563eb', pos: [0.72, 0.85, -0.35], explode: [1.3, 1.1, -0.6] },
                    { id: 'atria_auricles', name: 'Left & Right Atria & Auricles', color: '#f1f5f9', pos: [0.62, 0.42, 0.15], explode: [-1.1, 0.7, -0.4] },
                    { id: 'heart_valves', name: 'Heart Valves & Chordae Tendineae', color: '#ffffff', pos: [-0.05, -0.1, 0.15], explode: [0, 0.3, 1.2] }
                ]
            },
            brain: {
                url: '/static/models/brain.glb',
                targetScale: 2.7,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'cerebral_cortex', name: 'Cerebral Hemispheres (Gyri & Sulci)', color: '#38bdf8', pos: [0, 0.45, 0.1], explode: [0, 1.1, 0.8] },
                    { id: 'temporal_lobe', name: 'Temporal Lobes', color: '#60a5fa', pos: [0.85, -0.1, 0.1], explode: [1.2, 0, 0.5] },
                    { id: 'cerebellum', name: 'Cerebellum (Arbor Vitae)', color: '#10b981', pos: [0, -0.65, -0.65], explode: [0, -1.1, -1.2] },
                    { id: 'brainstem', name: 'Brainstem (Pons & Medulla)', color: '#f59e0b', pos: [0, -0.9, -0.1], explode: [0, -1.5, 0.2] },
                    { id: 'circle_of_willis', name: 'Cerebral Arterial Vasculature', color: '#ef4444', pos: [0, -0.35, 0.05], explode: [0, 0, 1.4] }
                ]
            },
            lungs: {
                url: '/static/models/lung.glb',
                targetScale: 2.8,
                rotation: [0, 0, 0],
                position: [0, -0.05, 0],
                segments: [
                    { id: 'right_lung', name: 'Right Lung (3 Lobes)', color: '#ec4899', pos: [0.95, 0.05, 0], explode: [1.5, 0.2, 0.4] },
                    { id: 'left_lung', name: 'Left Lung & Cardiac Notch', color: '#f43f5e', pos: [-0.95, 0.0, 0], explode: [-1.5, 0.2, 0.4] },
                    { id: 'trachea_tree', name: 'Trachea & Bronchial Tree', color: '#06d6a0', pos: [0, 1.15, 0], explode: [0, 1.4, 0] },
                    { id: 'diaphragm', name: 'Diaphragmatic Impression Base', color: '#8b5cf6', pos: [0, -1.2, 0], explode: [0, -1.6, 0] }
                ]
            },
            liver: {
                url: '/static/models/liver.glb',
                targetScale: 2.7,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'right_hepatic_lobe', name: 'Right Hepatic Lobe', color: '#9a3412', pos: [0.75, 0.1, 0.05], explode: [1.2, 0.3, 0.5] },
                    { id: 'left_hepatic_lobe', name: 'Left Hepatic Lobe', color: '#c2410c', pos: [-0.65, 0.1, 0.05], explode: [-1.2, 0.3, 0.5] },
                    { id: 'gallbladder_biliary', name: 'Gallbladder & Biliary Duct', color: '#84cc16', pos: [0.2, -0.45, 0.45], explode: [0.3, -0.9, 1.1] },
                    { id: 'inferior_vena_cava_hep', name: 'Inferior Vena Cava & Portal Vein', color: '#2563eb', pos: [-0.1, 0.65, -0.4], explode: [-0.2, 1.3, -0.8] }
                ]
            },
            kidney: {
                url: '/static/models/kidney.glb',
                targetScale: 2.8,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'renal_parenchyma', name: 'Renal Cortex & Capsule', color: '#be123c', pos: [0.65, 0.2, 0], explode: [1.3, 0.2, 0.4] },
                    { id: 'renal_medulla_pelvis', name: 'Renal Pelvis & Calyces', color: '#881337', pos: [0.1, 0.0, 0], explode: [0.9, 0.1, -0.5] },
                    { id: 'renal_vessels_ureter', name: 'Renal Artery, Vein & Ureter', color: '#dc2626', pos: [-0.45, -0.3, 0.2], explode: [-0.9, 0.3, 0.3] },
                    { id: 'adrenal_glands', name: 'Suprarenal Adrenal Gland', color: '#eab308', pos: [0.45, 1.25, 0], explode: [0.9, 1.5, 0.2] }
                ]
            },
            stomach: {
                url: '/static/models/stomach.glb',
                targetScale: 2.9,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'gastric_fundus_body', name: 'Gastric Fundus & Body', color: '#f59e0b', pos: [-0.25, 0.45, 0.1], explode: [-0.9, 0.7, 0.4] },
                    { id: 'greater_lesser_curvature', name: 'Greater & Lesser Curvatures', color: '#ea580c', pos: [-0.65, -0.2, 0.1], explode: [-0.8, -0.6, 0.4] },
                    { id: 'pylorus_antrum', name: 'Pyloric Antrum & Sphincter', color: '#d97706', pos: [0.65, -0.45, 0.1], explode: [1.2, -0.6, 0.3] },
                    { id: 'esophageal_junction', name: 'Cardia & Lower Esophageal Junction', color: '#fb7185', pos: [-0.2, 1.05, -0.1], explode: [-0.8, 1.3, -0.2] }
                ]
            },
            skeleton: {
                url: '/static/models/skeleton.glb',
                targetScale: 3.1,
                rotation: [Math.PI / 2, 0, 0],
                position: [0, -0.2, 0],
                segments: [
                    { id: 'cranial_skull', name: 'Cranial Skull & Neurocranium', color: '#e2e8f0', pos: [0, 1.7, 0], explode: [0, 1.2, 0] },
                    { id: 'ribcage_cage', name: 'Thoracic Ribcage (12 Costal Pairs)', color: '#cbd5e1', pos: [0, 0.65, 0.2], explode: [0, 0.4, 0.8] },
                    { id: 'vertebral_column', name: 'Articulated Vertebral Column', color: '#e2e8f0', pos: [0, 0.4, -0.2], explode: [0, 0, -1.2] },
                    { id: 'pelvic_girdle', name: 'Pelvic Girdle Basin', color: '#cbd5e1', pos: [0, -0.45, 0], explode: [0, -1.3, 0] }
                ]
            },
            eye: {
                url: '/static/models/eye.glb',
                targetScale: 2.6,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'cornea', name: 'Cornea Window', color: '#00f0ff', pos: [0, 0, 1.15], explode: [0, 0, 1.6] },
                    { id: 'iris_pupil', name: 'Iris & Pupil', color: '#14b8a6', pos: [0, 0, 0.95], explode: [0, 0, 1.1] },
                    { id: 'sclera_retina', name: 'Sclera Shell & Retina', color: '#f1f5f9', pos: [0, 0, 0], explode: [0, 0, -0.4] },
                    { id: 'optic_nerve', name: 'Optic Nerve Bundle', color: '#fbbf24', pos: [0, 0, -1.25], explode: [0, 0, -1.8] }
                ]
            },
            full_body: {
                url: '/static/models/human_body.glb',
                targetScale: 3.4,
                rotation: [0, 0, 0],
                position: [0, -0.2, 0],
                segments: [
                    { id: 'body_brain', name: 'Brain (Encephalon)', color: '#38bdf8', targetOrgan: 'brain', pos: [0, 1.35, 0.05], explode: [0, 1.5, 0] },
                    { id: 'body_heart', name: 'Thoracic Heart & Aorta', color: '#ef4444', targetOrgan: 'heart', pos: [-0.08, 0.6, 0.12], explode: [0, 0.4, 1.4] },
                    { id: 'body_lungs', name: 'Pulmonary Lungs', color: '#ec4899', targetOrgan: 'lungs', pos: [0, 0.6, 0], explode: [0, 0.4, -1.3] },
                    { id: 'body_liver', name: 'Liver (Hepar)', color: '#9a3412', targetOrgan: 'liver', pos: [0.25, 0.2, 0.1], explode: [1.3, 0.1, 0.5] },
                    { id: 'body_stomach', name: 'Stomach (Gaster)', color: '#f59e0b', targetOrgan: 'stomach', pos: [-0.2, 0.18, 0.08], explode: [-1.3, 0.1, 0.5] },
                    { id: 'body_kidneys', name: 'Renal Kidneys', color: '#be123c', targetOrgan: 'kidney', pos: [0, -0.1, -0.1], explode: [0, -0.4, -1.4] },
                    { id: 'body_skeleton', name: 'Axial Skeletal Chassis', color: '#cbd5e1', targetOrgan: 'skeleton', pos: [0, 0.3, -0.15], explode: [-1.3, 0, 0] }
                ]
            }
        };

        this.initTextures();
        this.initScene();
        this.initLights();
        this.initEventListeners();
        this.loadOrgan('full_body');
        this.animate();
    }

    /* -------------------------------------------------------------
       PROCEDURAL ANATOMICAL TEXTURES (FALLBACK & DETAIL BOOSTERS)
       ------------------------------------------------------------- */
    initTextures() {
        this.proceduralTextures.muscle = this.generateMuscleTexture();
        this.proceduralTextures.trabeculae = this.generateTrabeculaeTexture();
        this.proceduralTextures.fat = this.generateFatTexture();
        this.proceduralTextures.lung = this.generateLungTexture();
        this.proceduralTextures.bone = this.generateBoneTexture();
    }

    generateMuscleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(0, 0, 512, 512);

        ctx.lineWidth = 1.2;
        for (let y = 0; y < 512; y += 3) {
            ctx.strokeStyle = (y % 6 === 0) ? '#dc2626' : '#991b1b';
            ctx.beginPath();
            ctx.moveTo(0, y + (Math.random() - 0.5) * 3);
            for (let x = 0; x <= 512; x += 32) {
                ctx.lineTo(x, y + Math.sin(x * 0.05) * 2 + (Math.random() - 0.5) * 1.5);
            }
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
        ctx.fillStyle = '#991b1b';
        ctx.fillRect(0, 0, 512, 512);

        for (let i = 0; i < 220; i++) {
            const x = Math.random() * 512;
            const y = Math.random() * 512;
            const r = 8 + Math.random() * 18;
            ctx.fillStyle = (i % 2 === 0) ? '#b91c1c' : '#7f1d1d';
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
        ctx.fillStyle = '#eab308';
        ctx.fillRect(0, 0, 256, 256);

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
        return texture;
    }

    generateLungTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f472b6';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 600; i++) {
            ctx.fillStyle = (i % 3 === 0) ? '#db2777' : '#fbcfe8';
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
        }
        return new THREE.CanvasTexture(canvas);
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
        return new THREE.CanvasTexture(canvas);
    }

    /* -------------------------------------------------------------
       SCENE, LIGHTS & VIEWPORT SETUP
       ------------------------------------------------------------- */
    initScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060913);
        this.scene.fog = new THREE.FogExp2(0x060913, 0.035);

        const width = this.container.clientWidth || window.innerWidth;
        const height = this.container.clientHeight || window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
        this.camera.position.set(0, 0.6, 5.4);

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

        // Tone Mapping for Rich Realistic Specimen Colors
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;

        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.85;
        this.controls.zoomSpeed = 1.0;
        this.controls.minDistance = 0.8;
        this.controls.maxDistance = 14.0;
        this.controls.target.set(0, 0.1, 0);

        this.scene.add(this.organGroup);
        this.scene.add(this.hotspotsGroup);

        // Medical Cyber Grid Floor
        const grid = new THREE.GridHelper(12, 24, 0x00f0ff, 0x1e293b);
        grid.position.y = -2.3;
        grid.material.opacity = 0.22;
        grid.material.transparent = true;
        this.scene.add(grid);

        this.createAmbientDust();
    }

    createAmbientDust() {
        const count = 220;
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
            opacity: 0.35,
            blending: THREE.AdditiveBlending
        });

        this.dustParticles = new THREE.Points(geo, mat);
        this.scene.add(this.dustParticles);
    }

    initLights() {
        // Soft Ambient baseline
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        this.scene.add(ambientLight);

        // Surgical Key Light (Warm Sunlight)
        this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
        this.keyLight.position.set(4, 5, 4);
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.width = 1024;
        this.keyLight.shadow.mapSize.height = 1024;
        this.scene.add(this.keyLight);

        // Fill Light (Medical Cyan glow)
        this.fillLight = new THREE.DirectionalLight(0x00f0ff, 0.95);
        this.fillLight.position.set(-4, 3, 2);
        this.scene.add(this.fillLight);

        // Rim Light (Vibrant Crimson/Magenta back highlight)
        this.rimLight = new THREE.DirectionalLight(0xff3366, 1.3);
        this.rimLight.position.set(0, -2, -4);
        this.scene.add(this.rimLight);

        // Overhead Spotlight
        const topLight = new THREE.PointLight(0xffffff, 0.9, 14);
        topLight.position.set(0, 5, 0);
        this.scene.add(topLight);
    }

    /* -------------------------------------------------------------
       MATERIAL GENERATION & SHADER MODES
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
                    roughness: 0.32,
                    metalness: 0.05,
                    clearcoat: 0.65,
                    clearcoatRoughness: 0.18,
                    reflectivity: 0.7,
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

        // Apply mode to current loaded model or fallback segments
        this.organGroup.traverse((child) => {
            if (child.isMesh && child.material) {
                const clipping = this.isSliceActive ? [this.clippingPlane] : null;

                if (mode === 'xray') {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x00b4d8,
                        emissive: 0x0077b6,
                        emissiveIntensity: 0.5,
                        transmission: 0.85,
                        opacity: 0.6,
                        transparent: true,
                        roughness: 0.1,
                        side: THREE.DoubleSide,
                        clippingPlanes: clipping
                    });
                } else if (mode === 'hologram') {
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x00f0ff,
                        emissive: 0x00f0ff,
                        emissiveIntensity: 0.7,
                        transparent: true,
                        opacity: 0.65,
                        clippingPlanes: clipping
                    });
                } else if (mode === 'wireframe') {
                    child.material = new THREE.MeshBasicMaterial({
                        color: 0x00f0ff,
                        wireframe: true,
                        clippingPlanes: clipping
                    });
                } else if (mode === 'glass') {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0xffffff,
                        transmission: 0.92,
                        opacity: 0.45,
                        transparent: true,
                        roughness: 0.05,
                        side: THREE.DoubleSide,
                        clippingPlanes: clipping
                    });
                } else {
                    // Realistic mode: restore original materials
                    if (child.userData.originalMat) {
                        child.material = child.userData.originalMat;
                        child.material.clippingPlanes = clipping;
                    }
                }
            }
        });
    }

    /* -------------------------------------------------------------
       CORE ORGAN LOADER & DISPATCHER
       ------------------------------------------------------------- */
    loadOrgan(organId) {
        this.currentOrganId = organId;
        const loader = document.getElementById('viewportLoader');
        if (loader) loader.classList.remove('hidden');

        this.clearCurrentOrgan();

        setTimeout(() => {
            const config = this.modelConfigs[organId];

            if (config && this.gltfLoader) {
                // Load Realistic 3D Model Asset!
                this.loadRealisticModel(organId, config, () => {
                    this.onOrganLoadedComplete(organId, loader);
                });
            } else {
                // Procedural Fallback Builders (for auxiliary viscera)
                switch (organId) {
                    case 'intestines':
                        this.buildIntestines();
                        break;
                    case 'pancreas_spleen':
                        this.buildPancreasSpleen();
                        break;
                    case 'bladder':
                        this.buildBladder();
                        break;
                    default:
                        this.buildProceduralHeartFallback();
                        break;
                }
                this.onOrganLoadedComplete(organId, loader);
            }
        }, 80);
    }

    onOrganLoadedComplete(organId, loader) {
        this.resetCamera();
        this.setExplode(0.0);

        if (loader) loader.classList.add('hidden');

        const zoomOutBtn = document.getElementById('zoomOutBodyBtn');
        if (zoomOutBtn) {
            zoomOutBtn.style.display = (organId === 'full_body') ? 'none' : 'flex';
        }

        window.dispatchEvent(new CustomEvent('organLoaded', { detail: { organId } }));
    }

    clearCurrentOrgan() {
        while (this.organGroup.children.length > 0) {
            const obj = this.organGroup.children[0];
            this.organGroup.remove(obj);
        }
        while (this.hotspotsGroup.children.length > 0) {
            this.hotspotsGroup.remove(this.hotspotsGroup.children[0]);
        }
        this.segmentsMap.clear();
        this.materialsCache.clear();
        this.hoveredSegment = null;
        this.selectedSegment = null;
    }

    /* -------------------------------------------------------------
       REALISTIC 3D GLTF MODEL LOADER & PBR ENHANCEMENT
       ------------------------------------------------------------- */
    loadRealisticModel(organId, config, onComplete) {
        const handleModelScene = (gltfScene) => {
            const root = gltfScene.clone(true);

            // Compute Bounding Box & Normalize Size / Center
            const box = new THREE.Box3().setFromObject(root);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
            const scale = (config.targetScale || 2.8) / maxDim;

            root.scale.setScalar(scale);

            // Re-center model at scene origin
            root.position.x = -center.x * scale + (config.position ? config.position[0] : 0);
            root.position.y = -center.y * scale + (config.position ? config.position[1] : 0);
            root.position.z = -center.z * scale + (config.position ? config.position[2] : 0);

            if (config.rotation) {
                root.rotation.set(config.rotation[0], config.rotation[1], config.rotation[2]);
            }

            // Material Enhancements for PBR Specimen Realism
            root.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.material) {
                        child.userData.originalMat = child.material.clone();

                        // Enhance wet organ reflectivity & clearcoat sheen
                        if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                            child.material.roughness = Math.min(child.material.roughness, 0.38);
                            child.material.metalness = 0.05;
                            child.material.side = THREE.DoubleSide;

                            // If physical material, inject realistic biological clearcoat
                            if (child.material.isMeshPhysicalMaterial) {
                                child.material.clearcoat = 0.65;
                                child.material.clearcoatRoughness = 0.15;
                            }
                        }

                        // Slicing Plane or Heart Cutaway Support
                        if (this.isSliceActive) {
                            child.material.clippingPlanes = [this.clippingPlane];
                            child.material.clipShadows = true;
                        } else if (organId === 'heart' && this.isCutawayActive) {
                            child.material.clippingPlanes = [this.heartCutPlane];
                            child.material.clipShadows = true;
                        }
                    }
                }
            });

            this.organGroup.add(root);

            // SPECIAL CASE: Human Heart Cutaway Mode (Coronal Dissection as in heart_3.mp4!)
            if (organId === 'heart' && this.isCutawayActive) {
                this.buildHeartInternalDissection();
            }

            // SPECIAL CASE: Full Body Interactive Glowing Organ Beacons
            if (organId === 'full_body') {
                this.enhanceFullBodyShaders(root);
            }

            // Register Segments and Hotspots from Config
            if (config.segments) {
                config.segments.forEach((seg) => {
                    const segMesh = new THREE.Group();
                    segMesh.position.set(seg.pos[0], seg.pos[1], seg.pos[2]);

                    const meta = {
                        name: seg.name,
                        color: seg.color,
                        targetOrgan: seg.targetOrgan || null
                    };

                    const explodeVec = seg.explode ? new THREE.Vector3(...seg.explode) : new THREE.Vector3(0, 0, 1);
                    this.registerSegment(seg.id, segMesh, meta, explodeVec);
                });
            }

            if (onComplete) onComplete();
        };

        if (this.modelCache.has(config.url)) {
            handleModelScene(this.modelCache.get(config.url));
        } else {
            this.gltfLoader.load(
                config.url,
                (gltf) => {
                    this.modelCache.set(config.url, gltf.scene);
                    handleModelScene(gltf.scene);
                },
                undefined,
                (err) => {
                    console.warn(`[Bio3D] Failed to load 3D model: ${config.url}`, err);
                    // Fallback to procedural builder
                    this.buildProceduralHeartFallback();
                    if (onComplete) onComplete();
                }
            );
        }
    }

    /* -------------------------------------------------------------
       CORONAL CUTAWAY DISSECTION VIEW (MATCHING heart_3.mp4 & heart_2.jpg)
       ------------------------------------------------------------- */
    buildHeartInternalDissection() {
        // Internal Cavity Group containing valves, chordae tendineae, and papillary muscles
        const dissectionGroup = new THREE.Group();

        // 1. Interventricular Muscular Septum
        const septumGeo = new THREE.BoxGeometry(0.22, 1.25, 0.45);
        const septumMat = new THREE.MeshStandardMaterial({
            color: 0xb91c1c,
            roughness: 0.35,
            map: this.proceduralTextures.trabeculae
        });
        const septumMesh = new THREE.Mesh(septumGeo, septumMat);
        septumMesh.position.set(-0.05, -0.35, 0.08);
        dissectionGroup.add(septumMesh);

        // 2. White Fibrous Valve Parachutes & Chordae Tendineae Strings
        const valveMat = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.22,
            metalness: 0.05,
            side: THREE.DoubleSide
        });

        // Mitral / Bicuspid Valve (Left Ventricle)
        const mitralGeo = new THREE.ConeGeometry(0.24, 0.38, 16, 1, true);
        const mitralMesh = new THREE.Mesh(mitralGeo, valveMat);
        mitralMesh.position.set(-0.32, -0.05, 0.12);
        mitralMesh.rotation.x = Math.PI;
        dissectionGroup.add(mitralMesh);

        // Mitral Chordae Tendineae Strings (Heart Strings)
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const sCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.32 + Math.cos(angle) * 0.16, -0.12, 0.12 + Math.sin(angle) * 0.16),
                new THREE.Vector3(-0.35, -0.52, 0.12)
            ]);
            dissectionGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sCurve, 8, 0.012, 6, false), valveMat));
        }

        // Tricuspid Valve (Right Ventricle)
        const triGeo = new THREE.ConeGeometry(0.26, 0.38, 16, 1, true);
        const triMesh = new THREE.Mesh(triGeo, valveMat);
        triMesh.position.set(0.28, -0.05, 0.14);
        triMesh.rotation.x = Math.PI;
        dissectionGroup.add(triMesh);

        // Tricuspid Chordae Tendineae Strings
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const sCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.28 + Math.cos(angle) * 0.17, -0.12, 0.14 + Math.sin(angle) * 0.17),
                new THREE.Vector3(0.3, -0.5, 0.14)
            ]);
            dissectionGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sCurve, 8, 0.012, 6, false), valveMat));
        }

        // 3. Trabecular Inner Muscular Ridges
        const trabGroup = new THREE.Group();
        for (let i = 0; i < 12; i++) {
            const tGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 8, 8);
            tGeo.scale(1.0, 1.8, 0.6);
            const tMesh = new THREE.Mesh(tGeo, septumMat);
            const side = (i % 2 === 0) ? -1 : 1;
            tMesh.position.set(side * (0.2 + Math.random() * 0.25), -0.2 - Math.random() * 0.5, 0.05 + Math.random() * 0.1);
            trabGroup.add(tMesh);
        }
        dissectionGroup.add(trabGroup);

        this.organGroup.add(dissectionGroup);
    }

    /* -------------------------------------------------------------
       FULL BODY HOLOGRAPHIC CHASSIS & ORGAN LOCATOR ANCHORS
       ------------------------------------------------------------- */
    enhanceFullBodyShaders(bodyRoot) {
        // Holographic Translucent Silhouette for Human Body
        const holoBodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x0ea5e9,
            roughness: 0.15,
            metalness: 0.1,
            transmission: 0.82,
            transparent: true,
            opacity: 0.28,
            side: THREE.DoubleSide
        });

        bodyRoot.traverse((child) => {
            if (child.isMesh) {
                child.material = holoBodyMat;
            }
        });

        // Pulsating Internal Organ Locator Anchors (Clickable Jump Targets)
        const organAnchors = [
            { organ: 'brain', color: 0x38bdf8, pos: [0, 1.35, 0.05], scale: 0.22, name: 'Cranial Brain' },
            { organ: 'heart', color: 0xef4444, pos: [-0.08, 0.6, 0.12], scale: 0.18, name: 'Thoracic Heart' },
            { organ: 'lungs', color: 0xec4899, pos: [0, 0.6, 0.0], scale: 0.24, name: 'Pulmonary Lungs' },
            { organ: 'liver', color: 0x9a3412, pos: [0.25, 0.2, 0.1], scale: 0.2, name: 'Hepatic Liver' },
            { organ: 'stomach', color: 0xf59e0b, pos: [-0.2, 0.18, 0.08], scale: 0.18, name: 'Gastric Stomach' },
            { organ: 'kidney', color: 0xbe123c, pos: [0, -0.1, -0.1], scale: 0.16, name: 'Renal Kidneys' },
            { organ: 'skeleton', color: 0xcbd5e1, pos: [0, 0.3, -0.15], scale: 0.26, name: 'Skeletal Spine' }
        ];

        organAnchors.forEach((anc) => {
            const anchorGeo = new THREE.SphereGeometry(anc.scale, 16, 16);
            const anchorMat = new THREE.MeshStandardMaterial({
                color: anc.color,
                emissive: anc.color,
                emissiveIntensity: 0.45,
                roughness: 0.3
            });
            const anchorMesh = new THREE.Mesh(anchorGeo, anchorMat);
            anchorMesh.position.set(anc.pos[0], anc.pos[1], anc.pos[2]);

            anchorMesh.userData = {
                segmentId: `body_${anc.organ}`,
                targetOrgan: anc.organ
            };

            this.organGroup.add(anchorMesh);
        });
    }

    /* -------------------------------------------------------------
       FALLBACK PROCEDURAL BUILDERS (INTESTINES, PANCREAS, BLADDER)
       ------------------------------------------------------------- */
    buildIntestines() {
        const entericGroup = new THREE.Group();
        const entericMat = this.getMaterial('#fb923c', 'small_intestine_coils', 'muscle');

        // Small intestine coils
        for (let i = 0; i < 9; i++) {
            const loopGeo = new THREE.TorusGeometry(0.42 + (i % 2) * 0.14, 0.12, 12, 24);
            const loopMesh = new THREE.Mesh(loopGeo, entericMat);
            loopMesh.position.set((i % 3 - 1) * 0.22, -0.3 + (i * 0.08), (i % 2) * 0.1);
            loopMesh.rotation.x = Math.PI / 4 + i * 0.32;
            entericGroup.add(loopMesh);
        }
        this.registerSegment('small_intestine_coils', entericGroup, { name: 'Small Intestine (Jejunum/Ileum)', color: '#fb923c' }, new THREE.Vector3(0, 0, 1.2));

        // Haustrated Colon
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
    }

    buildPancreasSpleen() {
        const pancGeo = new THREE.CylinderGeometry(0.18, 0.08, 1.5, 16);
        pancGeo.scale(1.2, 1.0, 0.6);
        const pancMesh = new THREE.Mesh(pancGeo, this.getMaterial('#facc15', 'pancreas_head_body'));
        pancMesh.position.set(0.15, 0.05, 0.05);
        pancMesh.rotation.z = Math.PI / 2.3;
        this.registerSegment('pancreas_head_body', pancMesh, { name: 'Pancreas (Head, Body & Tail)', color: '#facc15' }, new THREE.Vector3(0.5, 0.5, 0.4));

        const spGeo = new THREE.SphereGeometry(0.55, 20, 20);
        spGeo.scale(0.85, 1.15, 0.75);
        const spMesh = new THREE.Mesh(spGeo, this.getMaterial('#881337', 'spleen_lymphoid'));
        spMesh.position.set(-1.05, 0.35, -0.2);
        this.registerSegment('spleen_lymphoid', spMesh, { name: 'Spleen (Red & White Pulp)', color: '#881337' }, new THREE.Vector3(-1.3, 0.5, -0.4));
    }

    buildBladder() {
        const bladGeo = new THREE.SphereGeometry(0.85, 24, 24);
        bladGeo.scale(1.15, 1.1, 1.05);
        const bladMesh = new THREE.Mesh(bladGeo, this.getMaterial('#f43f5e', 'detrusor_body'));
        bladMesh.position.set(0, 0.15, 0.05);
        this.registerSegment('detrusor_body', bladMesh, { name: 'Detrusor Muscle Dome', color: '#f43f5e' }, new THREE.Vector3(0, 0.8, 0.2));
    }

    buildProceduralHeartFallback() {
        // High-definition procedural heart if offline or GLTF error
        const ventGeo = new THREE.CylinderGeometry(0.72, 0.22, 1.55, 32, 24);
        ventGeo.scale(1.15, 1.0, 0.95);
        const ventMat = this.getMaterial('#d94828', 'ventricles_myocardium', 'muscle');
        const ventMesh = new THREE.Mesh(ventGeo, ventMat);
        ventMesh.position.set(-0.08, -0.4, 0.1);
        ventMesh.rotation.z = -0.18;
        this.registerSegment('ventricles_myocardium', ventMesh, { name: 'Muscular Ventricles (Myocardium)', color: '#d94828' }, new THREE.Vector3(-0.9, -0.6, 0.3), 'muscle');
    }

    /* -------------------------------------------------------------
       SEGMENT & INTERACTIVE HOTSPOT PIN REGISTRY
       ------------------------------------------------------------- */
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
            opacity: 0.88
        });
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);

        const ringGeo = new THREE.RingGeometry(0.06, 0.085, 16);
        const ringMat = new THREE.MeshBasicMaterial({
            color: 0x00f0ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65
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
       INTERACTION, RAYCASTING & CLICK ZOOMING
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

        // Check hotspot pins first
        this.hotspotsGroup.traverse((c) => {
            if (c.isMesh && c.parent && c.parent.userData.segmentId) meshes.push(c);
        });

        // Check segments
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

        // Check segment mesh click
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
            const worldPos = new THREE.Vector3();
            item.mesh.getWorldPosition(worldPos);

            // Cinematic Zoom Transition
            new TWEEN.Tween(this.camera.position)
                .to({ x: worldPos.x, y: worldPos.y, z: worldPos.z + 1.8 }, 650)
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
       CUTAWAY, EXPLODE & CAMERA CONTROLS
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
       PHYSIOLOGICAL VITAL SIMULATION ANIMATION LOOP
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
                // Authentic Cardiac Lub-Dub Systole & Diastole with slight helical apex twist
                const beatPhase = (time * 1.25) % 1.0;
                let scalePulse = 1.0;
                let twist = 0.0;

                if (beatPhase < 0.15) {
                    scalePulse = 1.0 + Math.sin(beatPhase / 0.15 * Math.PI) * 0.06;
                    twist = Math.sin(beatPhase / 0.15 * Math.PI) * 0.025;
                } else if (beatPhase > 0.18 && beatPhase < 0.32) {
                    scalePulse = 1.0 + Math.sin((beatPhase - 0.18) / 0.14 * Math.PI) * 0.035;
                    twist = Math.sin((beatPhase - 0.18) / 0.14 * Math.PI) * 0.015;
                }
                this.organGroup.scale.set(scalePulse, scalePulse * 1.02, scalePulse);
                this.organGroup.rotation.y = twist;
            } else if (this.currentOrganId === 'lungs') {
                // Respiratory Breathing Tidal Expansion & Recoil
                const breathCycle = Math.sin(time * 1.4) * 0.5 + 0.5;
                const breathExpansion = 1.0 + breathCycle * 0.065;
                this.organGroup.scale.set(breathExpansion, 1.0 + breathCycle * 0.08, breathExpansion);
                this.organGroup.rotation.y = 0;
            } else if (this.currentOrganId === 'brain') {
                // Neural Electrical Micro-ripple
                const neuralGlow = Math.sin(time * 2.8) * 0.015;
                this.organGroup.scale.set(1.0 + neuralGlow, 1.0 + neuralGlow, 1.0 + neuralGlow);
                this.organGroup.rotation.y = 0;
            } else {
                this.organGroup.scale.set(1, 1, 1);
                this.organGroup.rotation.y = 0;
            }
        } else {
            this.organGroup.scale.set(1, 1, 1);
            this.organGroup.rotation.y = 0;
        }

        // Align Hotspot Pins to Camera
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
