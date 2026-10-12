/**
 * BIO3D NEXUS - Interactive Realistic 3D Anatomical Organ Engine
 * Inspired by museum-grade medical specimens & Sketchfab Doctor Jana (@docjana)
 * Powered by Three.js & TWEEN.js
 * 
 * Features:
 * - 6 Independent Anatomical Peeling Layers: Skin, Muscles, Vessels, Bones, Nerves, Visceral Organs
 * - Complete 78-Organ Medical Registry with high-definition PBR shaders & organic contours
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
        this.isCutawayActive = false; // Coronal dissection toggle
        this.vitalMotionEnabled = true;
        this.autoRotateEnabled = false;
        this.labelsVisible = true;
        this.isSliceActive = false;

        // 6 Anatomical Peeling Layers for Full Human Body
        this.fullBodyLayers = {
            skin: null,
            muscles: null,
            vessels: null,
            bones: null,
            nerves: null,
            organs: null
        };
        this.layerOpacities = {
            skin: 1.0,
            muscles: 1.0,
            vessels: 1.0,
            bones: 1.0,
            nerves: 1.0,
            organs: 1.0
        };
        this.layerVisibilities = {
            skin: true,
            muscles: true,
            vessels: true,
            bones: true,
            nerves: true,
            organs: true
        };

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
                targetScale: 3.0,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'right_superior_lobe', name: 'Right Lung - Superior Lobe', color: '#fb7185', pos: [-0.7, 0.65, 0.1], explode: [-1.2, 0.8, 0.5] },
                    { id: 'right_middle_inferior', name: 'Right Lung - Middle & Inferior Lobes', color: '#f43f5e', pos: [-0.85, -0.4, 0.1], explode: [-1.4, -0.6, 0.4] },
                    { id: 'left_lung_lobes', name: 'Left Lung (Superior & Inferior Lobes)', color: '#e11d48', pos: [0.85, 0.1, 0.1], explode: [1.4, 0.2, 0.4] },
                    { id: 'trachea_tree', name: 'Trachea & Primary Bronchial Tree', color: '#38bdf8', pos: [0, 0.95, -0.2], explode: [0, 1.4, -0.8] },
                    { id: 'pulmonary_vasculature', name: 'Pulmonary Arteries & Alveolar Capillaries', color: '#2563eb', pos: [0, 0.2, -0.15], explode: [0, 0, -1.3] }
                ]
            },
            liver: {
                url: '/static/models/liver.glb',
                targetScale: 2.8,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'right_hepatic_lobe', name: 'Right Hepatic Lobe', color: '#b45309', pos: [-0.65, 0.1, 0.1], explode: [-1.1, 0.3, 0.5] },
                    { id: 'left_hepatic_lobe', name: 'Left Hepatic Lobe', color: '#92400e', pos: [0.65, 0.2, 0.15], explode: [1.1, 0.4, 0.5] },
                    { id: 'gallbladder_bed', name: 'Gallbladder & Cystic Duct', color: '#16a34a', pos: [-0.25, -0.6, 0.5], explode: [-0.4, -1.2, 0.9] },
                    { id: 'portal_triad', name: 'Hepatic Portal Vein & Vena Cava', color: '#1d4ed8', pos: [0.1, -0.2, -0.4], explode: [0.2, -0.4, -1.2] }
                ]
            },
            kidney: {
                url: '/static/models/kidney.glb',
                targetScale: 2.7,
                rotation: [0, 0, 0],
                position: [0, 0, 0],
                segments: [
                    { id: 'renal_cortex', name: 'Renal Cortex & Glomeruli', color: '#9333ea', pos: [-0.45, 0.2, 0.2], explode: [-1.2, 0.4, 0.5] },
                    { id: 'renal_medulla_pyramids', name: 'Medullary Pyramids & Calyces', color: '#7e22ce', pos: [0, 0, 0.05], explode: [0, 0, 0.9] },
                    { id: 'renal_pelvis_ureter', name: 'Renal Pelvis & Ureter Conduit', color: '#c084fc', pos: [0.45, -0.4, -0.1], explode: [1.2, -0.8, -0.3] },
                    { id: 'adrenal_gland', name: 'Suprarenal (Adrenal) Gland', color: '#eab308', pos: [0.05, 1.1, 0.1], explode: [0.1, 1.4, 0.2] }
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
            }
        };

        // Aliases mapping sub-organs to appropriate 3D GLB assets
        this.glbAliases = {
            'right_lung': 'lungs',
            'left_lung': 'lungs',
            'bronchi': 'lungs',
            'trachea': 'lungs',
            'gallbladder': 'liver',
            'right_kidney': 'kidney',
            'left_kidney': 'kidney',
            'adrenal_glands': 'kidney',
            'adrenal_gland': 'kidney',
            'esophagus': 'stomach',
            'skull': 'skeleton',
            'spine': 'skeleton',
            'ribcage': 'skeleton',
            'pelvis': 'skeleton',
            'cornea': 'eye',
            'retina': 'eye',
            'lens': 'eye',
            'optic_nerve': 'eye'
        };

        this.initTextures();
        this.initScene();
        this.initLights();
        this.initEventListeners();
        this.loadOrgan('full_body');
        this.animate();
    }

    /* -------------------------------------------------------------
       PROCEDURAL ANATOMICAL TEXTURES (PBR MEDICAL DETAIL BOOSTERS)
       ------------------------------------------------------------- */
    initTextures() {
        this.proceduralTextures.muscle = this.generateMuscleTexture();
        this.proceduralTextures.trabeculae = this.generateTrabeculaeTexture();
        this.proceduralTextures.fat = this.generateFatTexture();
        this.proceduralTextures.lung = this.generateLungTexture();
        this.proceduralTextures.bone = this.generateBoneTexture();
        this.proceduralTextures.glandular = this.generateGlandularTexture();
        this.proceduralTextures.mucosa = this.generateMucosaTexture();
        this.proceduralTextures.cartilage = this.generateCartilageTexture();
        this.proceduralTextures.sponge_lymph = this.generateLymphTexture();
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

    generateGlandularTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#d97706';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 400; i++) {
            const x = Math.random() * 256;
            const y = Math.random() * 256;
            const r = 2 + Math.random() * 5;
            ctx.fillStyle = (i % 2 === 0) ? '#f59e0b' : '#b45309';
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        return new THREE.CanvasTexture(canvas);
    }

    generateMucosaTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 2.5;
        for (let y = 0; y < 256; y += 8) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            for (let x = 0; x <= 256; x += 16) {
                ctx.lineTo(x, y + Math.sin(x * 0.1) * 3.5);
            }
            ctx.stroke();
        }
        return new THREE.CanvasTexture(canvas);
    }

    generateCartilageTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#e0f2fe';
        ctx.fillRect(0, 0, 256, 256);
        ctx.fillStyle = '#bae6fd';
        for (let i = 0; i < 200; i++) {
            ctx.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
        }
        return new THREE.CanvasTexture(canvas);
    }

    generateLymphTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#831843';
        ctx.fillRect(0, 0, 256, 256);
        for (let i = 0; i < 250; i++) {
            ctx.fillStyle = (i % 2 === 0) ? '#9d174d' : '#701a75';
            ctx.beginPath();
            ctx.arc(Math.random() * 256, Math.random() * 256, 4 + Math.random() * 4, 0, Math.PI * 2);
            ctx.fill();
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
        this.controls.target.set(0, 0, 0);

        this.scene.add(this.organGroup);
        this.scene.add(this.hotspotsGroup);

        this.addSurgicalEnvironment();
    }

    addSurgicalEnvironment() {
        // Medical pedestal grid with subtle radial illumination
        const gridHelper = new THREE.GridHelper(16, 32, 0x00f0ff, 0x1e293b);
        gridHelper.position.y = -2.1;
        gridHelper.material.opacity = 0.22;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);

        // Surgical theatre ambient dust particles
        const particleCount = 200;
        const particleGeo = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 14;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 14;
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: 0x00f0ff,
            size: 0.035,
            transparent: true,
            opacity: 0.35
        });

        this.dustParticles = new THREE.Points(particleGeo, particleMat);
        this.scene.add(this.dustParticles);
    }

    initLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(ambientLight);

        this.keyLight = new THREE.DirectionalLight(0xffffff, 1.6);
        this.keyLight.position.set(4, 5, 4);
        this.keyLight.castShadow = true;
        this.keyLight.shadow.mapSize.width = 1024;
        this.keyLight.shadow.mapSize.height = 1024;
        this.scene.add(this.keyLight);

        this.fillLight = new THREE.DirectionalLight(0x00f0ff, 0.95);
        this.fillLight.position.set(-4, 3, 2);
        this.scene.add(this.fillLight);

        this.rimLight = new THREE.DirectionalLight(0xff3366, 1.3);
        this.rimLight.position.set(0, -2, -4);
        this.scene.add(this.rimLight);

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
                    roughness: 0.38,
                    metalness: 0.05,
                    clearcoat: 0.55,
                    clearcoatRoughness: 0.18,
                    reflectivity: 0.8,
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

        // Update all meshes in scene
        this.organGroup.traverse((child) => {
            if (child.isMesh && child.userData.segmentId) {
                const seg = this.segmentsMap.get(child.userData.segmentId);
                if (seg) {
                    child.material = this.getMaterial(seg.meta.color, seg.id, seg.textureType);
                }
            } else if (child.isMesh && child.material) {
                const clipping = this.isSliceActive ? [this.clippingPlane] : null;

                if (mode === 'xray') {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x00b4d8,
                        emissive: 0x0077b6,
                        emissiveIntensity: 0.6,
                        roughness: 0.15,
                        transmission: 0.85,
                        transparent: true,
                        opacity: 0.5,
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
            // Case 1: Full Human Body (Multi-layer Peeling Matrix)
            if (organId === 'full_body') {
                this.buildFullBody(() => {
                    this.onOrganLoadedComplete(organId, loader);
                });
                return;
            }

            // Case 2: Direct GLB Models or Sub-organ GLB Aliases
            const actualId = this.glbAliases[organId] || organId;
            const config = this.modelConfigs[actualId];

            if (config && this.gltfLoader) {
                this.loadRealisticModel(organId, config, () => {
                    this.onOrganLoadedComplete(organId, loader);
                });
            } else {
                // Case 3: Complete Organic 3D Scupt Factory for Remaining 78 Organs
                this.buildOrganicOrgan(organId);
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

        const layersHud = document.getElementById('dissectionLayersHud');
        if (layersHud) {
            if (organId === 'full_body') {
                layersHud.classList.remove('hidden');
            } else {
                layersHud.classList.add('hidden');
            }
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
        this.fullBodyLayers = { skin: null, muscles: null, vessels: null, bones: null, nerves: null, organs: null };
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

                        if (child.material.isMeshStandardMaterial || child.material.isMeshPhysicalMaterial) {
                            child.material.roughness = Math.min(child.material.roughness, 0.38);
                            child.material.metalness = 0.05;
                            child.material.side = THREE.DoubleSide;

                            if (child.material.isMeshPhysicalMaterial) {
                                child.material.clearcoat = 0.65;
                                child.material.clearcoatRoughness = 0.15;
                            }
                        }

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

            // Heart Coronal Cutaway Mode (Matching heart_3.mp4 & demo photo 2)
            if (organId === 'heart' && this.isCutawayActive) {
                this.buildHeartInternalDissection();
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
                    this.buildOrganicOrgan(organId);
                    if (onComplete) onComplete();
                }
            );
        }
    }

    /* -------------------------------------------------------------
       FULL HUMAN BODY MULTI-LAYER ASSEMBLY (6 DISSECTION LAYERS)
       ------------------------------------------------------------- */
    buildFullBody(onComplete) {
        const bodyRoot = new THREE.Group();

        // 1. SKIN LAYER (Realistic Melanin Epidermis / Dermis)
        const skinGroup = new THREE.Group();
        skinGroup.name = 'skinLayer';
        this.fullBodyLayers.skin = skinGroup;

        // 2. MUSCLES LAYER (Striated Skeletal Muscle Groups)
        const musclesGroup = new THREE.Group();
        musclesGroup.name = 'musclesLayer';
        this.fullBodyLayers.muscles = musclesGroup;

        // 3. BONES LAYER (206 Articulated Bones)
        const bonesGroup = new THREE.Group();
        bonesGroup.name = 'bonesLayer';
        this.fullBodyLayers.bones = bonesGroup;

        // 4. CARDIOVASCULAR VESSELS LAYER (Systemic Arteries & Veins)
        const vesselsGroup = this.buildFullBodyVascularTree();
        vesselsGroup.name = 'vesselsLayer';
        this.fullBodyLayers.vessels = vesselsGroup;

        // 5. NERVES LAYER (Spinal Cord & Plexuses)
        const nervesGroup = this.buildFullBodyNervousTree();
        nervesGroup.name = 'nervesLayer';
        this.fullBodyLayers.nerves = nervesGroup;

        // 6. VISCERAL ORGANS LAYER (Thoracic & Abdominal Matrix)
        const organsGroup = this.buildFullBodyVisceralMatrix();
        organsGroup.name = 'organsLayer';
        this.fullBodyLayers.organs = organsGroup;

        bodyRoot.add(bonesGroup);
        bodyRoot.add(musclesGroup);
        bodyRoot.add(vesselsGroup);
        bodyRoot.add(nervesGroup);
        bodyRoot.add(organsGroup);
        bodyRoot.add(skinGroup);

        this.organGroup.add(bodyRoot);

        // Load Skeleton GLB
        const loadSkeleton = (cb) => {
            const url = '/static/models/skeleton.glb';
            const applySkeleton = (scene) => {
                const sClone = scene.clone(true);
                sClone.rotation.x = Math.PI / 2;
                const box = new THREE.Box3().setFromObject(sClone);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const scale = 3.25 / (size.y || 1);
                sClone.scale.setScalar(scale);
                sClone.position.set(-center.x * scale, -center.y * scale - 0.2, -center.z * scale);

                const boneMat = new THREE.MeshStandardMaterial({
                    color: 0xf1f5f9,
                    map: this.proceduralTextures.bone,
                    roughness: 0.48,
                    metalness: 0.02
                });

                sClone.traverse((c) => {
                    if (c.isMesh) {
                        c.material = boneMat;
                        c.castShadow = true;
                    }
                });
                bonesGroup.add(sClone);
                if (cb) cb();
            };

            if (this.modelCache.has(url)) applySkeleton(this.modelCache.get(url));
            else this.gltfLoader.load(url, (g) => { this.modelCache.set(url, g.scene); applySkeleton(g.scene); }, undefined, () => cb && cb());
        };

        // Load Muscles GLB
        const loadMuscles = (cb) => {
            const url = '/static/models/fullbody_muscles.glb';
            const applyMuscles = (scene) => {
                const mClone = scene.clone(true);
                mClone.rotation.x = Math.PI / 2;
                const box = new THREE.Box3().setFromObject(mClone);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const scale = 3.3 / (size.y || 1);
                mClone.scale.setScalar(scale);
                mClone.position.set(-center.x * scale, -center.y * scale - 0.2, -center.z * scale);

                const muscleMat = new THREE.MeshPhysicalMaterial({
                    color: 0x991b1b,
                    map: this.proceduralTextures.muscle,
                    roughness: 0.42,
                    metalness: 0.05,
                    clearcoat: 0.35,
                    clearcoatRoughness: 0.2
                });

                mClone.traverse((c) => {
                    if (c.isMesh) {
                        c.material = muscleMat;
                        c.castShadow = true;
                    }
                });
                musclesGroup.add(mClone);
                if (cb) cb();
            };

            if (this.modelCache.has(url)) applyMuscles(this.modelCache.get(url));
            else this.gltfLoader.load(url, (g) => { this.modelCache.set(url, g.scene); applyMuscles(g.scene); }, undefined, () => cb && cb());
        };

        // Load Skin Surface Mesh GLB
        const loadSkin = (cb) => {
            const url = '/static/models/human_body.glb';
            const applySkin = (scene) => {
                const skClone = scene.clone(true);
                const box = new THREE.Box3().setFromObject(skClone);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                const scale = 3.4 / (size.y || 1);
                skClone.scale.setScalar(scale);
                skClone.position.set(-center.x * scale, -center.y * scale - 0.2, -center.z * scale);

                const skinMat = new THREE.MeshPhysicalMaterial({
                    color: 0xe0a98b,
                    roughness: 0.42,
                    metalness: 0.04,
                    clearcoat: 0.25,
                    clearcoatRoughness: 0.35,
                    transparent: true,
                    opacity: 0.95,
                    side: THREE.DoubleSide
                });

                skClone.traverse((c) => {
                    if (c.isMesh) {
                        c.material = skinMat;
                        c.castShadow = true;
                    }
                });
                skinGroup.add(skClone);
                if (cb) cb();
            };

            if (this.modelCache.has(url)) applySkin(this.modelCache.get(url));
            else this.gltfLoader.load(url, (g) => { this.modelCache.set(url, g.scene); applySkin(g.scene); }, undefined, () => cb && cb());
        };

        // Parallel sequential load of 3D anatomical components
        loadSkeleton(() => {
            loadMuscles(() => {
                loadSkin(() => {
                    // Register main body hotspots
                    const bodySegments = [
                        { id: 'body_brain', name: 'Brain (Encephalon)', color: '#38bdf8', targetOrgan: 'brain', pos: [0, 1.35, 0.05], explode: [0, 1.5, 0] },
                        { id: 'body_heart', name: 'Thoracic Heart & Aorta', color: '#ef4444', targetOrgan: 'heart', pos: [-0.08, 0.6, 0.12], explode: [0, 0.4, 1.4] },
                        { id: 'body_lungs', name: 'Pulmonary Lungs', color: '#ec4899', targetOrgan: 'lungs', pos: [0, 0.6, 0], explode: [0, 0.4, -1.3] },
                        { id: 'body_liver', name: 'Liver (Hepar)', color: '#9a3412', targetOrgan: 'liver', pos: [0.25, 0.2, 0.1], explode: [1.3, 0.1, 0.5] },
                        { id: 'body_stomach', name: 'Stomach (Gaster)', color: '#f59e0b', targetOrgan: 'stomach', pos: [-0.2, 0.18, 0.08], explode: [-1.3, 0.1, 0.5] },
                        { id: 'body_kidneys', name: 'Renal Kidneys', color: '#be123c', targetOrgan: 'kidney', pos: [0, -0.1, -0.1], explode: [0, -0.4, -1.4] },
                        { id: 'body_skeleton', name: '206-Bone Framework', color: '#cbd5e1', targetOrgan: 'skeleton', pos: [0, 0.3, -0.15], explode: [-1.3, 0, 0] }
                    ];

                    bodySegments.forEach((seg) => {
                        const segMesh = new THREE.Group();
                        segMesh.position.set(seg.pos[0], seg.pos[1], seg.pos[2]);
                        const meta = { name: seg.name, color: seg.color, targetOrgan: seg.targetOrgan };
                        this.registerSegment(seg.id, segMesh, meta, new THREE.Vector3(...seg.explode));
                    });

                    if (onComplete) onComplete();
                });
            });
        });
    }

    buildFullBodyVascularTree() {
        const vGroup = new THREE.Group();

        const artMat = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            roughness: 0.35,
            metalness: 0.1
        });
        const venMat = new THREE.MeshStandardMaterial({
            color: 0x2563eb,
            roughness: 0.35,
            metalness: 0.1
        });

        // 1. Thoracic & Abdominal Aorta
        const aortaCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0.65, 0.08),
            new THREE.Vector3(-0.04, 0.82, 0.06),
            new THREE.Vector3(-0.03, 0.45, -0.04),
            new THREE.Vector3(-0.02, 0.1, -0.04),
            new THREE.Vector3(0, -0.35, -0.02)
        ]);
        const aortaMesh = new THREE.Mesh(new THREE.TubeGeometry(aortaCurve, 24, 0.032, 12, false), artMat);
        vGroup.add(aortaMesh);

        // 2. Vena Cava (SVC & IVC)
        const vcCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0.05, 0.9, -0.02),
            new THREE.Vector3(0.04, 0.62, 0.04),
            new THREE.Vector3(0.03, 0.2, -0.04),
            new THREE.Vector3(0.02, -0.35, -0.02)
        ]);
        const vcMesh = new THREE.Mesh(new THREE.TubeGeometry(vcCurve, 24, 0.034, 12, false), venMat);
        vGroup.add(vcMesh);

        // 3. Bilateral Carotid Arteries & Jugular Veins to Neck/Head
        [-1, 1].forEach((side) => {
            const carotidCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.03, 0.82, 0.04),
                new THREE.Vector3(side * 0.06, 1.15, 0.03),
                new THREE.Vector3(side * 0.08, 1.35, 0.02)
            ]);
            vGroup.add(new THREE.Mesh(new THREE.TubeGeometry(carotidCurve, 16, 0.016, 8, false), artMat));

            const jugularCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.06, 0.85, 0.02),
                new THREE.Vector3(side * 0.09, 1.15, 0.02),
                new THREE.Vector3(side * 0.11, 1.35, 0.01)
            ]);
            vGroup.add(new THREE.Mesh(new THREE.TubeGeometry(jugularCurve, 16, 0.018, 8, false), venMat));
        });

        // 4. Subclavian & Brachial Vessels to Limbs
        [-1, 1].forEach((side) => {
            const armArtCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.05, 0.78, 0.02),
                new THREE.Vector3(side * 0.35, 0.72, 0.0),
                new THREE.Vector3(side * 0.58, 0.35, -0.02),
                new THREE.Vector3(side * 0.75, -0.15, -0.04)
            ]);
            vGroup.add(new THREE.Mesh(new THREE.TubeGeometry(armArtCurve, 24, 0.018, 8, false), artMat));

            const legArtCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, -0.35, -0.02),
                new THREE.Vector3(side * 0.15, -0.55, 0.02),
                new THREE.Vector3(side * 0.22, -1.05, 0.02),
                new THREE.Vector3(side * 0.24, -1.65, -0.02)
            ]);
            vGroup.add(new THREE.Mesh(new THREE.TubeGeometry(legArtCurve, 28, 0.022, 8, false), artMat));

            const legVenCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.02, -0.35, -0.02),
                new THREE.Vector3(side * 0.18, -0.55, 0.01),
                new THREE.Vector3(side * 0.25, -1.05, 0.01),
                new THREE.Vector3(side * 0.26, -1.65, -0.03)
            ]);
            vGroup.add(new THREE.Mesh(new THREE.TubeGeometry(legVenCurve, 28, 0.022, 8, false), venMat));
        });

        return vGroup;
    }

    buildFullBodyNervousTree() {
        const nGroup = new THREE.Group();
        const nerveMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            roughness: 0.3,
            metalness: 0.15
        });

        // 1. Central Spinal Cord in Vertebral Column
        const cordCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 1.25, -0.05),
            new THREE.Vector3(0, 0.7, -0.12),
            new THREE.Vector3(0, 0.2, -0.1),
            new THREE.Vector3(0, -0.35, -0.08)
        ]);
        const cordMesh = new THREE.Mesh(new THREE.TubeGeometry(cordCurve, 24, 0.025, 10, false), nerveMat);
        nGroup.add(cordMesh);

        // 2. Sciatic & Lumbar Plexus Branches down legs
        [-1, 1].forEach((side) => {
            const sciaticCurve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(side * 0.04, -0.35, -0.08),
                new THREE.Vector3(side * 0.14, -0.58, -0.06),
                new THREE.Vector3(side * 0.22, -1.05, -0.04),
                new THREE.Vector3(side * 0.24, -1.65, -0.06)
            ]);
            nGroup.add(new THREE.Mesh(new THREE.TubeGeometry(sciaticCurve, 24, 0.016, 8, false), nerveMat));
        });

        return nGroup;
    }

    buildFullBodyVisceralMatrix() {
        const visGroup = new THREE.Group();

        // 1. Thoracic Heart
        const heartP = new THREE.Group();
        heartP.position.set(-0.08, 0.62, 0.12);
        const hMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 16, 16),
            this.getMaterial('#dc2626', 'fb_heart', 'muscle')
        );
        hMesh.scale.set(1.0, 1.25, 0.9);
        heartP.add(hMesh);
        heartP.userData = { targetOrgan: 'heart' };
        visGroup.add(heartP);

        // 2. Bilateral Lungs
        const lungsP = new THREE.Group();
        lungsP.position.set(0, 0.62, 0.02);
        [-0.14, 0.14].forEach((xOffset) => {
            const lMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.14, 16, 16),
                this.getMaterial('#fb7185', `fb_lung_${xOffset}`, 'lung')
            );
            lMesh.position.x = xOffset;
            lMesh.scale.set(0.9, 1.6, 0.85);
            lungsP.add(lMesh);
        });
        lungsP.userData = { targetOrgan: 'lungs' };
        visGroup.add(lungsP);

        // 3. Hepatic Liver
        const liverP = new THREE.Group();
        liverP.position.set(0.2, 0.25, 0.1);
        const livMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 16, 16),
            this.getMaterial('#9a3412', 'fb_liver', 'glandular')
        );
        livMesh.scale.set(1.4, 0.9, 1.0);
        liverP.add(livMesh);
        liverP.userData = { targetOrgan: 'liver' };
        visGroup.add(liverP);

        // 4. Gastric Stomach
        const stomP = new THREE.Group();
        stomP.position.set(-0.16, 0.22, 0.08);
        const stomMesh = new THREE.Mesh(
            new THREE.TorusGeometry(0.11, 0.065, 12, 24),
            this.getMaterial('#ea580c', 'fb_stomach', 'mucosa')
        );
        stomP.add(stomMesh);
        stomP.userData = { targetOrgan: 'stomach' };
        visGroup.add(stomP);

        // 5. Bilateral Kidneys
        const kidP = new THREE.Group();
        kidP.position.set(0, -0.06, -0.1);
        [-0.15, 0.15].forEach((kX) => {
            const kMesh = new THREE.Mesh(
                new THREE.SphereGeometry(0.08, 14, 14),
                this.getMaterial('#9333ea', `fb_kidney_${kX}`)
            );
            kMesh.position.x = kX;
            kMesh.scale.set(0.85, 1.35, 0.7);
            kidP.add(kMesh);
        });
        kidP.userData = { targetOrgan: 'kidney' };
        visGroup.add(kidP);

        // 6. Cranial Brain
        const brainP = new THREE.Group();
        brainP.position.set(0, 1.35, 0.04);
        const brMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.16, 18, 18),
            this.getMaterial('#38bdf8', 'fb_brain')
        );
        brMesh.scale.set(1.0, 1.15, 1.25);
        brainP.add(brMesh);
        brainP.userData = { targetOrgan: 'brain' };
        visGroup.add(brainP);

        // 7. Enteric Intestines Coils
        const intP = new THREE.Group();
        intP.position.set(0, -0.22, 0.08);
        for (let i = 0; i < 5; i++) {
            const cMesh = new THREE.Mesh(
                new THREE.TorusGeometry(0.14 - i * 0.02, 0.035, 10, 20),
                this.getMaterial('#f59e0b', `fb_int_${i}`, 'mucosa')
            );
            cMesh.rotation.x = Math.PI / 3 + i * 0.2;
            intP.add(cMesh);
        }
        intP.userData = { targetOrgan: 'jejunum' };
        visGroup.add(intP);

        return visGroup;
    }

    /* -------------------------------------------------------------
       LAYER DISSECTION CONTROLS (PEEL SKIN, MUSCLES, BONES, ETC.)
       ------------------------------------------------------------- */
    toggleLayer(layerName, visible) {
        this.layerVisibilities[layerName] = visible;
        const group = this.fullBodyLayers[layerName];
        if (group) {
            group.visible = visible;
        }
    }

    setLayerOpacity(layerName, opacity) {
        this.layerOpacities[layerName] = opacity;
        const group = this.fullBodyLayers[layerName];
        if (!group) return;

        group.visible = opacity > 0.001;

        group.traverse((child) => {
            if (child.isMesh && child.material) {
                child.material.transparent = true;
                child.material.opacity = opacity;
            }
        });
    }

    peelToOrgans() {
        // Instantly strips skin and muscles to reveal all internal visceral organs
        this.setLayerOpacity('skin', 0.0);
        this.setLayerOpacity('muscles', 0.0);
        this.setLayerOpacity('vessels', 0.85);
        this.setLayerOpacity('bones', 0.45);
        this.setLayerOpacity('nerves', 0.8);
        this.setLayerOpacity('organs', 1.0);

        this.toggleLayer('skin', false);
        this.toggleLayer('muscles', false);
        this.toggleLayer('vessels', true);
        this.toggleLayer('bones', true);
        this.toggleLayer('nerves', true);
        this.toggleLayer('organs', true);
    }

    skeletonOnly() {
        this.toggleLayer('skin', false);
        this.toggleLayer('muscles', false);
        this.toggleLayer('vessels', false);
        this.toggleLayer('nerves', false);
        this.toggleLayer('organs', false);
        this.toggleLayer('bones', true);
        this.setLayerOpacity('bones', 1.0);
    }

    resetLayers() {
        ['skin', 'muscles', 'vessels', 'bones', 'nerves', 'organs'].forEach((l) => {
            this.toggleLayer(l, true);
            this.setLayerOpacity(l, 1.0);
        });
    }

    /* -------------------------------------------------------------
       CORONAL CUTAWAY DISSECTION VIEW (DEMO PHOTO 2 / heart_3.mp4)
       ------------------------------------------------------------- */
    buildHeartInternalDissection() {
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

        const mitralGeo = new THREE.ConeGeometry(0.24, 0.38, 16, 1, true);
        const mitralMesh = new THREE.Mesh(mitralGeo, valveMat);
        mitralMesh.position.set(-0.32, -0.05, 0.12);
        mitralMesh.rotation.x = Math.PI;
        dissectionGroup.add(mitralMesh);

        const tricuspidMesh = new THREE.Mesh(mitralGeo, valveMat);
        tricuspidMesh.position.set(0.3, -0.02, 0.1);
        tricuspidMesh.rotation.x = Math.PI;
        dissectionGroup.add(tricuspidMesh);

        // 3. Trabecular Inner Muscular Ridges
        for (let i = 0; i < 12; i++) {
            const tGeo = new THREE.SphereGeometry(0.08 + Math.random() * 0.06, 8, 8);
            tGeo.scale(1.0, 1.8, 0.6);
            const tMesh = new THREE.Mesh(tGeo, septumMat);
            const side = (i % 2 === 0) ? -1 : 1;
            tMesh.position.set(side * (0.2 + Math.random() * 0.25), -0.2 - Math.random() * 0.5, 0.05 + Math.random() * 0.1);
            dissectionGroup.add(tMesh);
        }

        this.organGroup.add(dissectionGroup);
    }

    /* -------------------------------------------------------------
       ORGANIC 3D SCULPT FACTORY FOR ALL 78 HUMAN ORGANS
       ------------------------------------------------------------- */
    buildOrganicOrgan(organId) {
        const sculptGroup = new THREE.Group();

        switch (organId) {
            case 'thyroid':
            case 'parathyroid_glands': {
                // Butterfly-shaped Bilateral Lobes & Isthmus across Trachea
                const lobeMat = this.getMaterial('#d97706', 'thyroid_lobes', 'glandular');
                [-0.45, 0.45].forEach((side) => {
                    const lGeo = new THREE.SphereGeometry(0.48, 24, 24);
                    lGeo.scale(0.7, 1.4, 0.6);
                    const lMesh = new THREE.Mesh(lGeo, lobeMat);
                    lMesh.position.set(side * 0.45, side * 0.08, 0.08);
                    lMesh.rotation.z = side * -0.25;
                    sculptGroup.add(lMesh);
                });
                const isthmusGeo = new THREE.BoxGeometry(0.55, 0.28, 0.2);
                const isthmusMesh = new THREE.Mesh(isthmusGeo, lobeMat);
                isthmusMesh.position.set(0, -0.15, 0.12);
                sculptGroup.add(isthmusMesh);

                // Tracheal cartilaginous rings behind thyroid
                const ringsCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0, 0.9, -0.1),
                    new THREE.Vector3(0, -0.9, -0.1)
                ]);
                const ringsMesh = new THREE.Mesh(new THREE.TubeGeometry(ringsCurve, 16, 0.26, 16, false), this.getMaterial('#e0f2fe', 'trachea_bed', 'cartilage'));
                sculptGroup.add(ringsMesh);

                this.registerSegment('thyroid_lobes', sculptGroup, { name: 'Thyroid Lobes & Isthmus', color: '#d97706' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'pancreas': {
                // Elongated Lobulated Gland with Head, Body & Tail
                const pancCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-0.9, -0.15, 0.05),
                    new THREE.Vector3(-0.3, 0.1, 0.08),
                    new THREE.Vector3(0.4, 0.05, 0.06),
                    new THREE.Vector3(0.85, -0.25, 0.02)
                ]);
                const pancMesh = new THREE.Mesh(new THREE.TubeGeometry(pancCurve, 32, 0.24, 16, false), this.getMaterial('#facc15', 'pancreatic_body', 'glandular'));
                sculptGroup.add(pancMesh);

                // C-shaped Duodenal sweep embracing pancreatic head
                const duoCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.85, 0.45, 0.0),
                    new THREE.Vector3(1.2, 0.1, 0.0),
                    new THREE.Vector3(1.15, -0.5, 0.0),
                    new THREE.Vector3(0.65, -0.65, 0.0)
                ]);
                const duoMesh = new THREE.Mesh(new THREE.TubeGeometry(duoCurve, 24, 0.16, 12, false), this.getMaterial('#ea580c', 'duodenum_c_loop', 'mucosa'));
                sculptGroup.add(duoMesh);

                this.registerSegment('pancreatic_body', sculptGroup, { name: 'Pancreas (Head, Body & Tail)', color: '#facc15' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'spleen': {
                // Purplish-red Ovoid Viscus with Splenic Hilum
                const spGeo = new THREE.SphereGeometry(0.85, 24, 24);
                spGeo.scale(0.85, 1.35, 0.65);
                const spMesh = new THREE.Mesh(spGeo, this.getMaterial('#831843', 'spleen_pulp', 'sponge_lymph'));
                sculptGroup.add(spMesh);

                // Splenic vessels entering hilum
                const vCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.5, 0.15, 0.0),
                    new THREE.Vector3(0.05, 0.0, 0.0)
                ]);
                sculptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(vCurve, 12, 0.06, 8, false), this.getMaterial('#ef4444', 'splenic_artery')));

                this.registerSegment('spleen_pulp', sculptGroup, { name: 'Splenic Parenchyma & Hilum', color: '#831843' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'urinary_bladder':
            case 'bladder': {
                // Muscular Detrusor Chamber & Trigone
                const bladGeo = new THREE.SphereGeometry(0.95, 24, 24);
                bladGeo.scale(1.1, 1.2, 1.05);
                const bladMesh = new THREE.Mesh(bladGeo, this.getMaterial('#f43f5e', 'detrusor_muscle', 'muscle'));
                sculptGroup.add(bladMesh);

                // Ureters entering posterior base
                [-0.4, 0.4].forEach((uX) => {
                    const uCurve = new THREE.CatmullRomCurve3([
                        new THREE.Vector3(uX * 1.5, 1.1, -0.4),
                        new THREE.Vector3(uX * 0.8, 0.3, -0.2),
                        new THREE.Vector3(uX * 0.5, -0.3, 0.0)
                    ]);
                    sculptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(uCurve, 16, 0.045, 8, false), this.getMaterial('#c084fc', `ureter_${uX}`)));
                });

                this.registerSegment('detrusor_muscle', sculptGroup, { name: 'Urinary Bladder (Detrusor)', color: '#f43f5e' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'larynx': {
                // Cartilaginous complex (Thyroid cartilage & Cricoid ring)
                const cGeo = new THREE.CylinderGeometry(0.55, 0.45, 1.2, 16, 4, true);
                cGeo.scale(1.0, 1.0, 0.8);
                const cMesh = new THREE.Mesh(cGeo, this.getMaterial('#e0f2fe', 'laryngeal_cartilage', 'cartilage'));
                sculptGroup.add(cMesh);

                const vocalMat = this.getMaterial('#fecdd3', 'vocal_folds');
                const vMesh = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.08, 0.35), vocalMat);
                vMesh.position.set(0, 0.05, 0);
                sculptGroup.add(vMesh);

                this.registerSegment('laryngeal_cartilage', sculptGroup, { name: 'Larynx & Vocal Cords', color: '#38bdf8' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'appendix':
            case 'cecum': {
                // Vermiform curved pouch off Cecum
                const cecGeo = new THREE.SphereGeometry(0.7, 20, 20);
                cecGeo.scale(1.0, 1.3, 0.9);
                sculptGroup.add(new THREE.Mesh(cecGeo, this.getMaterial('#10b981', 'cecum_pouch', 'mucosa')));

                const appCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.1, -0.65, 0.1),
                    new THREE.Vector3(0.35, -0.95, 0.15),
                    new THREE.Vector3(0.55, -1.25, 0.05),
                    new THREE.Vector3(0.45, -1.5, -0.1)
                ]);
                const appMesh = new THREE.Mesh(new THREE.TubeGeometry(appCurve, 24, 0.08, 10, false), this.getMaterial('#fb7185', 'vermiform_appendix', 'mucosa'));
                sculptGroup.add(appMesh);

                this.registerSegment('vermiform_appendix', sculptGroup, { name: 'Vermiform Appendix & Cecum', color: '#fb7185' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'ascending_colon':
            case 'transverse_colon':
            case 'descending_colon':
            case 'sigmoid_colon':
            case 'rectum': {
                // Haustrated segmented colon loop with Teniae Coli
                const colonCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(-0.9, -1.1, 0.1),
                    new THREE.Vector3(-0.95, 0.6, 0.1),
                    new THREE.Vector3(0, 0.75, 0.15),
                    new THREE.Vector3(0.95, 0.6, 0.1),
                    new THREE.Vector3(0.9, -1.1, 0.1)
                ]);
                const colMesh = new THREE.Mesh(new THREE.TubeGeometry(colonCurve, 36, 0.28, 16, false), this.getMaterial('#10b981', 'haustrated_colon', 'mucosa'));
                sculptGroup.add(colMesh);

                this.registerSegment('haustrated_colon', sculptGroup, { name: 'Large Colon (Haustra & Teniae Coli)', color: '#10b981' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'prostate': {
                // Walnut-shaped Gland around Urethra
                const prostGeo = new THREE.SphereGeometry(0.75, 20, 20);
                prostGeo.scale(1.2, 0.95, 0.95);
                const prostMesh = new THREE.Mesh(prostGeo, this.getMaterial('#f59e0b', 'prostate_gland', 'glandular'));
                sculptGroup.add(prostMesh);

                // Prostatic urethra traversing core
                const urCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0, 0.8, 0),
                    new THREE.Vector3(0, -0.8, 0)
                ]);
                sculptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(urCurve, 12, 0.08, 8, false), this.getMaterial('#fb7185', 'urethral_canal')));

                this.registerSegment('prostate_gland', sculptGroup, { name: 'Prostate Gland & Urethra', color: '#f59e0b' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'uterus': {
                // Muscular Myometrium & Fallopian Tubes
                const utGeo = new THREE.ConeGeometry(0.65, 1.2, 20);
                utGeo.scale(1.2, 1.0, 0.75);
                const utMesh = new THREE.Mesh(utGeo, this.getMaterial('#f43f5e', 'uterine_myometrium', 'muscle'));
                utMesh.rotation.x = Math.PI;
                sculptGroup.add(utMesh);

                [-1, 1].forEach((side) => {
                    const tubeCurve = new THREE.CatmullRomCurve3([
                        new THREE.Vector3(side * 0.45, 0.45, 0),
                        new THREE.Vector3(side * 0.95, 0.55, 0.1),
                        new THREE.Vector3(side * 1.35, 0.35, -0.05)
                    ]);
                    sculptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 16, 0.055, 8, false), this.getMaterial('#fb7185', `tube_${side}`)));
                });

                this.registerSegment('uterine_myometrium', sculptGroup, { name: 'Uterus & Fallopian Tubes', color: '#f43f5e' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            case 'diaphragm': {
                // Expansive Musculotendinous Dome
                const diaGeo = new THREE.CylinderGeometry(1.6, 1.4, 0.45, 32, 1, true);
                diaGeo.scale(1.15, 0.7, 0.9);
                const diaMesh = new THREE.Mesh(diaGeo, this.getMaterial('#dc2626', 'diaphragm_dome', 'muscle'));
                sculptGroup.add(diaMesh);

                this.registerSegment('diaphragm_dome', sculptGroup, { name: 'Thoracic Diaphragm Dome', color: '#dc2626' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }

            default: {
                // High-resolution Organic Visceral Specimen (Multilobular with vascular hilum)
                const visGeo = new THREE.SphereGeometry(0.85, 28, 28);
                visGeo.scale(1.0, 1.35, 0.85);
                const visMesh = new THREE.Mesh(visGeo, this.getMaterial('#d94828', `${organId}_body`, 'muscle'));
                sculptGroup.add(visMesh);

                // Vascular supply branch
                const vCurve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(0.5, 0.8, 0.1),
                    new THREE.Vector3(0.1, 0.0, 0.05),
                    new THREE.Vector3(-0.4, -0.7, -0.05)
                ]);
                sculptGroup.add(new THREE.Mesh(new THREE.TubeGeometry(vCurve, 16, 0.045, 8, false), this.getMaterial('#ef4444', `${organId}_vessels`)));

                this.registerSegment(`${organId}_body`, sculptGroup, { name: `${organId.replace('_', ' ').toUpperCase()} Structure`, color: '#d94828' }, new THREE.Vector3(0, 0, 1.2));
                break;
            }
        }

        this.organGroup.add(sculptGroup);
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
       DISSECTION ACTIONS & ANIMATION TOGGLES
       ------------------------------------------------------------- */
    toggleCutaway() {
        this.isCutawayActive = !this.isCutawayActive;
        this.loadOrgan(this.currentOrganId);
        return this.isCutawayActive;
    }

    toggleExplode() {
        this.isExploded = !this.isExploded;
        const targetVal = this.isExploded ? 1.0 : 0.0;
        this.setExplode(targetVal);

        const slider = document.getElementById('explodeSlider');
        if (slider) slider.value = targetVal * 100;
        const disp = document.getElementById('explodeValueDisplay');
        if (disp) disp.textContent = `${Math.round(targetVal * 100)}%`;
        const ind = document.getElementById('explodeStatus');
        if (ind) {
            ind.textContent = this.isExploded ? 'ON' : 'OFF';
            ind.classList.toggle('active', this.isExploded);
        }

        return this.isExploded;
    }

    setExplode(factor) {
        this.explodeDistance = Math.max(0, Math.min(1.5, factor));

        this.segmentsMap.forEach((item) => {
            if (item.mesh && item.explodeVector) {
                const targetPos = item.originalPos.clone().add(
                    item.explodeVector.clone().multiplyScalar(this.explodeDistance)
                );

                new TWEEN.Tween(item.mesh.position)
                    .to(targetPos, 220)
                    .easing(TWEEN.Easing.Quadratic.Out)
                    .start();

                if (item.pinGroup) {
                    new TWEEN.Tween(item.pinGroup.position)
                        .to(targetPos, 220)
                        .easing(TWEEN.Easing.Quadratic.Out)
                        .start();
                }
            }
        });
    }

    resetCamera() {
        const targetPos = (this.currentOrganId === 'full_body') 
            ? new THREE.Vector3(0, 0.4, 4.6) 
            : new THREE.Vector3(0, 0, 4.2);

        new TWEEN.Tween(this.camera.position)
            .to(targetPos, 700)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();

        new TWEEN.Tween(this.controls.target)
            .to({ x: 0, y: 0, z: 0 }, 700)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
    }

    /* -------------------------------------------------------------
       RAYCASTING & INTERACTION EVENTS
       ------------------------------------------------------------- */
    initEventListeners() {
        const dom = this.renderer.domElement;

        dom.addEventListener('pointermove', (e) => this.onPointerMove(e));
        dom.addEventListener('click', (e) => this.onPointerClick(e));

        window.addEventListener('resize', () => {
            const width = this.container.clientWidth;
            const height = this.container.clientHeight;
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        });
    }

    onPointerMove(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hits = this.raycaster.intersectObjects(this.organGroup.children, true);

        if (hits.length > 0) {
            let hitSegId = null;
            let curr = hits[0].object;

            while (curr && curr !== this.organGroup) {
                if (curr.userData && curr.userData.segmentId) {
                    hitSegId = curr.userData.segmentId;
                    break;
                }
                curr = curr.parent;
            }

            if (hitSegId !== this.hoveredSegment) {
                this.hoveredSegment = hitSegId;
                window.dispatchEvent(new CustomEvent('segmentHover', { detail: { segmentId: hitSegId } }));
            }
        } else {
            if (this.hoveredSegment) {
                this.hoveredSegment = null;
                window.dispatchEvent(new CustomEvent('segmentHover', { detail: { segmentId: null } }));
            }
        }
    }

    onPointerClick(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hits = this.raycaster.intersectObjects(this.organGroup.children, true);

        if (hits.length > 0) {
            let clickedObj = hits[0].object;
            let targetOrgan = null;
            let segmentId = null;

            while (clickedObj && clickedObj !== this.organGroup) {
                if (clickedObj.userData?.targetOrgan) {
                    targetOrgan = clickedObj.userData.targetOrgan;
                    break;
                }
                if (clickedObj.userData?.segmentId) {
                    segmentId = clickedObj.userData.segmentId;
                    if (clickedObj.userData?.meta?.targetOrgan) {
                        targetOrgan = clickedObj.userData.meta.targetOrgan;
                    }
                    break;
                }
                clickedObj = clickedObj.parent;
            }

            // Click-to-Zoom into organ directly from Full Body
            if (targetOrgan && this.currentOrganId === 'full_body') {
                if (window.uiController) {
                    window.uiController.switchOrgan(targetOrgan);
                }
                return;
            }

            if (segmentId) {
                this.selectSegment(segmentId);
            }
        }
    }

    selectSegment(segmentId) {
        this.selectedSegment = segmentId;
        window.dispatchEvent(new CustomEvent('segmentSelect', { detail: { segmentId } }));
    }

    /* -------------------------------------------------------------
       RENDER LOOP & VITAL PHYSIOLOGICAL MOTIONS
       ------------------------------------------------------------- */
    animate() {
        requestAnimationFrame(() => this.animate());

        TWEEN.update();
        this.controls.update();

        const time = this.clock.getElapsedTime();

        if (this.autoRotateEnabled) {
            this.organGroup.rotation.y += 0.007;
        }

        if (this.dustParticles) {
            this.dustParticles.rotation.y = time * 0.025;
        }

        if (this.vitalMotionEnabled) {
            if (this.currentOrganId === 'heart') {
                // Cardiac Lub-Dub Systole & Diastole with slight helical twist
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
