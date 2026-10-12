"""
Bio3D Nexus - Complete Anatomical Dataset for all 78 Human Organs
"""

ANATOMY_DATA = {
    "heart": {
        "id": "heart",
        "name": "Human Heart",
        "system": "Cardiovascular System",
        "latin": "Cor Humanum",
        "icon": "🫀",
        "overview": "A specialized muscular four-chambered organ displaying authentic anatomical specimen coloration: thick contracting ventricles with adipose fat deposits along coronary grooves, branched coronary arterial tree, ascending aortic arch, blue pulmonary trunk, and internal heart valves with chordae tendineae.",
        "weight": "~300g (Adult)",
        "rate": "60 - 100 BPM",
        "output": "~5.0 L/min",
        "blood_supply": "Left & Right Coronary Arteries (LAD, LCx, RCA)",
        "segments": [
            {
                "id": "ventricles_myocardium",
                "name": "Muscular Ventricles (Myocardium)",
                "color": "#d94828",
                "function": "Thick contracting striated muscle mass driving systemic and pulmonary circulation.",
                "pathology": "Myocardial Infarction, Cardiomyopathy, Ventricular Tachycardia"
            },
            {
                "id": "epicardial_fat",
                "name": "Epicardial Adipose Tissue (Fat Pads)",
                "color": "#eab308",
                "function": "Yellowish adipose cushioning layer lining the coronary sulci.",
                "pathology": "Coronary Artery Disease, Atherosclerosis"
            },
            {
                "id": "coronary_network",
                "name": "Coronary Arteries & Cardiac Veins",
                "color": "#ef4444",
                "function": "Intricate branching vascular tree supplying oxygenated blood directly to myocardium.",
                "pathology": "Atherosclerotic Plaque, STEMI / NSTEMI"
            },
            {
                "id": "aorta",
                "name": "Ascending Aorta & Arch",
                "color": "#e11d48",
                "function": "Grand high-pressure arterial trunk delivering oxygenated blood into systemic circuit.",
                "pathology": "Aortic Aneurysm, Aortic Dissection"
            },
            {
                "id": "pulmonary_trunk",
                "name": "Pulmonary Trunk & Arteries",
                "color": "#1d4ed8",
                "function": "Arterial conduit carrying deoxygenated blood to bilateral lungs.",
                "pathology": "Pulmonary Embolism, Pulmonary Hypertension"
            },
            {
                "id": "vena_cava",
                "name": "Superior & Inferior Vena Cava",
                "color": "#2563eb",
                "function": "Large venous channels returning systemic deoxygenated blood into right atrium.",
                "pathology": "SVC Syndrome, Central Venous Thrombosis"
            },
            {
                "id": "atria_auricles",
                "name": "Left & Right Atria & Auricles",
                "color": "#f1f5f9",
                "function": "Thin-walled receiving chambers with scalloped auricle flaps.",
                "pathology": "Atrial Fibrillation, Atrial Septal Defect"
            },
            {
                "id": "heart_valves",
                "name": "Heart Valves & Chordae Tendineae",
                "color": "#ffffff",
                "function": "Fibrous cusps tethered by parachute strings preventing backflow.",
                "pathology": "Mitral Valve Prolapse, Aortic Stenosis"
            }
        ],
        "clinical_facts": [
            "Pumps approximately 7,500 liters (2,000 gallons) of blood every single day.",
            "Epicardial adipose tissue lines the coronary sulci to protect vessels from myocardial shear stress.",
            "Tricuspid and mitral valves are tethered by chordae tendineae attached to papillary muscles."
        ]
    },
    "aorta": {
        "id": "aorta",
        "name": "Systemic Aorta & Arterial Trunk",
        "system": "Cardiovascular System",
        "latin": "Aorta Thoracica & Abdominalis",
        "icon": "🩸",
        "overview": "The largest elastic artery in the human body originating from the left ventricle, arching superiorly in the mediastinum, and descending through the thorax and abdomen before bifurcating into the common iliac arteries.",
        "weight": "~120g",
        "dimensions": "Length ~40-45 cm, Diameter ~2.5-3.0 cm",
        "blood_supply": "Left Ventricular Outflow Tract; feeds all systemic vascular territories",
        "segments": [
            {
                "id": "aortic_arch",
                "name": "Aortic Arch & Brachiocephalic Branches",
                "color": "#e11d48",
                "function": "Gives off brachiocephalic trunk, left common carotid, and left subclavian arteries.",
                "pathology": "Aortic Arch Syndrome, Coarctation"
            },
            {
                "id": "thoracic_aorta",
                "name": "Descending Thoracic Aorta",
                "color": "#dc2626",
                "function": "Travels along anterior vertebral bodies supplying intercostal and bronchial branches.",
                "pathology": "Thoracic Aortic Aneurysm"
            },
            {
                "id": "abdominal_aorta",
                "name": "Abdominal Aorta & Visceral Branches",
                "color": "#b91c1c",
                "function": "Originates celiac trunk, mesenteric arteries, renal arteries, and iliac bifurcation.",
                "pathology": "Abdominal Aortic Aneurysm (AAA)"
            }
        ],
        "clinical_facts": [
            "Withstands systolic peak pressure pulses exceeding 120-140 mmHg over 2.5 billion cardiac cycles.",
            "Contains specialized baroreceptors in aortic arch adventitia monitoring systemic arterial pressure."
        ]
    },
    "pulmonary_arteries": {
        "id": "pulmonary_arteries",
        "name": "Pulmonary Trunk & Arteries",
        "system": "Cardiovascular System",
        "latin": "Truncus Pulmonalis",
        "icon": "🫀",
        "overview": "Short, wide elastic vessel arising from the right ventricular conus arteriosus and dividing beneath the aortic arch into right and left pulmonary arteries carrying deoxygenated blood to lung capillary beds.",
        "dimensions": "Diameter ~3 cm, Length ~5 cm",
        "blood_supply": "Right Ventricle Outflow",
        "segments": [
            {
                "id": "pt_trunk",
                "name": "Main Pulmonary Trunk",
                "color": "#1d4ed8",
                "function": "Conveys unoxygenated venous blood across pulmonary valve.",
                "pathology": "Pulmonary Stenosis"
            },
            {
                "id": "pt_branches",
                "name": "Left & Right Branching Arteries",
                "color": "#2563eb",
                "function": "Distributes blood through pulmonary hilar fissures into lung lobes.",
                "pathology": "Saddle Pulmonary Embolism"
            }
        ],
        "clinical_facts": [
            "Operates at low hydraulic pressures (mean ~15 mmHg) compared to systemic arterial pressures (~95 mmHg)."
        ]
    },
    "vena_cava": {
        "id": "vena_cava",
        "name": "Superior & Inferior Vena Cava",
        "system": "Cardiovascular System",
        "latin": "Vena Cava Superior & Inferior",
        "icon": "🌊",
        "overview": "The two primary systemic venous return conduits returning deoxygenated blood from the upper body (SVC) and infradiaphragmatic viscera and lower limbs (IVC) into the right atrium of the heart.",
        "dimensions": "IVC Diameter ~2.0-2.5 cm, Length ~22 cm",
        "blood_supply": "Collects all systemic venous return",
        "segments": [
            {
                "id": "svc_channel",
                "name": "Superior Vena Cava Channel",
                "color": "#1e40af",
                "function": "Collects venous blood from cranium, neck, upper extremities, and azygos vein.",
                "pathology": "SVC Obstruction Syndrome"
            },
            {
                "id": "ivc_channel",
                "name": "Inferior Vena Cava Trunk",
                "color": "#2563eb",
                "function": "Ascends along right vertebral margin carrying venous blood from lower body.",
                "pathology": "IVC Thrombosis, Budd-Chiari Syndrome"
            }
        ],
        "clinical_facts": [
            "The IVC is the largest vein in the human body, lacking valves along its retroperitoneal course."
        ]
    },
    "carotid_arteries": {
        "id": "carotid_arteries",
        "name": "Common Carotid Arteries",
        "system": "Cardiovascular System",
        "latin": "Arteria Carotis Communis",
        "icon": "🩸",
        "overview": "Paired cervical high-pressure arterial conduits bifurcating at the thyroid cartilage into internal (cerebral brain perfusion) and external (facial and scalp) carotid arteries.",
        "dimensions": "Diameter ~6-8 mm",
        "blood_supply": "Brachiocephalic trunk (right) and aortic arch (left)",
        "segments": [
            {
                "id": "carotid_sinus",
                "name": "Carotid Sinus & Glomus",
                "color": "#ef4444",
                "function": "Critical baroreceptor and chemoreceptor nexus monitoring arterial PO2 and blood pressure.",
                "pathology": "Carotid Sinus Hypersensitivity"
            },
            {
                "id": "internal_carotid",
                "name": "Internal Carotid Channel",
                "color": "#dc2626",
                "function": "Enters petrous temporal canal to supply Circle of Willis.",
                "pathology": "Carotid Artery Stenosis"
            }
        ],
        "clinical_facts": [
            "Carotid bifurcation is one of the most frequent anatomic sites for atherosclerotic plaque formation."
        ]
    },
    "jugular_veins": {
        "id": "jugular_veins",
        "name": "Internal & External Jugular Veins",
        "system": "Cardiovascular System",
        "latin": "Vena Jugularis Interna",
        "icon": "💧",
        "overview": "Primary bilateral cervical venous drainage pathways draining the intracranial dural venous sinuses, face, and superficial neck directly into the brachiocephalic veins.",
        "dimensions": "Diameter ~9-14 mm",
        "blood_supply": "Drains cranial cerebral circulation",
        "segments": [
            {
                "id": "ijv_bulb",
                "name": "Superior & Inferior Jugular Bulbs",
                "color": "#3b82f6",
                "function": "Direct continuation of sigmoid dural sinus at jugular foramen.",
                "pathology": "Lemierre's Syndrome"
            },
            {
                "id": "ejv_superficial",
                "name": "External Jugular Branch",
                "color": "#60a5fa",
                "function": "Superficial cervical venous tributary over sternocleidomastoid.",
                "pathology": "Jugular Venous Distension (JVD)"
            }
        ],
        "clinical_facts": [
            "Jugular venous pressure (JVP) waveform directly reflects right atrial hemodynamic pressures."
        ]
    },
    "nasal_cavity": {
        "id": "nasal_cavity",
        "name": "Nasal Cavity & Paranasal Sinuses",
        "system": "Respiratory System",
        "latin": "Cavitas Nasi & Sinus Paranasales",
        "icon": "👃",
        "overview": "Complex mucosal and cartilaginous chamber lined with pseudostratified ciliated columnar respiratory epithelium and rich vascular plexus for humidifying, filtering, and thermoregulating inspired air.",
        "dimensions": "Length ~10-12 cm",
        "blood_supply": "Sphenopalatine & ethmoidal arteries (Kiesselbach's plexus)",
        "segments": [
            {
                "id": "conchae_turbinates",
                "name": "Nasal Conchae (Turbinates)",
                "color": "#f472b6",
                "function": "Bony ridges increasing mucosal surface area for air warming and turbulence.",
                "pathology": "Turbinate Hypertrophy"
            },
            {
                "id": "sinuses_chambers",
                "name": "Paranasal Sinus Cavities",
                "color": "#fb7185",
                "function": "Air-filled maxillary, frontal, ethmoidal, and sphenoidal resonators lightening skull weight.",
                "pathology": "Sinusitis"
            }
        ],
        "clinical_facts": [
            "Over 90% of anterior nosebleeds originate in Kiesselbach's plexus on the anterior nasal septum."
        ]
    },
    "pharynx": {
        "id": "pharynx",
        "name": "Human Pharynx (Throat)",
        "system": "Respiratory System",
        "latin": "Pharynx",
        "icon": "🗣️",
        "overview": "Musculomembranous funnel-shaped conduit connecting nasal cavities and mouth to larynx and esophagus, segmented into nasopharynx, oropharynx, and laryngopharynx.",
        "dimensions": "Length ~12-14 cm",
        "blood_supply": "Ascending pharyngeal and facial arteries",
        "segments": [
            {
                "id": "nasopharynx",
                "name": "Nasopharynx & Eustachian Orifice",
                "color": "#ec4899",
                "function": "Airway segment housing adenoids and auditory tube openings.",
                "pathology": "Nasopharyngeal Carcinoma"
            },
            {
                "id": "oropharynx",
                "name": "Oropharynx & Palatine Bed",
                "color": "#f43f5e",
                "function": "Shared conduit for respiratory ventilation and bolus deglutition.",
                "pathology": "Pharyngitis, Sleep Apnea"
            }
        ],
        "clinical_facts": [
            "Pharyngeal constrictor muscles coordinate the involuntary stage of swallowing to prevent tracheal aspiration."
        ]
    },
    "larynx": {
        "id": "larynx",
        "name": "Larynx (Voice Box & Epiglottis)",
        "system": "Respiratory System",
        "latin": "Larynx",
        "icon": "🎙️",
        "overview": "Cartilaginous organ connecting pharynx with trachea containing true vocal cords (vocal folds) for phonation and the epiglottis for laryngeal inlet protection during deglutition.",
        "weight": "~30g",
        "dimensions": "Length ~4-5 cm",
        "blood_supply": "Superior and inferior laryngeal arteries",
        "segments": [
            {
                "id": "thyroid_cartilage",
                "name": "Thyroid & Cricoid Cartilages",
                "color": "#06d6a0",
                "function": "Protective anterior cartilaginous shield (Adam's apple).",
                "pathology": "Laryngomalacia"
            },
            {
                "id": "vocal_folds",
                "name": "True Vocal Folds & Glottis",
                "color": "#ffffff",
                "function": "Fibroelastic bands vibrating to produce sound and human voice.",
                "pathology": "Vocal Cord Nodules, Laryngitis"
            }
        ],
        "clinical_facts": [
            "Innervated by the recurrent laryngeal nerve, which loops under aortic arch on left and subclavian artery on right."
        ]
    },
    "trachea": {
        "id": "trachea",
        "name": "Cartilaginous Trachea (Windpipe)",
        "system": "Respiratory System",
        "latin": "Trachea",
        "icon": "🫁",
        "overview": "Flexible fibrocartilaginous tube reinforced by 16-20 C-shaped hyaline cartilage rings conducting air from larynx to bronchi, lined with the mucociliary escalator.",
        "dimensions": "Length ~10-12 cm, Diameter ~2 cm",
        "blood_supply": "Inferior thyroid and bronchial arteries",
        "segments": [
            {
                "id": "tracheal_rings",
                "name": "Hyaline Cartilage C-Rings",
                "color": "#06d6a0",
                "function": "Prevents tracheal lumen collapse under negative inspiratory pressures.",
                "pathology": "Tracheomalacia"
            },
            {
                "id": "trachealis_muscle",
                "name": "Posterior Trachealis Muscle",
                "color": "#f43f5e",
                "function": "Smooth muscle adjusting luminal diameter during cough reflex.",
                "pathology": "Tracheal Stenosis"
            }
        ],
        "clinical_facts": [
            "The carina at tracheal bifurcation is the most sensitive anatomical reflex trigger site for the human cough reflex."
        ]
    },
    "bronchi": {
        "id": "bronchi",
        "name": "Bronchial Tree & Carina",
        "system": "Respiratory System",
        "latin": "Arbor Bronchialis",
        "icon": "🌿",
        "overview": "Arborizing airway network branching from the primary right and left mainstem bronchi into lobar, segmental, subsegmental bronchi, and terminal bronchioles.",
        "blood_supply": "Bronchial arteries from descending thoracic aorta",
        "segments": [
            {
                "id": "mainstem_bronchi",
                "name": "Right & Left Mainstem Bronchi",
                "color": "#06d6a0",
                "function": "Primary conduct conduits; right bronchus is wider, shorter, and more vertical.",
                "pathology": "Aspiration of Foreign Bodies"
            },
            {
                "id": "segmental_bronchi",
                "name": "Segmental & Subsegmental Tree",
                "color": "#10b981",
                "function": "Supplies 10 bronchopulmonary segments per lung.",
                "pathology": "Bronchiectasis, Bronchospasm"
            }
        ],
        "clinical_facts": [
            "Foreign bodies aspirated by standing individuals lodge preferentially in the posterior basal segment of the right lower lobe."
        ]
    },
    "right_lung": {
        "id": "right_lung",
        "name": "Right Lung (3 Lobes)",
        "system": "Respiratory System",
        "latin": "Pulmo Dexter",
        "icon": "🫁",
        "overview": "Large spongy respiratory organ divided by horizontal and oblique fissures into superior, middle, and inferior lobes, providing ~300 million alveoli for atmospheric gas diffusion.",
        "weight": "~600g (Adult)",
        "capacity": "Total Lung Capacity ~3.2 L",
        "blood_supply": "Pulmonary arteries (deoxygenated gas exchange) and bronchial arteries (parenchymal oxygenation)",
        "segments": [
            {
                "id": "superior_lobe_r",
                "name": "Superior (Upper) Lobe",
                "color": "#ec4899",
                "function": "Apical, anterior, and posterior gas exchange segments.",
                "pathology": "Tuberculosis (Apical Cavitations)"
            },
            {
                "id": "middle_lobe_r",
                "name": "Middle Lobe & Horizontal Fissure",
                "color": "#f472b6",
                "function": "Medial and lateral segments adjacent to right cardiac border.",
                "pathology": "Right Middle Lobe Syndrome"
            },
            {
                "id": "inferior_lobe_r",
                "name": "Inferior (Lower) Lobe",
                "color": "#db2777",
                "function": "Basal diaphragmatic gas exchange matrix.",
                "pathology": "Aspiration Pneumonia"
            }
        ],
        "clinical_facts": [
            "Total alveolar surface area across both human lungs equals 70 to 100 square meters—roughly half a tennis court."
        ]
    },
    "left_lung": {
        "id": "left_lung",
        "name": "Left Lung & Cardiac Notch",
        "system": "Respiratory System",
        "latin": "Pulmo Sinister",
        "icon": "🫁",
        "overview": "Slightly smaller spongy lung divided by an oblique fissure into superior and inferior lobes, featuring an anterior cardiac notch and lingula to accommodate the cardiac apex.",
        "weight": "~550g (Adult)",
        "capacity": "Total Lung Capacity ~2.8 L",
        "blood_supply": "Pulmonary circulation and bronchial arteries",
        "segments": [
            {
                "id": "superior_lobe_l",
                "name": "Superior Lobe & Lingula",
                "color": "#f43f5e",
                "function": "Anterior thoracic gas diffusion; lingula is homologue of right middle lobe.",
                "pathology": "Lobar Pneumonia"
            },
            {
                "id": "inferior_lobe_l",
                "name": "Inferior (Lower) Lobe",
                "color": "#e11d48",
                "function": "Large posterior-inferior basal segments resting on diaphragmatic dome.",
                "pathology": "Pleural Effusion, Atelectasis"
            }
        ],
        "clinical_facts": [
            "Has 2 lobes compared to right lung's 3 lobes to provide spatial clearance for left ventricular cardiac apex."
        ]
    },
    "diaphragm": {
        "id": "diaphragm",
        "name": "Thoracoabdominal Diaphragm",
        "system": "Respiratory System",
        "latin": "Diaphragma",
        "icon": "🎪",
        "overview": "Dome-shaped musculofibrous septum separating thoracic and abdominal cavities; primary muscle of inspiration contracting downward to create negative intrathoracic pleural pressure.",
        "dimensions": "Surface area ~250 cm²",
        "blood_supply": "Superior and inferior phrenic, pericardiacophrenic arteries",
        "segments": [
            {
                "id": "central_tendon",
                "name": "Central Tendon Aponeurosis",
                "color": "#f1f5f9",
                "function": "Strong aponeurotic center through which IVC caval foramen passes.",
                "pathology": "Diaphragmatic Hernia"
            },
            {
                "id": "muscular_crura",
                "name": "Muscular Domes & Crura",
                "color": "#8b5cf6",
                "function": "Contractile muscle fibers anchored to costal margin and lumbar vertebrae.",
                "pathology": "Diaphragmatic Rupture, Phrenic Palsy"
            }
        ],
        "clinical_facts": [
            "Innervated exclusively by the paired phrenic nerves arising from cervical roots C3, C4, C5 ('keeps the diaphragm alive')."
        ]
    },
    "brain": {
        "id": "brain",
        "name": "Human Brain & Encephalon",
        "system": "Nervous System",
        "latin": "Encephalon",
        "icon": "🧠",
        "overview": "Central biological computer encased within neurocranium comprising ~86 billion neurons and trillions of synaptic connections coordinating consciousness, sensory perception, motor execution, cognition, and autonomic regulation.",
        "weight": "~1,400g (Adult)",
        "blood_supply": "Internal Carotid & Vertebral Arteries (Circle of Willis)",
        "segments": [
            {
                "id": "cerebral_cortex",
                "name": "Cerebral Hemispheres (Gyri & Sulci)",
                "color": "#38bdf8",
                "function": "Higher cognitive synthesis, voluntary motor planning, sensory processing.",
                "pathology": "Stroke, Alzheimer's Disease, Epilepsy"
            },
            {
                "id": "cerebellum",
                "name": "Cerebellum (Arbor Vitae)",
                "color": "#10b981",
                "function": "Precision fine motor control, vestibular balance, dynamic trajectory coordination.",
                "pathology": "Cerebellar Ataxia"
            },
            {
                "id": "brainstem",
                "name": "Brainstem (Pons & Medulla)",
                "color": "#f59e0b",
                "function": "Vital autonomic centers regulating cardiac rhythm, respiration, and cranial reflexes.",
                "pathology": "Brainstem Infarction, Coma"
            },
            {
                "id": "temporal_lobe",
                "name": "Temporal Lobes & Hippocampus",
                "color": "#60a5fa",
                "function": "Auditory processing, language comprehension (Wernicke), memory encoding.",
                "pathology": "Temporal Lobe Epilepsy"
            },
            {
                "id": "circle_of_willis",
                "name": "Cerebral Arterial Vasculature",
                "color": "#ef4444",
                "function": "Anastomotic ring buffering intracranial perfusion pressures.",
                "pathology": "Berry Aneurysm, Subarachnoid Hemorrhage"
            }
        ],
        "clinical_facts": [
            "Consumes 20% of resting human bodily oxygen and glucose despite accounting for only 2% of total body weight.",
            "Contains over 50% of all central nervous neurons packed into the densely folded cerebellar folia."
        ]
    },
    "cerebrum": {
        "id": "cerebrum",
        "name": "Cerebrum (Cerebral Cortex)",
        "system": "Nervous System",
        "latin": "Cerebrum",
        "icon": "🧠",
        "overview": "Divided into left and right hemispheres connected by corpus callosum; folded into sulci and gyri across frontal, parietal, temporal, and occipital lobes.",
        "weight": "~1,100g",
        "blood_supply": "Anterior, Middle & Posterior Cerebral Arteries",
        "segments": [
            {
                "id": "frontal_lobe",
                "name": "Frontal Lobe & Motor Strip",
                "color": "#38bdf8",
                "function": "Executive decision-making, personality, motor homunculus.",
                "pathology": "Frontotemporal Dementia"
            },
            {
                "id": "occipital_lobe",
                "name": "Occipital Lobe & Calcarine Cortex",
                "color": "#818cf8",
                "function": "Primary and associative visual cortex processing.",
                "pathology": "Cortical Blindness"
            }
        ],
        "clinical_facts": [
            "If completely flattened out, the deeply convoluted human cerebral cortex would cover roughly 2.5 square feet."
        ]
    },
    "cerebellum": {
        "id": "cerebellum",
        "name": "Cerebellum (Folia & Nuclei)",
        "system": "Nervous System",
        "latin": "Cerebellum",
        "icon": "🧠",
        "overview": "Located in posterior cranial fossa beneath tentorium cerebelli; contains intricate tree-like branching white matter (arbor vitae) and dense Purkinje cell layers.",
        "weight": "~150g",
        "blood_supply": "PICA, AICA, and Superior Cerebellar Arteries",
        "segments": [
            {
                "id": "cerebellar_hemispheres",
                "name": "Lateral Hemispheres & Folia",
                "color": "#10b981",
                "function": "Motor planning of limbs and skilled learned actions.",
                "pathology": "Dysmetria, Intention Tremor"
            },
            {
                "id": "vermis_center",
                "name": "Cerebellar Vermis & Flocculus",
                "color": "#34d399",
                "function": "Axial trunk stability, vestibulospinal postural reflexes.",
                "pathology": "Truncal Ataxia"
            }
        ],
        "clinical_facts": [
            "Contains approximately 50 billion of the brain's 86 billion total neurons."
        ]
    },
    "brainstem": {
        "id": "brainstem",
        "name": "Brainstem (Midbrain, Pons & Medulla)",
        "system": "Nervous System",
        "latin": "Truncus Encephali",
        "icon": "🕹️",
        "overview": "Stalk connecting forebrain to spinal cord; transmits all ascending sensory and descending motor tracts and houses cranial nerve nuclei III through XII.",
        "weight": "~25g",
        "blood_supply": "Basilar artery and vertebral arterial branches",
        "segments": [
            {
                "id": "pons_varolii",
                "name": "Pons & Reticular Activating System",
                "color": "#f59e0b",
                "function": "Pneumotaxic respiratory control, relay to cerebellum, sleep/arousal.",
                "pathology": "Locked-In Syndrome"
            },
            {
                "id": "medulla_oblongata",
                "name": "Medulla Oblongata & Pyramids",
                "color": "#d97706",
                "function": "Cardiac vasomotor and respiratory rhythmicity pacemakers.",
                "pathology": "Medullary Compression, Brain Herniation"
            }
        ],
        "clinical_facts": [
            "Damage to the medullary cardiovascular and respiratory centers is universally incompatible with independent life."
        ]
    },
    "spinal_cord": {
        "id": "spinal_cord",
        "name": "Spinal Cord & Cauda Equina",
        "system": "Nervous System",
        "latin": "Medulla Spinalis",
        "icon": "⚡",
        "overview": "Cylindrical neural conduit extending from foramen magnum to L1-L2 conus medullaris, giving off 31 pairs of spinal nerves mediating sensory pathways and motor reflexes.",
        "weight": "~35g",
        "dimensions": "Length ~43-45 cm",
        "blood_supply": "Anterior and posterior spinal arteries, radicular arteries",
        "segments": [
            {
                "id": "cervical_enlargement",
                "name": "Cervical & Lumbar Cord Enlargements",
                "color": "#facc15",
                "function": "Dense motor neuronal pools for upper and lower extremities.",
                "pathology": "Spinal Cord Injury, Brown-Séquard"
            },
            {
                "id": "cauda_equina",
                "name": "Conus Medullaris & Cauda Equina",
                "color": "#fde047",
                "function": "Lumbosacral spinal nerve root bundle resembling a horse's tail.",
                "pathology": "Cauda Equina Syndrome"
            }
        ],
        "clinical_facts": [
            "Terminates anatomically at the L1-L2 vertebral disc in adults, permitting safe lumbar punctures at the L3-L4 interspace."
        ]
    },
    "eye": {
        "id": "eye",
        "name": "Human Eye (Ocular Globe)",
        "system": "Sensory Organs",
        "latin": "Oculus",
        "icon": "👁️",
        "overview": "Complex spherical optical organ capturing light photons, focusing rays through cornea and lens onto photoreceptive retina, and transmitting visual data via optic nerve.",
        "dimensions": "Diameter ~24 mm",
        "blood_supply": "Ophthalmic artery (Central Retinal Artery)",
        "segments": [
            {
                "id": "cornea",
                "name": "Cornea Window",
                "color": "#00f0ff",
                "function": "Transparent anterior dome providing 70% of optical refracting power.",
                "pathology": "Keratoconus, Corneal Ulcer"
            },
            {
                "id": "iris_pupil",
                "name": "Iris & Pupillary Aperture",
                "color": "#14b8a6",
                "function": "Pigmented diaphragm regulating aperture diameter via sphincter and dilator muscles.",
                "pathology": "Iritis, Glaucoma"
            },
            {
                "id": "sclera_retina",
                "name": "Sclera & Photoreceptor Retina",
                "color": "#f1f5f9",
                "function": "Tough collagenous outer shell enclosing 120M rods and 6M cones.",
                "pathology": "Retinal Detachment, Macular Degeneration"
            },
            {
                "id": "lens",
                "name": "Crystalline Lens & Ciliary Body",
                "color": "#a5f3fc",
                "function": "Flexible biconvex structure fine-tuning focus for dynamic accommodation.",
                "pathology": "Cataracts, Presbyopia"
            },
            {
                "id": "optic_nerve",
                "name": "Optic Nerve Bundle (CN II)",
                "color": "#fbbf24",
                "function": "Conveys 1.2 million myelinated retinal ganglion axons to brain.",
                "pathology": "Optic Neuritis, Papilledema"
            }
        ],
        "clinical_facts": [
            "The human retina processes visual information at an estimated transmission rate equivalent to 10 million bits per second."
        ]
    },
    "inner_ear": {
        "id": "inner_ear",
        "name": "Inner Ear (Vestibulocochlear Organ)",
        "system": "Sensory Organs",
        "latin": "Auris Interna",
        "icon": "👂",
        "overview": "Bony and membranous labyrinth embedded in petrous temporal bone containing the spiral cochlea for auditory transduction and semicircular canals for 3D vestibular balance.",
        "blood_supply": "Labyrinthine artery",
        "segments": [
            {
                "id": "cochlea_organ",
                "name": "Spiral Cochlea & Organ of Corti",
                "color": "#c084fc",
                "function": "Fluid-filled snail-shell transducing sound waves via stereocilia hair cells.",
                "pathology": "Sensorineural Hearing Loss, Tinnitus"
            },
            {
                "id": "semicircular_canals",
                "name": "Semicircular Canals & Vestibule",
                "color": "#a855f7",
                "function": "Three orthogonal fluid loops detecting angular and linear head accelerations.",
                "pathology": "Benign Paroxysmal Positional Vertigo (BPPV)"
            }
        ],
        "clinical_facts": [
            "Contains the smallest fluid-filled sensory canals in the body, with auditory frequencies mapped tonotopically along basilar membrane."
        ]
    },
    "olfactory_bulb": {
        "id": "olfactory_bulb",
        "name": "Olfactory Bulb & Epithelium",
        "system": "Sensory Organs",
        "latin": "Bulbus Olfactorius",
        "icon": "👃",
        "overview": "Paired forebrain structures resting on the cribriform plate of ethmoid bone receiving olfactory nerve axons directly from the nasal roof.",
        "blood_supply": "Anterior cerebral arterial branches",
        "segments": [
            {
                "id": "olfactory_glomeruli",
                "name": "Olfactory Glomeruli & Mitral Cells",
                "color": "#facc15",
                "function": "Primary sensory relay processing volatile odorant chemical signatures.",
                "pathology": "Anosmia, Parosmia"
            }
        ],
        "clinical_facts": [
            "The only primary sensory pathway in the human nervous system that projects directly to cerebral cortex without thalamic gating."
        ]
    },
    "tongue": {
        "id": "tongue",
        "name": "Tongue & Gustatory Papillae",
        "system": "Sensory Organs",
        "latin": "Lingua",
        "icon": "👅",
        "overview": "Muscular hydrostat covered in mucosal gustatory papillae (filiform, fungiform, foliate, circumvallate) essential for taste, speech phonetics, and food mastication/swallowing.",
        "weight": "~70g",
        "blood_supply": "Lingual artery from external carotid",
        "segments": [
            {
                "id": "papillae_taste",
                "name": "Gustatory Taste Buds & Papillae",
                "color": "#f43f5e",
                "function": "Chemoreceptors sensing sweet, salty, sour, bitter, and umami tastes.",
                "pathology": "Ageusia, Glossitis"
            },
            {
                "id": "intrinsic_muscles",
                "name": "Intrinsic & Extrinsic Lingual Muscles",
                "color": "#dc2626",
                "function": "Complex interwoven striated muscle fibers executing fine speech shapes.",
                "pathology": "Hypoglossal Nerve Palsy"
            }
        ],
        "clinical_facts": [
            "Contains approximately 8,000 to 10,000 taste buds, each replaced every 10 to 14 days."
        ]
    },
    "teeth": {
        "id": "teeth",
        "name": "Teeth & Dentition (32 Adult Teeth)",
        "system": "Digestive System",
        "latin": "Dentes",
        "icon": "🦷",
        "overview": "Calcified hard structures embedded in the alveolar processes of maxilla and mandible specialized for mechanical shearing, tearing, and grinding of ingested food.",
        "blood_supply": "Superior and inferior alveolar arteries",
        "segments": [
            {
                "id": "enamel_crown",
                "name": "Enamel Crown & Dentin",
                "color": "#f8fafc",
                "function": "Hardest biological substance in human body (96% mineralized hydroxyapatite).",
                "pathology": "Dental Caries"
            },
            {
                "id": "pulp_cavity",
                "name": "Dental Pulp & Periodontal Root",
                "color": "#f43f5e",
                "function": "Vascular and sensory nerve tissue anchoring tooth into alveolar bone.",
                "pathology": "Pulpitis, Periodontitis"
            }
        ],
        "clinical_facts": [
            "Tooth enamel is harder than steel or bone and cannot regenerate once destroyed because ameloblasts die after tooth eruption."
        ]
    },
    "salivary_glands": {
        "id": "salivary_glands",
        "name": "Salivary Glands (Parotid, Submandibular)",
        "system": "Digestive System",
        "latin": "Glandulae Salivariae",
        "icon": "💧",
        "overview": "Three major paired exocrine glands (Parotid, Submandibular, Sublingual) producing 1.0-1.5 liters of enzyme-rich saliva daily for lubrication and carbohydrate digestion.",
        "weight": "~60g combined",
        "blood_supply": "Branches of external carotid artery",
        "segments": [
            {
                "id": "parotid_gland",
                "name": "Parotid Gland & Stensen's Duct",
                "color": "#facc15",
                "function": "Largest salivary gland producing serous amylase-rich saliva.",
                "pathology": "Mumps, Parotitis, Pleomorphic Adenoma"
            },
            {
                "id": "submandibular_gland",
                "name": "Submandibular & Sublingual Glands",
                "color": "#eab308",
                "function": "Produces 70% of resting saliva via Wharton's duct beneath tongue.",
                "pathology": "Sialolithiasis"
            }
        ],
        "clinical_facts": [
            "Facial nerve (CN VII) traverses directly through the substance of the parotid gland, dividing into its five motor terminal branches."
        ]
    },
    "esophagus": {
        "id": "esophagus",
        "name": "Esophagus (Muscular Food Pipe)",
        "system": "Digestive System",
        "latin": "Esophagus",
        "icon": "🥖",
        "overview": "Fibromuscular tube traversing neck, posterior mediastinum, and esophageal hiatus of diaphragm to propel food boluses from pharynx to stomach via coordinated peristalsis.",
        "dimensions": "Length ~25 cm",
        "blood_supply": "Inferior thyroid, thoracic aortic branches, left gastric artery",
        "segments": [
            {
                "id": "upper_esophagus",
                "name": "Cervical & Upper Thoracic Esophagus",
                "color": "#fb7185",
                "function": "Contains voluntary striated muscle transitioning into smooth muscle.",
                "pathology": "Zenker's Diverticulum"
            },
            {
                "id": "les_junction",
                "name": "Lower Esophageal Sphincter (LES) & Z-Line",
                "color": "#f43f5e",
                "function": "Physiological high-pressure zone preventing gastric acid reflux.",
                "pathology": "GERD, Barrett's Esophagus, Achalasia"
            }
        ],
        "clinical_facts": [
            "The normal esophageal mucosa transitions abruptly from stratified squamous to columnar epithelium at the Z-line (gastroesophageal junction)."
        ]
    },
    "stomach": {
        "id": "stomach",
        "name": "Stomach (Gastric Chamber)",
        "system": "Digestive System",
        "latin": "Gaster",
        "icon": "🥐",
        "overview": "J-shaped distensible muscular reservoir secreting hydrochloric acid and pepsinogen to break down ingested meals into acidic chyme before metered release into duodenum.",
        "weight": "~150g (Empty)",
        "capacity": "1.0 - 1.5 Liters",
        "blood_supply": "Celiac trunk branches (Left & right gastric, gastroepiploic, short gastric arteries)",
        "segments": [
            {
                "id": "gastric_fundus_body",
                "name": "Gastric Fundus & Body",
                "color": "#f59e0b",
                "function": "Produces intrinsic factor and hydrochloric acid via parietal cells.",
                "pathology": "Gastritis, Pernicious Anemia"
            },
            {
                "id": "greater_lesser_curvature",
                "name": "Greater & Lesser Curvatures",
                "color": "#ea580c",
                "function": "Muscular boundaries with deep rugal folds allowing volume expansion.",
                "pathology": "Peptic Ulcer Disease"
            },
            {
                "id": "pylorus_antrum",
                "name": "Pyloric Antrum & Sphincter",
                "color": "#d97706",
                "function": "Triturates food particles and meters chyme delivery into duodenum.",
                "pathology": "Pyloric Stenosis, Gastric Carcinoma"
            },
            {
                "id": "esophageal_junction",
                "name": "Cardia & Gastroesophageal Junction",
                "color": "#fb7185",
                "function": "Entrance valve receiving swallowed boluses.",
                "pathology": "Hiatal Hernia"
            }
        ],
        "clinical_facts": [
            "Gastric parietal cells secrete hydrochloric acid at pH 1.5-2.0—acidic enough to dissolve metals—protected by a bicarbonate-rich mucosal barrier."
        ]
    },
    "duodenum": {
        "id": "duodenum",
        "name": "Duodenal C-Loop (Upper Intestine)",
        "system": "Digestive System",
        "latin": "Duodenum",
        "icon": "🥨",
        "overview": "First and shortest segment of small intestine (~25 cm) curving around head of pancreas, receiving acidic chyme from stomach, bile from liver, and enzymes from pancreas.",
        "dimensions": "Length ~25 cm (12 fingerbreadths)",
        "blood_supply": "Gastroduodenal and superior mesenteric arteries",
        "segments": [
            {
                "id": "duodenal_ampulla",
                "name": "Ampulla of Vater & Major Papilla",
                "color": "#fb923c",
                "function": "Entry portal for bile duct and main pancreatic duct.",
                "pathology": "Duodenal Ulcer, Ampullary Carcinoma"
            },
            {
                "id": "brunner_glands",
                "name": "Brunner's Gland Submucosa",
                "color": "#fdba74",
                "function": "Secretes alkaline mucus neutralizing gastric hydrochloric acid.",
                "pathology": "Duodenitis"
            }
        ],
        "clinical_facts": [
            "Name derives from Latin 'duodecim' meaning twelve, referring to its length of twelve fingerbreadths."
        ]
    },
    "jejunum": {
        "id": "jejunum",
        "name": "Jejunum (Mid Small Intestine)",
        "system": "Digestive System",
        "latin": "Jejunum",
        "icon": "🌀",
        "overview": "Middle portion of small intestine (~2.5 m) characterized by deep mucosal plicae circulares and tall villi maximizing nutrient, carbohydrate, protein, and electrolyte absorption.",
        "dimensions": "Length ~2.5 meters",
        "blood_supply": "Jejunal branches of Superior Mesenteric Artery",
        "segments": [
            {
                "id": "plicae_circulares",
                "name": "Circular Mucosal Folds (Valves of Kerckring)",
                "color": "#fb923c",
                "function": "Triples mucosal absorptive surface area for nutrient uptake.",
                "pathology": "Celiac Disease (Villous Blunting)"
            }
        ],
        "clinical_facts": [
            "Ancient Greeks named it 'empty' ('nestis') because it was always found devoid of food upon post-mortem examinations."
        ]
    },
    "ileum": {
        "id": "ileum",
        "name": "Ileum & Peyer's Patches",
        "system": "Digestive System",
        "latin": "Ileum",
        "icon": "🌀",
        "overview": "Final and longest segment of small intestine (~3.5 m) specialized for absorbing vitamin B12, bile salts, and hosting dense mucosal lymphoid follicles (Peyer's patches).",
        "dimensions": "Length ~3.5 meters",
        "blood_supply": "Ileal branches of Superior Mesenteric Artery",
        "segments": [
            {
                "id": "peyer_patches",
                "name": "Peyer's Patches (GALT)",
                "color": "#f97316",
                "function": "Gut-associated lymphoid tissue monitoring intestinal bacteria.",
                "pathology": "Crohn's Disease (Terminal Ileitis)"
            },
            {
                "id": "ileocecal_valve",
                "name": "Ileocecal Sphincter & Valve",
                "color": "#ea580c",
                "function": "Prevents reflux of colonic bacteria into small intestine.",
                "pathology": "Small Bowel Bacterial Overgrowth (SIBO)"
            }
        ],
        "clinical_facts": [
            "Terminal ileum is the exclusive anatomical site for receptor-mediated absorption of Vitamin B12 bound to intrinsic factor."
        ]
    },
    "cecum": {
        "id": "cecum",
        "name": "Cecum (Large Bowel Pouch)",
        "system": "Digestive System",
        "latin": "Caecum",
        "icon": "🫘",
        "overview": "Blind cul-de-sac pouch marking the commencement of the large intestine in the right iliac fossa, receiving digested slurry from ileum and giving rise to the appendix.",
        "dimensions": "Width ~7.5 cm, Length ~6 cm",
        "blood_supply": "Ileocolic artery from SMA",
        "segments": [
            {
                "id": "cecal_body",
                "name": "Cecal Pouch & Haustra",
                "color": "#10b981",
                "function": "Fluid and salt absorption; site of microbial fermentation.",
                "pathology": "Cecal Volvulus, Cecal Carcinoma"
            }
        ],
        "clinical_facts": [
            "Has the widest diameter of any segment of the large intestine, making it the most prone to rupture according to Laplace's Law."
        ]
    },
    "appendix": {
        "id": "appendix",
        "name": "Vermiform Appendix",
        "system": "Digestive System",
        "latin": "Appendix Vermiformis",
        "icon": "🐛",
        "overview": "Narrow blind-ended finger-like tubular diverticulum arising from the posteromedial cecal wall rich in lymphoid follicles; serves as a probiotic microbial reservoir.",
        "dimensions": "Length ~8-10 cm, Diameter ~6-8 mm",
        "blood_supply": "Appendicular artery from ileocolic artery",
        "segments": [
            {
                "id": "appendicular_lumen",
                "name": "Appendicular Lumen & Lymphoid Stroma",
                "color": "#e11d48",
                "function": "Safe house for commensal gut bacteria during diarrheal purging.",
                "pathology": "Acute Appendicitis, Appendiceal Carcinoid"
            }
        ],
        "clinical_facts": [
            "Acute appendicitis is the most common emergent general surgical condition worldwide, classically identified at McBurney's point."
        ]
    },
    "ascending_colon": {
        "id": "ascending_colon",
        "name": "Ascending Colon & Hepatic Flexure",
        "system": "Digestive System",
        "latin": "Colon Ascendens",
        "icon": "🌀",
        "overview": "Retroperitoneal segment of large intestine ascending vertically from cecum along right flank to liver underside, where it bends sharply at the right hepatic flexure.",
        "dimensions": "Length ~15-20 cm",
        "blood_supply": "Right colic and ileocolic arteries from SMA",
        "segments": [
            {
                "id": "asc_haustra",
                "name": "Colonic Haustra & Taeniae Coli",
                "color": "#10b981",
                "function": "Reabsorbs water and sodium while propelling fecal mass.",
                "pathology": "Right-Sided Colon Cancer"
            }
        ],
        "clinical_facts": [
            "Taeniae coli are three longitudinal bands of smooth muscle whose tonic contraction creates the sacculated haustra."
        ]
    },
    "transverse_colon": {
        "id": "transverse_colon",
        "name": "Transverse Colon & Splenic Flexure",
        "system": "Digestive System",
        "latin": "Colon Transversum",
        "icon": "🌀",
        "overview": "Longest and most mobile colonic segment crossing anterior abdomen from hepatic flexure to spleen underside, suspended by the transverse mesocolon.",
        "dimensions": "Length ~45-50 cm",
        "blood_supply": "Middle colic artery (SMA) and left colic artery (IMA)",
        "segments": [
            {
                "id": "transverse_arch",
                "name": "Transverse Colonic Arch",
                "color": "#059669",
                "function": "Further dehydration of feces and bacterial fermentation.",
                "pathology": "Colonic Obstruction, Toxic Megacolon"
            }
        ],
        "clinical_facts": [
            "Griffiths' point at the splenic flexure is a critical watershed vascular zone prone to ischemic colitis."
        ]
    },
    "descending_colon": {
        "id": "descending_colon",
        "name": "Descending Colon",
        "system": "Digestive System",
        "latin": "Colon Descendens",
        "icon": "🌀",
        "overview": "Retroperitoneal large bowel segment descending down left flank from splenic flexure to pelvic brim, storing solid dehydrated feces before rectal transit.",
        "dimensions": "Length ~25-30 cm",
        "blood_supply": "Left colic artery from Inferior Mesenteric Artery (IMA)",
        "segments": [
            {
                "id": "desc_lumen",
                "name": "Descending Colonic Conduit",
                "color": "#047857",
                "function": "Stores solidified feces and reabsorbs residual electrolytes.",
                "pathology": "Diverticulosis, Left-Sided Colonic Neoplasm"
            }
        ],
        "clinical_facts": [
            "Diverticulosis occurs with greatest frequency in the descending and sigmoid colon due to higher intraluminal pressures."
        ]
    },
    "sigmoid_colon": {
        "id": "sigmoid_colon",
        "name": "Sigmoid Colon (Pelvic Loop)",
        "system": "Digestive System",
        "latin": "Colon Sigmoideum",
        "icon": "🌀",
        "overview": "S-shaped mobile intraperitoneal colonic loop connecting descending colon to rectum, suspended by fan-shaped sigmoid mesocolon in pelvis.",
        "dimensions": "Length ~35-40 cm",
        "blood_supply": "Sigmoid arteries from IMA",
        "segments": [
            {
                "id": "sigmoid_loop",
                "name": "S-Shaped Sigmoid Loop",
                "color": "#065f46",
                "function": "Acts as reservoir for solid stool prior to defecation.",
                "pathology": "Sigmoid Diverticulitis, Sigmoid Volvulus"
            }
        ],
        "clinical_facts": [
            "Sudo-diverticula herniate through circular muscle layer between mesenteric and antimesenteric taeniae coli at points of vessel penetration."
        ]
    },
    "rectum": {
        "id": "rectum",
        "name": "Human Rectum (Rectal Ampulla)",
        "system": "Digestive System",
        "latin": "Rectum",
        "icon": "📦",
        "overview": "Final fixed retroperitoneal segment of large intestine (~12-15 cm) terminating at anal canal, acting as expandable fecal reservoir with Houston valves.",
        "dimensions": "Length ~12-15 cm",
        "blood_supply": "Superior rectal (IMA), middle rectal (internal iliac), inferior rectal arteries",
        "segments": [
            {
                "id": "rectal_ampulla",
                "name": "Rectal Ampulla & Houston Valves",
                "color": "#0f766e",
                "function": "Distensible reservoir triggering defecation reflex via pelvic stretch receptors.",
                "pathology": "Rectal Prolapse, Proctitis, Rectal Carcinoma"
            }
        ],
        "clinical_facts": [
            "When rectal ampulla fills to ~25% capacity, stretch receptors trigger the rectoanal inhibitory reflex (RAIR)."
        ]
    },
    "anal_canal": {
        "id": "anal_canal",
        "name": "Anal Canal & Sphincters",
        "system": "Digestive System",
        "latin": "Canalis Analis",
        "icon": "🔘",
        "overview": "Terminal 3-4 cm of alimentary tract containing internal (involuntary smooth muscle) and external (voluntary skeletal muscle) anal sphincters maintaining fecal continence.",
        "dimensions": "Length ~3-4 cm",
        "blood_supply": "Inferior rectal artery from internal pudendal artery",
        "segments": [
            {
                "id": "dentate_line",
                "name": "Pectinate (Dentate) Line",
                "color": "#115e59",
                "function": "Critical embryological boundary dividing visceral and somatic nerve/lymph territories.",
                "pathology": "Internal vs External Hemorrhoids, Anal Fissure"
            },
            {
                "id": "sphincter_complex",
                "name": "Internal & External Sphincters",
                "color": "#134e4a",
                "function": "Maintains baseline and voluntary fecal and flatus continence.",
                "pathology": "Fecal Incontinence, Perianal Abscess"
            }
        ],
        "clinical_facts": [
            "Lesions above pectinate line are painless (visceral innervation), while lesions below are excruciatingly painful (somatic pudendal innervation)."
        ]
    },
    "liver": {
        "id": "liver",
        "name": "Liver (Hepatic Viscus)",
        "system": "Digestive System",
        "latin": "Hepar",
        "icon": "🫓",
        "overview": "Largest internal solid metabolic organ occupying right hypochondrium; performs detoxification, plasma protein synthesis, glycogen storage, cholesterol synthesis, and bile acid production.",
        "weight": "~1,500g (Adult)",
        "blood_supply": "Hepatic Portal Vein (75% nutrient-rich) & Hepatic Artery (25% oxygenated)",
        "segments": [
            {
                "id": "right_hepatic_lobe",
                "name": "Right Hepatic Lobe",
                "color": "#9a3412",
                "function": "Contains segments V, VI, VII, VIII performing mass metabolic biotransformation.",
                "pathology": "Hepatocellular Carcinoma, Cirrhosis"
            },
            {
                "id": "left_hepatic_lobe",
                "name": "Left Hepatic Lobe",
                "color": "#c2410c",
                "function": "Contains segments II, III, IV flanking falciform ligament.",
                "pathology": "Hepatic Steatosis, Viral Hepatitis"
            },
            {
                "id": "gallbladder_biliary",
                "name": "Gallbladder & Biliary Duct",
                "color": "#84cc16",
                "function": "Concentrates and excretes bile for lipid emulsification.",
                "pathology": "Cholelithiasis, Biliary Colic"
            },
            {
                "id": "inferior_vena_cava_hep",
                "name": "Inferior Vena Cava & Portal Triad",
                "color": "#2563eb",
                "function": "Drains processed hepatic blood into central circulation via hepatic veins.",
                "pathology": "Portal Hypertension, Esophageal Varices"
            }
        ],
        "clinical_facts": [
            "Possesses remarkable regenerative capacity—can reconstitute its full original functional mass from as little as 25% of residual healthy liver tissue.",
            "Synthesizes almost all circulating coagulation factors (I, II, V, VII, IX, X, XI, protein C, protein S)."
        ]
    },
    "gallbladder": {
        "id": "gallbladder",
        "name": "Gallbladder & Biliary Tree",
        "system": "Digestive System",
        "latin": "Vesica Biliaris",
        "icon": "🍐",
        "overview": "Pear-shaped hollow visceral organ resting in fossa on visceral surface of liver right lobe, concentrating hepatic bile 5-10 fold and ejecting it via cystic duct upon cholecystokinin release.",
        "capacity": "30 - 50 mL",
        "blood_supply": "Cystic artery (usually from right hepatic artery)",
        "segments": [
            {
                "id": "fundus_body_gb",
                "name": "Gallbladder Fundus & Body",
                "color": "#84cc16",
                "function": "Reabsorbs water and sodium to concentrate bile salts and cholesterol.",
                "pathology": "Gallstones (Cholelithiasis), Acute Cholecystitis"
            },
            {
                "id": "cystic_duct",
                "name": "Cystic Duct & Spiral Valves of Heister",
                "color": "#65a30d",
                "function": "Connects gallbladder neck to common hepatic duct to form common bile duct.",
                "pathology": "Biliary Stricture, Choledocholithiasis"
            }
        ],
        "clinical_facts": [
            "Cholecystokinin (CCK) released by duodenal I-cells upon fat entry triggers vigorous gallbladder contraction and sphincter of Oddi relaxation."
        ]
    },
    "pancreas": {
        "id": "pancreas",
        "name": "Pancreas (Exocrine & Endocrine)",
        "system": "Digestive System",
        "latin": "Pancreas",
        "icon": "🥖",
        "overview": "Elongated retroperitoneal gland nestled in C-loop of duodenum; dual exocrine (digestive enzymes: lipase, amylase, proteases) and endocrine (insulin, glucagon, somatostatin) organ.",
        "weight": "~80-100g",
        "dimensions": "Length ~15 cm",
        "blood_supply": "Splenic artery, superior and inferior pancreaticoduodenal arteries",
        "segments": [
            {
                "id": "pancreas_head_body",
                "name": "Head, Body & Tail of Pancreas",
                "color": "#facc15",
                "function": "Acinar cells secrete 1.5 L alkaline bicarbonate juice and proenzymes daily.",
                "pathology": "Acute Pancreatitis, Pancreatic Adenocarcinoma"
            },
            {
                "id": "wirsung_duct",
                "name": "Main Pancreatic Duct (Duct of Wirsung)",
                "color": "#fef08a",
                "function": "Conveys digestive enzymes to join bile duct at ampulla of Vater.",
                "pathology": "Chronic Pancreatitis, Duct Obstruction"
            }
        ],
        "clinical_facts": [
            "Pancreatic enzymes are synthesized as inactive zymogens (trypsinogen) to prevent fatal autodigestion of the gland itself."
        ]
    },
    "pituitary": {
        "id": "pituitary",
        "name": "Pituitary Gland (Master Hypophysis)",
        "system": "Endocrine System",
        "latin": "Hypophysis Cerebri",
        "icon": "🔮",
        "overview": "Pea-sized master endocrine gland seated in sella turcica of sphenoid bone, governed by hypothalamus to regulate growth, thyroid, adrenals, gonads, and water balance.",
        "weight": "~0.5g",
        "blood_supply": "Superior and inferior hypophyseal arteries",
        "segments": [
            {
                "id": "adenohypophysis",
                "name": "Anterior Pituitary (Adenohypophysis)",
                "color": "#a855f7",
                "function": "Synthesizes ACTH, TSH, GH, LH, FSH, and Prolactin.",
                "pathology": "Pituitary Adenoma, Acromegaly, Cushing's Disease"
            },
            {
                "id": "neurohypophysis",
                "name": "Posterior Pituitary (Neurohypophysis)",
                "color": "#c084fc",
                "function": "Stores and releases hypothalamic Oxytocin and Vasopressin (ADH).",
                "pathology": "Diabetes Insipidus"
            }
        ],
        "clinical_facts": [
            "Enlarging pituitary macroadenomas compress the overlying optic chiasm, causing classic bitemporal hemianopsia (tunnel vision)."
        ]
    },
    "pineal": {
        "id": "pineal",
        "name": "Pineal Gland (Epiphysis Cerebri)",
        "system": "Endocrine System",
        "latin": "Glandula Pinealis",
        "icon": "🌲",
        "overview": "Small pinecone-shaped endocrine gland near center of brain between superior colliculi, secreting melatonin in response to darkness to calibrate circadian rhythms.",
        "weight": "~0.1g",
        "blood_supply": "Posterior choroidal arteries",
        "segments": [
            {
                "id": "pinealocytes",
                "name": "Pinealocytes & Brain Sand (Corpora Arenacea)",
                "color": "#e879f9",
                "function": "Synthesizes melatonin from serotonin to synchronize 24-hour sleep/wake cycles.",
                "pathology": "Pinealoma, Parinaud's Syndrome"
            }
        ],
        "clinical_facts": [
            "Calcareous deposits ('brain sand') accumulate physiologically in the pineal gland, serving as a radiologic midline landmark on CT scans."
        ]
    },
    "thyroid": {
        "id": "thyroid",
        "name": "Thyroid Gland (Follicular Lobes)",
        "system": "Endocrine System",
        "latin": "Glandula Thyroidea",
        "icon": "🦋",
        "overview": "Butterfly-shaped endocrine gland straddling anterior trachea, secreting thyroxine (T4), triiodothyronine (T3), and calcitonin to regulate basal metabolic rate across every human cell.",
        "weight": "~20-25g",
        "blood_supply": "Superior thyroid (external carotid) and inferior thyroid (thyrocervical trunk) arteries",
        "segments": [
            {
                "id": "thyroid_lobes",
                "name": "Left & Right Follicular Lobes",
                "color": "#f43f5e",
                "function": "Follicular cells trap iodine to synthesize T3 and T4 regulating metabolic rate.",
                "pathology": "Hypothyroidism (Hashimoto's), Hyperthyroidism (Graves')"
            },
            {
                "id": "thyroid_isthmus",
                "name": "Central Isthmus & Pyramidal Lobe",
                "color": "#fb7185",
                "function": "Connects bilateral lobes anterior to 2nd-4th tracheal rings.",
                "pathology": "Thyroid Nodules, Thyroid Carcinoma"
            }
        ],
        "clinical_facts": [
            "Receives one of the highest blood perfusion rates per gram of tissue in the entire human body (approx 5 mL/g/min)."
        ]
    },
    "parathyroid": {
        "id": "parathyroid",
        "name": "Parathyroid Glands (4 Glands)",
        "system": "Endocrine System",
        "latin": "Glandulae Parathyroideae",
        "icon": "🟡",
        "overview": "Four rice-grain-sized endocrine glands located on posterior surface of thyroid lobes, secreting parathyroid hormone (PTH) to tightly regulate serum calcium levels within narrow limits.",
        "weight": "~0.15g combined",
        "blood_supply": "Inferior thyroid arteries",
        "segments": [
            {
                "id": "chief_cells_pt",
                "name": "Chief Cells & Oxyphil Stroma",
                "color": "#facc15",
                "function": "Chief cells sense extracellular ionized calcium to regulate PTH secretion.",
                "pathology": "Primary Hyperparathyroidism, Hypocalcemic Tetany"
            }
        ],
        "clinical_facts": [
            "Inadvertent surgical removal of all 4 parathyroid glands causes precipitous hypocalcemia leading to fatal laryngeal spasms and tetany."
        ]
    },
    "adrenal": {
        "id": "adrenal",
        "name": "Suprarenal Adrenal Glands",
        "system": "Endocrine System",
        "latin": "Glandulae Suprarenales",
        "icon": "👑",
        "overview": "Pyramidal retroperitoneal glands capping superior pole of each kidney, comprising steroid-producing cortex (aldosterone, cortisol, androgens) and catecholamine-secreting medulla (adrenaline).",
        "weight": "~4-5g each",
        "blood_supply": "Superior, middle, and inferior suprarenal arteries",
        "segments": [
            {
                "id": "adrenal_cortex",
                "name": "Adrenal Cortex (Glomerulosa, Fasciculata, Reticularis)",
                "color": "#eab308",
                "function": "Produces mineralocorticoids, glucocorticoids, and sex steroids.",
                "pathology": "Cushing's Syndrome, Addison's Disease"
            },
            {
                "id": "adrenal_medulla",
                "name": "Adrenal Medulla (Chromaffin Cells)",
                "color": "#ca8a04",
                "function": "Synthesizes epinephrine and norepinephrine for sympathetic fight-or-flight.",
                "pathology": "Pheochromocytoma"
            }
        ],
        "clinical_facts": [
            "The adrenal cortex and medulla have distinct embryological origins: cortex from mesoderm, medulla from neural crest ectoderm."
        ]
    },
    "islets_langerhans": {
        "id": "islets_langerhans",
        "name": "Islets of Langerhans (Endocrine Pancreas)",
        "system": "Endocrine System",
        "latin": "Insulae Pancreaticae",
        "icon": "🔬",
        "overview": "Roughly one million micro-endocrine cell clusters scattered throughout the pancreatic parenchyma containing alpha, beta, and delta cells regulating glucose homeostasis.",
        "weight": "~1-2g total aggregate",
        "blood_supply": "Intrapancreatic arterial micro-plexus",
        "segments": [
            {
                "id": "beta_cells",
                "name": "Beta Cells (Insulin)",
                "color": "#38bdf8",
                "function": "Synthesizes insulin to facilitate cellular glucose uptake and glycogen storage.",
                "pathology": "Type 1 Diabetes Mellitus (Autoimmune Destruction)"
            },
            {
                "id": "alpha_cells",
                "name": "Alpha & Delta Cells (Glucagon, Somatostatin)",
                "color": "#818cf8",
                "function": "Releases glucagon during fasting to stimulate hepatic gluconeogenesis.",
                "pathology": "Hypoglycemia, Glucagonoma"
            }
        ],
        "clinical_facts": [
            "Comprise only 1-2% of total pancreatic mass but consume 10-15% of pancreatic blood flow."
        ]
    },
    "spleen": {
        "id": "spleen",
        "name": "Human Spleen (Lien)",
        "system": "Lymphatic & Immune System",
        "latin": "Lien",
        "icon": "🍷",
        "overview": "Largest secondary lymphoid organ in left hypochondrium filtering blood, destroying senescent erythrocytes (red pulp), hosting immune responses to blood-borne antigens (white pulp), and storing platelets.",
        "weight": "~150-200g",
        "dimensions": "Length ~12 cm, Width ~7 cm",
        "blood_supply": "Splenic artery from celiac trunk; splenic vein to portal vein",
        "segments": [
            {
                "id": "red_pulp",
                "name": "Splenic Red Pulp & Sinusoids",
                "color": "#881337",
                "function": "Cords of Billroth filtering damaged red blood cells and recycling iron.",
                "pathology": "Hypersplenism, Hemolytic Anemia"
            },
            {
                "id": "white_pulp",
                "name": "White Pulp & Malpighian Follicles",
                "color": "#be123c",
                "function": "Lymphoid follicles mounting humoral responses against encapsulated bacteria.",
                "pathology": "Post-Splenectomy Sepsis (OPSI)"
            }
        ],
        "clinical_facts": [
            "Governed by the clinical 1-3-5-7-9-11 rule: measures 1x3x5 inches, weighs 7 ounces, lies beneath ribs 9 to 11."
        ]
    },
    "thymus": {
        "id": "thymus",
        "name": "Thymus Gland (T-Cell Maturation)",
        "system": "Lymphatic & Immune System",
        "latin": "Thymus",
        "icon": "🛡️",
        "overview": "Bilobed primary lymphoid organ in anterior superior mediastinum where bone-marrow-derived T-cell precursors undergo positive and negative selection for self-tolerance.",
        "weight": "~30-40g in puberty (atrophies in adults)",
        "blood_supply": "Internal thoracic and inferior thyroid arteries",
        "segments": [
            {
                "id": "thymic_cortex",
                "name": "Thymic Cortex & Hassall's Corpuscles",
                "color": "#f472b6",
                "function": "Dense site of T-lymphocyte maturation and TCR gene rearrangement.",
                "pathology": "Thymoma, Myasthenia Gravis, DiGeorge Syndrome"
            }
        ],
        "clinical_facts": [
            "Over 95% of developing thymocytes fail selection tests and undergo apoptosis to eliminate self-reactive clones that could cause autoimmunity."
        ]
    },
    "palatine_tonsils": {
        "id": "palatine_tonsils",
        "name": "Palatine Tonsils (Waldeyer's Ring)",
        "system": "Lymphatic & Immune System",
        "latin": "Tonsillae Palatinae",
        "icon": "🍇",
        "overview": "Paired lymphoid tissue masses situated in tonsillar fossa between palatoglossal and palatopharyngeal arches defending pharyngeal portal against inhaled and ingested microbes.",
        "blood_supply": "Tonsillar branch of facial artery",
        "segments": [
            {
                "id": "tonsillar_crypts",
                "name": "Tonsillar Crypts & Germinal Centers",
                "color": "#fb7185",
                "function": "Deep epithelial invaginations trapping antigens for antibody production.",
                "pathology": "Acute Tonsillitis, Peritonsillar Abscess (Quinsy)"
            }
        ],
        "clinical_facts": [
            "Part of Waldeyer's lymphatic ring, which also encompasses adenoids, tubal tonsils, and lingual tonsils."
        ]
    },
    "adenoids": {
        "id": "adenoids",
        "name": "Pharyngeal Tonsil (Adenoids)",
        "system": "Lymphatic & Immune System",
        "latin": "Tonsilla Pharyngealis",
        "icon": "🛡️",
        "overview": "Mass of lymphoid tissue on posterior superior wall of nasopharynx capturing airborne pathogens entering nasal breathing passages.",
        "blood_supply": "Ascending pharyngeal and maxillary artery branches",
        "segments": [
            {
                "id": "adenoid_mass",
                "name": "Nasopharyngeal Lymphoid Follicles",
                "color": "#f43f5e",
                "function": "Mounts secretory IgA immune response against respiratory viruses.",
                "pathology": "Adenoid Hypertrophy, Eustachian Tube Dysfunction"
            }
        ],
        "clinical_facts": [
            "Severe enlargement in children can obstruct nasopharynx, causing obligate mouth breathing and obstructive sleep apnea."
        ]
    },
    "lymph_nodes": {
        "id": "lymph_nodes",
        "name": "Systemic Lymph Nodes (600 Nodes)",
        "system": "Lymphatic & Immune System",
        "latin": "Nodi Lymphoidei",
        "icon": "🫧",
        "overview": "Kidney-shaped encapsulated organs (approx 500-600 total) spaced along lymphatic channels filtering interstitial lymph and presenting foreign antigens to lymphocytes.",
        "dimensions": "Size ~1-20 mm",
        "blood_supply": "Nodal hilar microvasculature",
        "segments": [
            {
                "id": "nodal_cortex",
                "name": "Lymph Node Cortex & Germinal Centers",
                "color": "#a855f7",
                "function": "B-cell clonal expansion; subcapsular sinuses filtering particulate matter.",
                "pathology": "Lymphadenitis, Lymphoma, Metastatic Carcinoma"
            }
        ],
        "clinical_facts": [
            "The sentinel lymph node is the first node that receives lymphatic drainage from a malignant primary tumor."
        ]
    },
    "bone_marrow": {
        "id": "bone_marrow",
        "name": "Bone Marrow (Hematopoietic Organ)",
        "system": "Lymphatic & Immune System",
        "latin": "Medulla Ossium",
        "icon": "🦴",
        "overview": "Soft, spongy tissue residing in medullary cavities of bones producing 200 billion erythrocytes, 100 billion leukocytes, and 100 billion platelets every day from hematopoietic stem cells.",
        "weight": "~2.6 kg (4-5% of total body mass)",
        "blood_supply": "Nutrient arteries of bone entering medullary canal",
        "segments": [
            {
                "id": "red_marrow",
                "name": "Red Hematopoietic Marrow",
                "color": "#dc2626",
                "function": "Active blood cell generation located in pelvis, sternum, cranium, ribs, and vertebrae.",
                "pathology": "Leukemia, Aplastic Anemia, Multiple Myeloma"
            },
            {
                "id": "yellow_marrow",
                "name": "Yellow Marrow (Adipose Storage)",
                "color": "#facc15",
                "function": "Quiescent adipose-rich marrow in long bone shafts capable of reversion.",
                "pathology": "Marrow Embolism"
            }
        ],
        "clinical_facts": [
            "All human blood cells derive from a single pluripotent hematopoietic stem cell (HSC) residing in bone marrow niches."
        ]
    },
    "kidney": {
        "id": "kidney",
        "name": "Human Kidneys (Renal Matrix)",
        "system": "Urinary System",
        "latin": "Renes",
        "icon": "🫘",
        "overview": "Paired bean-shaped retroperitoneal organs filtering 180 liters of blood plasma daily to maintain electrolyte equilibrium, systemic acid-base balance, blood pressure (renin), and erythropoiesis.",
        "weight": "~150g each",
        "dimensions": "Length ~11 cm, Width ~6 cm, Thickness ~3 cm",
        "blood_supply": "Renal Arteries (receiving 20-25% of resting cardiac output)",
        "segments": [
            {
                "id": "renal_parenchyma",
                "name": "Renal Cortex & Capsule",
                "color": "#be123c",
                "function": "Outer region containing 1 million nephrons, glomeruli, and convoluted tubules.",
                "pathology": "Glomerulonephritis, Polycystic Kidney Disease"
            },
            {
                "id": "renal_medulla_pelvis",
                "name": "Medullary Pyramids & Pelvis",
                "color": "#881337",
                "function": "Concentrates urine via loops of Henle and drains into renal pelvis.",
                "pathology": "Nephrolithiasis (Kidney Stones), Pyelonephritis"
            },
            {
                "id": "renal_vessels_ureter",
                "name": "Renal Artery, Vein & Ureter",
                "color": "#dc2626",
                "function": "High-volume blood filtration conduit and urinary excretion pipeline.",
                "pathology": "Renal Artery Stenosis"
            },
            {
                "id": "adrenal_glands",
                "name": "Suprarenal Adrenal Glands",
                "color": "#eab308",
                "function": "Endocrine caps regulating stress response and mineralocorticoids.",
                "pathology": "Adrenal Insufficiency"
            }
        ],
        "clinical_facts": [
            "Filters approximately 180 liters of fluid daily, but reabsorbs 99%—resulting in ~1.5 liters of excreted urine.",
            "The functional filtration unit is the nephron; each healthy adult kidney contains roughly 1 million nephrons."
        ]
    },
    "left_kidney": {
        "id": "left_kidney",
        "name": "Left Kidney (Ren Sinister)",
        "system": "Urinary System",
        "latin": "Ren Sinister",
        "icon": "🫘",
        "overview": "Slightly longer and positioned slightly higher (T12-L3) than right kidney due to absence of massive liver on left flank; bordered by spleen, stomach, and descending colon.",
        "weight": "~150g",
        "blood_supply": "Left Renal Artery directly from aorta",
        "segments": [
            {
                "id": "left_renal_cortex",
                "name": "Left Renal Cortex & Glomeruli",
                "color": "#be123c",
                "function": "Ultrafiltration of blood plasma and solute reabsorption.",
                "pathology": "Renal Cell Carcinoma"
            }
        ],
        "clinical_facts": [
            "The left renal vein is three times longer than the right because it must cross anterior to the aorta beneath the superior mesenteric artery ('nutcracker anatomy')."
        ]
    },
    "right_kidney": {
        "id": "right_kidney",
        "name": "Right Kidney (Ren Dexter)",
        "system": "Urinary System",
        "latin": "Ren Dexter",
        "icon": "🫘",
        "overview": "Positioned ~1-2 cm lower than left kidney to accommodate hepatic visceral impression; bordered superiorly by liver right lobe and anteriorly by duodenum.",
        "weight": "~145g",
        "blood_supply": "Right Renal Artery (longer than left, passing behind IVC)",
        "segments": [
            {
                "id": "right_renal_cortex",
                "name": "Right Renal Cortex & Calyces",
                "color": "#be123c",
                "function": "Metabolic filtration, urea clearance, erythropoietin secretion.",
                "pathology": "Hydronephrosis"
            }
        ],
        "clinical_facts": [
            "Palpable on bimanual physical examination in thin individuals during deep inspiration as it descends with diaphragm."
        ]
    },
    "left_ureter": {
        "id": "left_ureter",
        "name": "Left Ureter",
        "system": "Urinary System",
        "latin": "Ureter Sinister",
        "icon": "〰️",
        "overview": "Thick-walled muscular tube carrying urine from left renal pelvis to posteroinferior base of bladder via rhythmic active smooth muscle peristaltic waves.",
        "dimensions": "Length ~25-30 cm, Diameter ~3-4 mm",
        "blood_supply": "Branches of renal, gonadal, and iliac arteries",
        "segments": [
            {
                "id": "ureter_l_body",
                "name": "Ureteral Muscularis Conduit",
                "color": "#f8fafc",
                "function": "Propels urine peristaltically independent of hydrostatic gravity.",
                "pathology": "Ureteral Calculi (Renal Colic)"
            }
        ],
        "clinical_facts": [
            "Features three physiological constriction sites where kidney stones frequently lodge: ureteropelvic junction, pelvic brim crossing, and ureterovesical junction."
        ]
    },
    "right_ureter": {
        "id": "right_ureter",
        "name": "Right Ureter",
        "system": "Urinary System",
        "latin": "Ureter Dexter",
        "icon": "〰️",
        "overview": "Paired retroperitoneal muscular tube descending from right renal pelvis across psoas major muscle into pelvis, entering urinary bladder at an oblique angle.",
        "dimensions": "Length ~25-30 cm",
        "blood_supply": "Renal, testicular/ovarian, and internal iliac arterial twigs",
        "segments": [
            {
                "id": "ureter_r_body",
                "name": "Right Ureteral Conduit",
                "color": "#f8fafc",
                "function": "Active muscular propulsion of urine into bladder trigone.",
                "pathology": "Ureteral Stricture, Vesicoureteral Reflux"
            }
        ],
        "clinical_facts": [
            "Enters bladder wall obliquely, acting as a functional physiological valve: bladder filling compresses ureteral lumen to prevent retrograde reflux."
        ]
    },
    "bladder": {
        "id": "bladder",
        "name": "Urinary Bladder (Vesica Urinaria)",
        "system": "Urinary System",
        "latin": "Vesica Urinaria",
        "icon": "🎈",
        "overview": "Distensible muscular hollow organ in lesser pelvis serving as temporary reservoir for urine; contracts via detrusor smooth muscle during micturition reflex.",
        "capacity": "400 - 600 mL (Urge at ~200-300 mL)",
        "blood_supply": "Superior and inferior vesical arteries from internal iliac",
        "segments": [
            {
                "id": "detrusor_body",
                "name": "Detrusor Muscle Dome",
                "color": "#f43f5e",
                "function": "Crisscrossing smooth muscle mesh contracting under parasympathetic control.",
                "pathology": "Overactive Bladder, Urinary Retention"
            },
            {
                "id": "trigone_neck",
                "name": "Bladder Trigone & Internal Neck",
                "color": "#fbbf24",
                "function": "Smooth triangular area between ureteral orifices and urethral internal meatus.",
                "pathology": "Cystitis, Bladder Urothelial Carcinoma"
            },
            {
                "id": "ureters_inflow",
                "name": "Bilateral Ureteral Inflow Orifices",
                "color": "#f8fafc",
                "function": "Slit-like valve portals receiving urine from kidneys.",
                "pathology": "Ureterocele"
            }
        ],
        "clinical_facts": [
            "Lined by specialized transitional epithelium (urothelium) with umbrella cells capable of stretching from 6 cell layers thick down to 2-3 layers."
        ]
    },
    "urethra": {
        "id": "urethra",
        "name": "Human Urethra (Urinary Conduit)",
        "system": "Urinary System",
        "latin": "Urethra",
        "icon": "🚿",
        "overview": "Fibromuscular canal conducting urine from bladder neck to external urethral orifice; in males also serves as final common conduit for semen ejaculation.",
        "dimensions": "Female ~4 cm, Male ~20 cm",
        "blood_supply": "Internal pudendal and inferior vesical arteries",
        "segments": [
            {
                "id": "urethral_sphincter",
                "name": "External Urethral Sphincter",
                "color": "#fb7185",
                "function": "Striated skeletal muscle ring under voluntary somatic pudendal control.",
                "pathology": "Stress Incontinence, Urethral Stricture"
            }
        ],
        "clinical_facts": [
            "Short female urethra (~4 cm) explains why females have a significantly higher incidence of ascending urinary tract infections (UTIs)."
        ]
    },
    "testes": {
        "id": "testes",
        "name": "Human Testes (Male Gonads)",
        "system": "Reproductive System",
        "latin": "Testis",
        "icon": "🥚",
        "overview": "Paired ovoid organs suspended in scrotum producing spermatozoa (seminiferous tubules) and synthesizing testosterone (Leydig interstitial cells).",
        "weight": "~15-20g each",
        "dimensions": "Length ~4-5 cm, Width ~3 cm",
        "blood_supply": "Testicular arteries arising directly from abdominal aorta",
        "segments": [
            {
                "id": "seminiferous_tubules",
                "name": "Seminiferous Tubules & Leydig Cells",
                "color": "#38bdf8",
                "function": "Site of spermatogenesis and endocrine testosterone biosynthesis.",
                "pathology": "Testicular Torsion, Testicular Cancer"
            },
            {
                "id": "tunica_albuginea",
                "name": "Tunica Albuginea Capsule",
                "color": "#e2e8f0",
                "function": "Dense fibrous capsule maintaining intratesticular pressure.",
                "pathology": "Hydrocele, Varicocele"
            }
        ],
        "clinical_facts": [
            "Spermatogenesis requires an optimal temperature 2-3°C below core body temperature, maintained by scrotal dartos and cremasteric reflexes."
        ]
    },
    "epididymis": {
        "id": "epididymis",
        "name": "Human Epididymis",
        "system": "Reproductive System",
        "latin": "Epididymis",
        "icon": "➰",
        "overview": "Crescent-shaped coiled structure (~6 meters uncoiled) adhering to posterior testis where immature spermatozoa acquire forward motility and fertilizing capacity over ~12 days.",
        "dimensions": "Uncoiled length ~6 meters",
        "blood_supply": "Testicular and deferential arteries",
        "segments": [
            {
                "id": "epididymal_duct",
                "name": "Caput, Corpus & Cauda Epididymis",
                "color": "#0ea5e9",
                "function": "Sperm storage and maturation before transit into vas deferens.",
                "pathology": "Epididymitis, Epididymal Cysts"
            }
        ],
        "clinical_facts": [
            "Spermatozoa exiting the testis are immobile and infertile; they gain functional motility exclusively inside the epididymal duct."
        ]
    },
    "vas_deferens": {
        "id": "vas_deferens",
        "name": "Vas Deferens (Ductus Deferens)",
        "system": "Reproductive System",
        "latin": "Ductus Deferens",
        "icon": "〰️",
        "overview": "Firm muscular tube (~45 cm) ascending in spermatic cord through inguinal canal into pelvis, propelling mature sperm via rapid peristalsis into ejaculatory duct.",
        "dimensions": "Length ~45 cm",
        "blood_supply": "Artery to the ductus deferens",
        "segments": [
            {
                "id": "vas_ampulla",
                "name": "Ampulla of Ductus Deferens",
                "color": "#0284c7",
                "function": "Terminal dilated storage chamber merging with seminal vesicle duct.",
                "pathology": "Congenital Absence of Vas Deferens (Cystic Fibrosis)"
            }
        ],
        "clinical_facts": [
            "Surgically interrupted or occluded during vasectomy, the most reliable permanent form of male contraception."
        ]
    },
    "seminal_vesicles": {
        "id": "seminal_vesicles",
        "name": "Seminal Vesicles (Paired Glands)",
        "system": "Reproductive System",
        "latin": "Vesiculae Seminales",
        "icon": "🥖",
        "overview": "Paired sacculated pouches situated between bladder fundus and rectum, secreting alkaline, fructose-rich fluid comprising ~70% of total ejaculate volume.",
        "dimensions": "Length ~5 cm",
        "blood_supply": "Inferior vesical and middle rectal arteries",
        "segments": [
            {
                "id": "sv_gland",
                "name": "Sacculated Glandular Pouch",
                "color": "#38bdf8",
                "function": "Secretes fructose, prostaglandins, and clotting enzymes nourishing sperm.",
                "pathology": "Seminal Vesiculitis"
            }
        ],
        "clinical_facts": [
            "Fructose in seminal vesicle secretions serves as the primary metabolic energy substrate powering sperm flagellar propulsion."
        ]
    },
    "prostate": {
        "id": "prostate",
        "name": "Prostate Gland (Zonal Anatomy)",
        "system": "Reproductive System",
        "latin": "Prostata",
        "icon": "🌰",
        "overview": "Walnut-sized fibromuscular and glandular organ encircling bladder neck and proximal urethra in males, secreting milky alkaline fluid containing Prostate-Specific Antigen (PSA).",
        "weight": "~20-25g (Young Adult)",
        "dimensions": "Length ~3 cm, Width ~4 cm",
        "blood_supply": "Inferior vesical and middle rectal arteries",
        "segments": [
            {
                "id": "prostate_transition",
                "name": "Transition Zone (Periurethral)",
                "color": "#f59e0b",
                "function": "Surrounds prostatic urethra; primary site of nodular hyperplasia.",
                "pathology": "Benign Prostatic Hyperplasia (BPH)"
            },
            {
                "id": "prostate_peripheral",
                "name": "Peripheral Zone (Posterior Capsule)",
                "color": "#d97706",
                "function": "Comprises 70% of gland volume; primary site of carcinoma.",
                "pathology": "Prostate Adenocarcinoma, Prostatitis"
            }
        ],
        "clinical_facts": [
            "PSA is a serine protease whose physiological function is to liquefy the seminal coagulum to allow sperm motility."
        ]
    },
    "penis": {
        "id": "penis",
        "name": "Penis (Erectile Organs)",
        "system": "Reproductive System",
        "latin": "Penis",
        "icon": "🍌",
        "overview": "Male external organ of copulation and micturition composed of three cylindrical cavernous vascular erectile bodies: paired corpora cavernosa and the ventral corpus spongiosum.",
        "blood_supply": "Internal pudendal artery (Deep and dorsal arteries of penis)",
        "segments": [
            {
                "id": "corpora_cavernosa",
                "name": "Paired Corpora Cavernosa",
                "color": "#dc2626",
                "function": "Vascular sinusoidal sponges engorging with blood to achieve rigidity.",
                "pathology": "Erectile Dysfunction, Priapism, Peyronie's Disease"
            },
            {
                "id": "corpus_spongiosum",
                "name": "Corpus Spongiosum & Glans",
                "color": "#ef4444",
                "function": "Encloses penile urethra, preventing urethral collapse during erection.",
                "pathology": "Hypospadias, Phimosis"
            }
        ],
        "clinical_facts": [
            "Penile erection is mediated by parasympathetic nitric oxide release causing cyclic GMP accumulation and cavernosal arterial dilation."
        ]
    },
    "ovaries": {
        "id": "ovaries",
        "name": "Human Ovaries (Female Gonads)",
        "system": "Reproductive System",
        "latin": "Ovarium",
        "icon": "🥚",
        "overview": "Paired almond-shaped pelvic organs producing secondary oocytes (egg cells) and synthesizing essential female sex steroid hormones (estrogens and progesterone).",
        "weight": "~5-8g each",
        "dimensions": "Length ~3-4 cm, Width ~2 cm",
        "blood_supply": "Ovarian arteries arising directly from abdominal aorta",
        "segments": [
            {
                "id": "ovarian_cortex",
                "name": "Ovarian Cortex & Follicles",
                "color": "#ec4899",
                "function": "Site of cyclical follicular development, ovulation, and corpus luteum formation.",
                "pathology": "Polycystic Ovary Syndrome (PCOS), Ovarian Cancer"
            },
            {
                "id": "ovarian_stroma",
                "name": "Vascular Medulla & Stroma",
                "color": "#f472b6",
                "function": "Supports steroidogenesis and hormone transport into systemic circulation.",
                "pathology": "Ovarian Torsion"
            }
        ],
        "clinical_facts": [
            "A female infant is born with roughly 1-2 million primordial follicles; by puberty only ~300,000 remain, and only ~400 are ever ovulated."
        ]
    },
    "fallopian_tubes": {
        "id": "fallopian_tubes",
        "name": "Fallopian Tubes (Uterine Salpinx)",
        "system": "Reproductive System",
        "latin": "Tuba Uterina",
        "icon": "🎺",
        "overview": "Paired muscular conduits (~10 cm) extending from uterine cornu to ovaries featuring motile fimbriae that capture ovulated oocytes; primary site of human fertilization.",
        "dimensions": "Length ~10-12 cm",
        "blood_supply": "Ovarian and uterine arteries (anastomotic arcade)",
        "segments": [
            {
                "id": "fimbriae_infundibulum",
                "name": "Fimbriae & Ampulla",
                "color": "#f43f5e",
                "function": "Feathery fimbriae sweep egg into ampulla where fertilization normally occurs.",
                "pathology": "Ectopic Pregnancy, Salpingitis"
            },
            {
                "id": "isthmus_tubal",
                "name": "Isthmus & Intramural Segment",
                "color": "#fb7185",
                "function": "Propels zygote toward uterine cavity via ciliary beating.",
                "pathology": "Hydrosalpinx, Tubal Infertility"
            }
        ],
        "clinical_facts": [
            "Over 95% of ectopic pregnancies occur within the fallopian tubes, most frequently in the ampullary segment."
        ]
    },
    "uterus": {
        "id": "uterus",
        "name": "Human Uterus (Womb)",
        "system": "Reproductive System",
        "latin": "Uterus",
        "icon": "🫄",
        "overview": "Hollow, thick-walled muscular organ in female pelvis nestled between bladder and rectum, designed for embryo implantation, fetal nourishment, and muscular parturition.",
        "weight": "~60g (Nulliparous) to ~1,100g (Full Term)",
        "dimensions": "Length ~7.5 cm, Width ~5 cm",
        "blood_supply": "Uterine arteries from internal iliac",
        "segments": [
            {
                "id": "endometrium",
                "name": "Endometrium (Mucosal Lining)",
                "color": "#e11d48",
                "function": "Cyclical hormone-responsive lining shedding during menses or receiving blastocyst.",
                "pathology": "Endometriosis, Endometrial Carcinoma"
            },
            {
                "id": "myometrium",
                "name": "Myometrium (Smooth Muscle Layers)",
                "color": "#be123c",
                "function": "Massive interlacing smooth muscle generating powerful contractions during labor.",
                "pathology": "Uterine Fibroids (Leiomyomas), Adenomyosis"
            },
            {
                "id": "uterine_fundus",
                "name": "Fundus & Body of Uterus",
                "color": "#9f1239",
                "function": "Superior convex muscular dome accommodating growing gestating fetus.",
                "pathology": "Uterine Atony"
            }
        ],
        "clinical_facts": [
            "The myometrium can expand its internal volume by over 500-fold during pregnancy, driven by smooth muscle hypertrophy and hyperplasia."
        ]
    },
    "cervix": {
        "id": "cervix",
        "name": "Cervix Uteri (Uterine Neck)",
        "system": "Reproductive System",
        "latin": "Cervix Uteri",
        "icon": "🔘",
        "overview": "Fibromuscular cylindrical lower part of uterus opening into upper vagina via external os, secreting mucus that varies in viscosity across menstrual cycle.",
        "dimensions": "Length ~2.5-3 cm",
        "blood_supply": "Descending branches of uterine artery",
        "segments": [
            {
                "id": "transformation_zone",
                "name": "Transformation Zone (Squamocolumnar Junction)",
                "color": "#fb7185",
                "function": "Dynamic junction between endocervical columnar and ectocervical squamous cells.",
                "pathology": "Cervical Dysplasia, HPV, Cervical Cancer"
            }
        ],
        "clinical_facts": [
            "The transformation zone is the target site screened during Pap smears, where high-risk HPV oncogenes (E6/E7) drive neoplastic transformation."
        ]
    },
    "vagina": {
        "id": "vagina",
        "name": "Human Vagina (Birth Canal)",
        "system": "Reproductive System",
        "latin": "Vagina",
        "icon": "🌸",
        "overview": "Elastic, distensible muscular canal lined with non-keratinized stratified squamous epithelium extending from cervix to vestibule, serving as copulatory canal and birth passage.",
        "dimensions": "Length ~8-10 cm",
        "blood_supply": "Vaginal artery from internal iliac",
        "segments": [
            {
                "id": "vaginal_rugae",
                "name": "Vaginal Rugae & Muscularis",
                "color": "#f43f5e",
                "function": "Transverse mucosal folds allowing dramatic expansion during childbirth.",
                "pathology": "Vaginitis, Bacterial Vaginosis, Pelvic Organ Prolapse"
            }
        ],
        "clinical_facts": [
            "Lactobacillus crispatus ferments glycogen from shed epithelial cells into lactic acid, maintaining an acidic protective pH of 3.8-4.5."
        ]
    },
    "placenta": {
        "id": "placenta",
        "name": "Human Placenta (Gravid Organ)",
        "system": "Reproductive System",
        "latin": "Placenta",
        "icon": "🥞",
        "overview": "Temporary fetomaternal organ developing during pregnancy from chorionic villi, providing respiratory gas exchange, nutrient delivery, waste elimination, and endocrine support (hCG, progesterone).",
        "weight": "~500g at birth",
        "dimensions": "Diameter ~20 cm, Thickness ~2-3 cm",
        "blood_supply": "Maternal spiral arteries and fetal umbilical arteries",
        "segments": [
            {
                "id": "chorionic_villi",
                "name": "Chorionic Villi & Intervillous Space",
                "color": "#dc2626",
                "function": "Microscopic tree-like projections facilitating diffusion without mixing maternal/fetal blood.",
                "pathology": "Placenta Previa, Placental Abruption, Preeclampsia"
            }
        ],
        "clinical_facts": [
            "The only mammalian organ that is transient, formed de novo in adulthood, and discarded after performing its physiological function."
        ]
    },
    "skin": {
        "id": "skin",
        "name": "Human Skin (Integumentary Organ)",
        "system": "Integumentary System",
        "latin": "Cutis",
        "icon": "🧴",
        "overview": "The largest human organ by weight and surface area (~3.6 kg, 2 m²), functioning as an impermeable physical barrier, thermal regulator, sensory surface, and Vitamin D synthesizer.",
        "weight": "~3.6 kg (Adult Average)",
        "dimensions": "Surface area ~1.8-2.0 m²",
        "blood_supply": "Subcutaneous and subpapillary vascular plexuses",
        "segments": [
            {
                "id": "epidermis_layer",
                "name": "Epidermis (Stratum Corneum to Basale)",
                "color": "#fbcfe8",
                "function": "Avascular keratinocyte shield preventing pathogen ingress and desiccation.",
                "pathology": "Melanoma, Psoriasis, Basal Cell Carcinoma"
            },
            {
                "id": "dermis_layer",
                "name": "Dermis (Collagen & Elastin Matrix)",
                "color": "#f472b6",
                "function": "Dense fibroelastic connective tissue housing hair follicles, sweat glands, and nerves.",
                "pathology": "Burns, Scleroderma"
            }
        ],
        "clinical_facts": [
            "Sheds approximately 30,000 to 40,000 dead skin cells every single minute—totaling roughly 4 kg of skin shed per year."
        ]
    },
    "subcutaneous_tissue": {
        "id": "subcutaneous_tissue",
        "name": "Subcutaneous Adipose Tissue (Hypodermis)",
        "system": "Integumentary System",
        "latin": "Tela Subcutanea",
        "icon": "🧈",
        "overview": "Deep subcutaneous adipose and connective tissue layer anchoring skin to underlying deep fascia and muscles, serving as thermal insulator, energy buffer, and mechanical shock absorber.",
        "blood_supply": "Perforating cutaneous arteries",
        "segments": [
            {
                "id": "adipose_panniculus",
                "name": "Adipose Lobules & Fibrous Septa",
                "color": "#fde047",
                "function": "Stores lipid triglycerides and synthesizes adipokines (leptin, adiponectin).",
                "pathology": "Cellulitis, Lipoma, Panniculitis"
            }
        ],
        "clinical_facts": [
            "Plays a critical endocrine role, secreting leptin to regulate appetite and aromatase to convert androgens into estrogens."
        ]
    },
    "mammary_glands": {
        "id": "mammary_glands",
        "name": "Mammary Glands (Breasts)",
        "system": "Integumentary System",
        "latin": "Glandulae Mammariae",
        "icon": "🍈",
        "overview": "Modified apocrine sweat glands in superficial pectoral fascia composed of 15-20 glandular lobes embedded in adipose tissue, specialized for lactation upon prolactin and oxytocin stimulation.",
        "weight": "~200-500g each",
        "blood_supply": "Internal thoracic, lateral thoracic, and intercostal arteries",
        "segments": [
            {
                "id": "lactiferous_ducts",
                "name": "Lactiferous Lobules & Ducts",
                "color": "#fb7185",
                "function": "Alveolar clusters synthesizing breast milk, converging on nipple ampullae.",
                "pathology": "Invasive Ductal Carcinoma, Fibroadenoma, Mastitis"
            }
        ],
        "clinical_facts": [
            "Cooper's suspensory ligaments run from deep pectoral fascia to dermis, maintaining structural breast projection."
        ]
    },
    "skeleton": {
        "id": "skeleton",
        "name": "Full Human Skeleton (206 Bones)",
        "system": "Musculoskeletal System",
        "latin": "Skeleton Humanum",
        "icon": "🦴",
        "overview": "Complete articulated adult osteological chassis composed of 206 distinct bones providing rigid structural leverage, shielding brain and viscera, storing 99% of bodily calcium, and housing bone marrow.",
        "weight": "~10-12 kg (15% of body weight)",
        "blood_supply": "Nutrient, metaphyseal, and periosteal vascular network",
        "segments": [
            {
                "id": "cranial_skull",
                "name": "Cranial Skull & Neurocranium",
                "color": "#e2e8f0",
                "function": "Encloses brain and sensory apparatus with interdigitated sutures.",
                "pathology": "Skull Fractures, Craniosynostosis"
            },
            {
                "id": "vertebral_column",
                "name": "Articulated Vertebral Column",
                "color": "#cbd5e1",
                "function": "33 vertebrae shielding spinal cord while allowing flexible axial posture.",
                "pathology": "Herniated Disc, Scoliosis, Spondylolisthesis"
            },
            {
                "id": "ribcage_cage",
                "name": "Thoracic Ribcage (12 Costal Pairs)",
                "color": "#cbd5e1",
                "function": "Bellows mechanism protecting heart and lungs during respiration.",
                "pathology": "Rib Fractures, Flail Chest"
            },
            {
                "id": "pelvic_girdle",
                "name": "Pelvic Girdle Basin",
                "color": "#94a3b8",
                "function": "Massive bony ring transmitting weight to lower limbs.",
                "pathology": "Pelvic Ring Fractures"
            }
        ],
        "clinical_facts": [
            "The human skeleton constantly remodels itself: osteoclasts resorb old bone and osteoblasts lay down new osteoid, replacing the entire adult skeleton every ~10 years.",
            "The femur is the longest, heaviest, and strongest bone in the human body."
        ]
    },
    "cranial_skull": {
        "id": "cranial_skull",
        "name": "Cranial Skull & Neurocranium",
        "system": "Musculoskeletal System",
        "latin": "Cranium",
        "icon": "💀",
        "overview": "Rigid osteological vault consisting of 8 cranial bones (frontal, 2 parietal, 2 temporal, occipital, sphenoid, ethmoid) and 14 facial splanchnocranial bones protecting the brain and organs of special sense.",
        "weight": "~1 kg",
        "blood_supply": "Meningeal and diploic arteries",
        "segments": [
            {
                "id": "calvaria_vault",
                "name": "Calvaria & Cranial Sutures",
                "color": "#e2e8f0",
                "function": "Rigid protective dome joined by coronal, sagittal, and lambdoid sutures.",
                "pathology": "Epidural Hematoma (Middle Meningeal Artery)"
            }
        ],
        "clinical_facts": [
            "The pterion on the lateral skull is the thinnest cranial zone; an impact here can tear the underlying middle meningeal artery, causing an acute epidural hematoma."
        ]
    },
    "vertebral_column": {
        "id": "vertebral_column",
        "name": "Vertebral Column & Spine (33 Vertebrae)",
        "system": "Musculoskeletal System",
        "latin": "Columna Vertebralis",
        "icon": "🦴",
        "overview": "Curved flexible osteocartilaginous column consisting of 7 cervical, 12 thoracic, 5 lumbar, 5 fused sacral, and 4 fused coccygeal vertebrae cushioning axial loads and housing the spinal cord.",
        "dimensions": "Length ~70 cm (Adult Male)",
        "blood_supply": "Spinal branches of vertebral, intercostal, and lumbar arteries",
        "segments": [
            {
                "id": "vertebrae_bodies",
                "name": "Vertebral Bodies & Neural Arches",
                "color": "#e2e8f0",
                "function": "Weight-bearing anterior cylinders with posterior pedicles and laminae.",
                "pathology": "Compression Fractures, Spinal Stenosis"
            },
            {
                "id": "intervertebral_discs",
                "name": "Intervertebral Discs (Annulus & Nucleus)",
                "color": "#cbd5e1",
                "function": "Fibrocartilage shock absorbers with jelly-like nucleus pulposus.",
                "pathology": "Herniated Nucleus Pulposus (Sciatica)"
            }
        ],
        "clinical_facts": [
            "Humans are approximately 1-2 cm taller in the morning than in the evening due to rehydration of intervertebral discs during sleep."
        ]
    },
    "thoracic_ribcage": {
        "id": "thoracic_ribcage",
        "name": "Thoracic Cage (Ribs & Sternum)",
        "system": "Musculoskeletal System",
        "latin": "Cavea Thoracis",
        "icon": "🦴",
        "overview": "Bony and cartilaginous cage formed by 12 pairs of ribs, costal cartilages, thoracic vertebrae, and sternum (manubrium, body, xiphoid), expanding and contracting during ventilation.",
        "blood_supply": "Internal thoracic and intercostal arteries",
        "segments": [
            {
                "id": "costal_ribs",
                "name": "True, False & Floating Ribs",
                "color": "#cbd5e1",
                "function": "Articulates with thoracic vertebrae and sternum creating respiratory bellows.",
                "pathology": "Costochondritis, Rib Fractures"
            },
            {
                "id": "sternum_bone",
                "name": "Sternum (Breastbone)",
                "color": "#94a3b8",
                "function": "Flat anterior anchor for costal cartilages and clavicles.",
                "pathology": "Sternal Fractures"
            }
        ],
        "clinical_facts": [
            "Ribs 1-7 are true ribs (vertebrosternal), 8-10 are false ribs (vertebrochondral), and 11-12 are floating ribs (vertebral)."
        ]
    },
    "pelvis_skeleton": {
        "id": "pelvis_skeleton",
        "name": "Pelvic Girdle & Appendicular Bones",
        "system": "Musculoskeletal System",
        "latin": "Pelvis",
        "icon": "🦴",
        "overview": "Sturdy basin-shaped ring of bones connecting spine to lower limbs, formed by the paired hip bones (ilium, ischium, pubis) and the posterior sacrum and coccyx.",
        "blood_supply": "Internal and external iliac arterial branches",
        "segments": [
            {
                "id": "ilium_ischium_pubis",
                "name": "Innominate Bones (Ilium, Ischium, Pubis)",
                "color": "#cbd5e1",
                "function": "Deep acetabular socket for femoral head; transmits body weight to legs.",
                "pathology": "Pelvic Fractures, Sacroiliitis"
            }
        ],
        "clinical_facts": [
            "The female pelvis has a wider subpubic angle (>90° vs <70° in males), a rounder pelvic inlet, and flared iliac wings adapted for childbirth."
        ]
    },
    "full_body": {
        "id": "full_body",
        "name": "Full Human Body",
        "system": "Integrated Multi-System Anatomy",
        "latin": "Corpus Humanum Integratum",
        "icon": "🧍",
        "overview": "Complete anatomical human matrix displaying all 78 vital organs and 6 anatomical systems (Skin, Muscles, Veins/Arteries, Bones, Nerves, and Visceral Organs). You can peel off each layer one by one with original looks and textures, or click any organ to zoom into its high-resolution 3D specimen.",
        "height": "175 cm (Adult Average)",
        "organ_count": "78 Distinct Organs",
        "skeletal_bones": "206 Adult Bones",
        "blood_supply": "Comprehensive Systemic & Pulmonary Vasculature (60,000 miles)",
        "segments": [
            {
                "id": "body_skin",
                "name": "Integumentary Skin Layer",
                "color": "#e0a98b",
                "targetOrgan": "skin"
            },
            {
                "id": "body_muscles",
                "name": "Muscular System Layer",
                "color": "#dc2626",
                "targetOrgan": "skeleton"
            },
            {
                "id": "body_skeleton",
                "name": "206-Bone Skeletal Framework",
                "color": "#cbd5e1",
                "targetOrgan": "skeleton"
            },
            {
                "id": "body_vessels",
                "name": "Circulatory Veins & Arteries",
                "color": "#3b82f6",
                "targetOrgan": "aorta"
            },
            {
                "id": "body_nerves",
                "name": "Central & Peripheral Nerves",
                "color": "#facc15",
                "targetOrgan": "spinal_cord"
            },
            {
                "id": "body_brain",
                "name": "Cranial Encephalon (Brain)",
                "color": "#38bdf8",
                "targetOrgan": "brain"
            },
            {
                "id": "body_heart",
                "name": "Thoracic Heart & Aorta",
                "color": "#ef4444",
                "targetOrgan": "heart"
            },
            {
                "id": "body_lungs",
                "name": "Pulmonary Matrix (Lungs)",
                "color": "#ec4899",
                "targetOrgan": "right_lung"
            },
            {
                "id": "body_liver",
                "name": "Hepatic Viscus (Liver)",
                "color": "#9a3412",
                "targetOrgan": "liver"
            },
            {
                "id": "body_stomach",
                "name": "Gastric Chamber (Stomach)",
                "color": "#f59e0b",
                "targetOrgan": "stomach"
            },
            {
                "id": "body_kidneys",
                "name": "Renal Kidneys",
                "color": "#be123c",
                "targetOrgan": "kidney"
            },
            {
                "id": "body_intestines",
                "name": "Enteric Intestines",
                "color": "#10b981",
                "targetOrgan": "jejunum"
            }
        ],
        "clinical_facts": [
            "Contains 78 distinct anatomical organs operating in homeostatic synchrony.",
            "You can peel off the Skin, Muscles, Vessels, and Bones one by one using the Dissection Layer Controls.",
            "Click any organ directly in 3D to trigger a cinematic zoom into its high-resolution clinical model."
        ]
    },
    "intestines": {
        "id": "jejunum",
        "name": "Jejunum (Mid Small Intestine)",
        "system": "Digestive System",
        "latin": "Jejunum",
        "icon": "🌀",
        "overview": "Middle portion of small intestine (~2.5 m) characterized by deep mucosal plicae circulares and tall villi maximizing nutrient, carbohydrate, protein, and electrolyte absorption.",
        "dimensions": "Length ~2.5 meters",
        "blood_supply": "Jejunal branches of Superior Mesenteric Artery",
        "segments": [
            {
                "id": "plicae_circulares",
                "name": "Circular Mucosal Folds (Valves of Kerckring)",
                "color": "#fb923c",
                "function": "Triples mucosal absorptive surface area for nutrient uptake.",
                "pathology": "Celiac Disease (Villous Blunting)"
            }
        ],
        "clinical_facts": [
            "Ancient Greeks named it 'empty' ('nestis') because it was always found devoid of food upon post-mortem examinations."
        ]
    },
    "pancreas_spleen": {
        "id": "pancreas",
        "name": "Pancreas (Exocrine & Endocrine)",
        "system": "Digestive System",
        "latin": "Pancreas",
        "icon": "🥖",
        "overview": "Elongated retroperitoneal gland nestled in C-loop of duodenum; dual exocrine (digestive enzymes: lipase, amylase, proteases) and endocrine (insulin, glucagon, somatostatin) organ.",
        "weight": "~80-100g",
        "dimensions": "Length ~15 cm",
        "blood_supply": "Splenic artery, superior and inferior pancreaticoduodenal arteries",
        "segments": [
            {
                "id": "pancreas_head_body",
                "name": "Head, Body & Tail of Pancreas",
                "color": "#facc15",
                "function": "Acinar cells secrete 1.5 L alkaline bicarbonate juice and proenzymes daily.",
                "pathology": "Acute Pancreatitis, Pancreatic Adenocarcinoma"
            },
            {
                "id": "wirsung_duct",
                "name": "Main Pancreatic Duct (Duct of Wirsung)",
                "color": "#fef08a",
                "function": "Conveys digestive enzymes to join bile duct at ampulla of Vater.",
                "pathology": "Chronic Pancreatitis, Duct Obstruction"
            }
        ],
        "clinical_facts": [
            "Pancreatic enzymes are synthesized as inactive zymogens (trypsinogen) to prevent fatal autodigestion of the gland itself."
        ]
    },
    "lungs": {
        "id": "right_lung",
        "name": "Right Lung (3 Lobes)",
        "system": "Respiratory System",
        "latin": "Pulmo Dexter",
        "icon": "🫁",
        "overview": "Large spongy respiratory organ divided by horizontal and oblique fissures into superior, middle, and inferior lobes, providing ~300 million alveoli for atmospheric gas diffusion.",
        "weight": "~600g (Adult)",
        "capacity": "Total Lung Capacity ~3.2 L",
        "blood_supply": "Pulmonary arteries (deoxygenated gas exchange) and bronchial arteries (parenchymal oxygenation)",
        "segments": [
            {
                "id": "superior_lobe_r",
                "name": "Superior (Upper) Lobe",
                "color": "#ec4899",
                "function": "Apical, anterior, and posterior gas exchange segments.",
                "pathology": "Tuberculosis (Apical Cavitations)"
            },
            {
                "id": "middle_lobe_r",
                "name": "Middle Lobe & Horizontal Fissure",
                "color": "#f472b6",
                "function": "Medial and lateral segments adjacent to right cardiac border.",
                "pathology": "Right Middle Lobe Syndrome"
            },
            {
                "id": "inferior_lobe_r",
                "name": "Inferior (Lower) Lobe",
                "color": "#db2777",
                "function": "Basal diaphragmatic gas exchange matrix.",
                "pathology": "Aspiration Pneumonia"
            }
        ],
        "clinical_facts": [
            "Total alveolar surface area across both human lungs equals 70 to 100 square meters—roughly half a tennis court."
        ]
    }
}

ORGAN_SYSTEMS = {
    "Cardiovascular System": [
        {
            "id": "heart",
            "name": "Human Heart",
            "icon": "🫀",
            "latin": "Cor Humanum"
        },
        {
            "id": "aorta",
            "name": "Systemic Aorta & Arterial Trunk",
            "icon": "🩸",
            "latin": "Aorta Thoracica & Abdominalis"
        },
        {
            "id": "pulmonary_arteries",
            "name": "Pulmonary Trunk & Arteries",
            "icon": "🫀",
            "latin": "Truncus Pulmonalis"
        },
        {
            "id": "vena_cava",
            "name": "Superior & Inferior Vena Cava",
            "icon": "🌊",
            "latin": "Vena Cava Superior & Inferior"
        },
        {
            "id": "carotid_arteries",
            "name": "Common Carotid Arteries",
            "icon": "🩸",
            "latin": "Arteria Carotis Communis"
        },
        {
            "id": "jugular_veins",
            "name": "Internal & External Jugular Veins",
            "icon": "💧",
            "latin": "Vena Jugularis Interna"
        }
    ],
    "Respiratory System": [
        {
            "id": "nasal_cavity",
            "name": "Nasal Cavity & Paranasal Sinuses",
            "icon": "👃",
            "latin": "Cavitas Nasi & Sinus Paranasales"
        },
        {
            "id": "pharynx",
            "name": "Human Pharynx (Throat)",
            "icon": "🗣️",
            "latin": "Pharynx"
        },
        {
            "id": "larynx",
            "name": "Larynx (Voice Box & Epiglottis)",
            "icon": "🎙️",
            "latin": "Larynx"
        },
        {
            "id": "trachea",
            "name": "Cartilaginous Trachea (Windpipe)",
            "icon": "🫁",
            "latin": "Trachea"
        },
        {
            "id": "bronchi",
            "name": "Bronchial Tree & Carina",
            "icon": "🌿",
            "latin": "Arbor Bronchialis"
        },
        {
            "id": "right_lung",
            "name": "Right Lung (3 Lobes)",
            "icon": "🫁",
            "latin": "Pulmo Dexter"
        },
        {
            "id": "left_lung",
            "name": "Left Lung & Cardiac Notch",
            "icon": "🫁",
            "latin": "Pulmo Sinister"
        },
        {
            "id": "diaphragm",
            "name": "Thoracoabdominal Diaphragm",
            "icon": "🎪",
            "latin": "Diaphragma"
        }
    ],
    "Nervous System": [
        {
            "id": "brain",
            "name": "Human Brain & Encephalon",
            "icon": "🧠",
            "latin": "Encephalon"
        },
        {
            "id": "cerebrum",
            "name": "Cerebrum (Cerebral Cortex)",
            "icon": "🧠",
            "latin": "Cerebrum"
        },
        {
            "id": "cerebellum",
            "name": "Cerebellum (Folia & Nuclei)",
            "icon": "🧠",
            "latin": "Cerebellum"
        },
        {
            "id": "brainstem",
            "name": "Brainstem (Midbrain, Pons & Medulla)",
            "icon": "🕹️",
            "latin": "Truncus Encephali"
        },
        {
            "id": "spinal_cord",
            "name": "Spinal Cord & Cauda Equina",
            "icon": "⚡",
            "latin": "Medulla Spinalis"
        }
    ],
    "Sensory Organs": [
        {
            "id": "eye",
            "name": "Human Eye (Ocular Globe)",
            "icon": "👁️",
            "latin": "Oculus"
        },
        {
            "id": "inner_ear",
            "name": "Inner Ear (Vestibulocochlear Organ)",
            "icon": "👂",
            "latin": "Auris Interna"
        },
        {
            "id": "olfactory_bulb",
            "name": "Olfactory Bulb & Epithelium",
            "icon": "👃",
            "latin": "Bulbus Olfactorius"
        },
        {
            "id": "tongue",
            "name": "Tongue & Gustatory Papillae",
            "icon": "👅",
            "latin": "Lingua"
        }
    ],
    "Digestive System": [
        {
            "id": "teeth",
            "name": "Teeth & Dentition (32 Adult Teeth)",
            "icon": "🦷",
            "latin": "Dentes"
        },
        {
            "id": "salivary_glands",
            "name": "Salivary Glands (Parotid, Submandibular)",
            "icon": "💧",
            "latin": "Glandulae Salivariae"
        },
        {
            "id": "esophagus",
            "name": "Esophagus (Muscular Food Pipe)",
            "icon": "🥖",
            "latin": "Esophagus"
        },
        {
            "id": "stomach",
            "name": "Stomach (Gastric Chamber)",
            "icon": "🥐",
            "latin": "Gaster"
        },
        {
            "id": "duodenum",
            "name": "Duodenal C-Loop (Upper Intestine)",
            "icon": "🥨",
            "latin": "Duodenum"
        },
        {
            "id": "jejunum",
            "name": "Jejunum (Mid Small Intestine)",
            "icon": "🌀",
            "latin": "Jejunum"
        },
        {
            "id": "ileum",
            "name": "Ileum & Peyer's Patches",
            "icon": "🌀",
            "latin": "Ileum"
        },
        {
            "id": "cecum",
            "name": "Cecum (Large Bowel Pouch)",
            "icon": "🫘",
            "latin": "Caecum"
        },
        {
            "id": "appendix",
            "name": "Vermiform Appendix",
            "icon": "🐛",
            "latin": "Appendix Vermiformis"
        },
        {
            "id": "ascending_colon",
            "name": "Ascending Colon & Hepatic Flexure",
            "icon": "🌀",
            "latin": "Colon Ascendens"
        },
        {
            "id": "transverse_colon",
            "name": "Transverse Colon & Splenic Flexure",
            "icon": "🌀",
            "latin": "Colon Transversum"
        },
        {
            "id": "descending_colon",
            "name": "Descending Colon",
            "icon": "🌀",
            "latin": "Colon Descendens"
        },
        {
            "id": "sigmoid_colon",
            "name": "Sigmoid Colon (Pelvic Loop)",
            "icon": "🌀",
            "latin": "Colon Sigmoideum"
        },
        {
            "id": "rectum",
            "name": "Human Rectum (Rectal Ampulla)",
            "icon": "📦",
            "latin": "Rectum"
        },
        {
            "id": "anal_canal",
            "name": "Anal Canal & Sphincters",
            "icon": "🔘",
            "latin": "Canalis Analis"
        },
        {
            "id": "liver",
            "name": "Liver (Hepatic Viscus)",
            "icon": "🫓",
            "latin": "Hepar"
        },
        {
            "id": "gallbladder",
            "name": "Gallbladder & Biliary Tree",
            "icon": "🍐",
            "latin": "Vesica Biliaris"
        },
        {
            "id": "pancreas",
            "name": "Pancreas (Exocrine & Endocrine)",
            "icon": "🥖",
            "latin": "Pancreas"
        }
    ],
    "Endocrine System": [
        {
            "id": "pituitary",
            "name": "Pituitary Gland (Master Hypophysis)",
            "icon": "🔮",
            "latin": "Hypophysis Cerebri"
        },
        {
            "id": "pineal",
            "name": "Pineal Gland (Epiphysis Cerebri)",
            "icon": "🌲",
            "latin": "Glandula Pinealis"
        },
        {
            "id": "thyroid",
            "name": "Thyroid Gland (Follicular Lobes)",
            "icon": "🦋",
            "latin": "Glandula Thyroidea"
        },
        {
            "id": "parathyroid",
            "name": "Parathyroid Glands (4 Glands)",
            "icon": "🟡",
            "latin": "Glandulae Parathyroideae"
        },
        {
            "id": "adrenal",
            "name": "Suprarenal Adrenal Glands",
            "icon": "👑",
            "latin": "Glandulae Suprarenales"
        },
        {
            "id": "islets_langerhans",
            "name": "Islets of Langerhans (Endocrine Pancreas)",
            "icon": "🔬",
            "latin": "Insulae Pancreaticae"
        }
    ],
    "Lymphatic & Immune System": [
        {
            "id": "spleen",
            "name": "Human Spleen (Lien)",
            "icon": "🍷",
            "latin": "Lien"
        },
        {
            "id": "thymus",
            "name": "Thymus Gland (T-Cell Maturation)",
            "icon": "🛡️",
            "latin": "Thymus"
        },
        {
            "id": "palatine_tonsils",
            "name": "Palatine Tonsils (Waldeyer's Ring)",
            "icon": "🍇",
            "latin": "Tonsillae Palatinae"
        },
        {
            "id": "adenoids",
            "name": "Pharyngeal Tonsil (Adenoids)",
            "icon": "🛡️",
            "latin": "Tonsilla Pharyngealis"
        },
        {
            "id": "lymph_nodes",
            "name": "Systemic Lymph Nodes (600 Nodes)",
            "icon": "🫧",
            "latin": "Nodi Lymphoidei"
        },
        {
            "id": "bone_marrow",
            "name": "Bone Marrow (Hematopoietic Organ)",
            "icon": "🦴",
            "latin": "Medulla Ossium"
        }
    ],
    "Urinary System": [
        {
            "id": "kidney",
            "name": "Human Kidneys (Renal Matrix)",
            "icon": "🫘",
            "latin": "Renes"
        },
        {
            "id": "left_kidney",
            "name": "Left Kidney (Ren Sinister)",
            "icon": "🫘",
            "latin": "Ren Sinister"
        },
        {
            "id": "right_kidney",
            "name": "Right Kidney (Ren Dexter)",
            "icon": "🫘",
            "latin": "Ren Dexter"
        },
        {
            "id": "left_ureter",
            "name": "Left Ureter",
            "icon": "〰️",
            "latin": "Ureter Sinister"
        },
        {
            "id": "right_ureter",
            "name": "Right Ureter",
            "icon": "〰️",
            "latin": "Ureter Dexter"
        },
        {
            "id": "bladder",
            "name": "Urinary Bladder (Vesica Urinaria)",
            "icon": "🎈",
            "latin": "Vesica Urinaria"
        },
        {
            "id": "urethra",
            "name": "Human Urethra (Urinary Conduit)",
            "icon": "🚿",
            "latin": "Urethra"
        }
    ],
    "Reproductive System": [
        {
            "id": "testes",
            "name": "Human Testes (Male Gonads)",
            "icon": "🥚",
            "latin": "Testis"
        },
        {
            "id": "epididymis",
            "name": "Human Epididymis",
            "icon": "➰",
            "latin": "Epididymis"
        },
        {
            "id": "vas_deferens",
            "name": "Vas Deferens (Ductus Deferens)",
            "icon": "〰️",
            "latin": "Ductus Deferens"
        },
        {
            "id": "seminal_vesicles",
            "name": "Seminal Vesicles (Paired Glands)",
            "icon": "🥖",
            "latin": "Vesiculae Seminales"
        },
        {
            "id": "prostate",
            "name": "Prostate Gland (Zonal Anatomy)",
            "icon": "🌰",
            "latin": "Prostata"
        },
        {
            "id": "penis",
            "name": "Penis (Erectile Organs)",
            "icon": "🍌",
            "latin": "Penis"
        },
        {
            "id": "ovaries",
            "name": "Human Ovaries (Female Gonads)",
            "icon": "🥚",
            "latin": "Ovarium"
        },
        {
            "id": "fallopian_tubes",
            "name": "Fallopian Tubes (Uterine Salpinx)",
            "icon": "🎺",
            "latin": "Tuba Uterina"
        },
        {
            "id": "uterus",
            "name": "Human Uterus (Womb)",
            "icon": "🫄",
            "latin": "Uterus"
        },
        {
            "id": "cervix",
            "name": "Cervix Uteri (Uterine Neck)",
            "icon": "🔘",
            "latin": "Cervix Uteri"
        },
        {
            "id": "vagina",
            "name": "Human Vagina (Birth Canal)",
            "icon": "🌸",
            "latin": "Vagina"
        },
        {
            "id": "placenta",
            "name": "Human Placenta (Gravid Organ)",
            "icon": "🥞",
            "latin": "Placenta"
        }
    ],
    "Integumentary System": [
        {
            "id": "skin",
            "name": "Human Skin (Integumentary Organ)",
            "icon": "🧴",
            "latin": "Cutis"
        },
        {
            "id": "subcutaneous_tissue",
            "name": "Subcutaneous Adipose Tissue (Hypodermis)",
            "icon": "🧈",
            "latin": "Tela Subcutanea"
        },
        {
            "id": "mammary_glands",
            "name": "Mammary Glands (Breasts)",
            "icon": "🍈",
            "latin": "Glandulae Mammariae"
        }
    ],
    "Musculoskeletal System": [
        {
            "id": "skeleton",
            "name": "Full Human Skeleton (206 Bones)",
            "icon": "🦴",
            "latin": "Skeleton Humanum"
        },
        {
            "id": "cranial_skull",
            "name": "Cranial Skull & Neurocranium",
            "icon": "💀",
            "latin": "Cranium"
        },
        {
            "id": "vertebral_column",
            "name": "Vertebral Column & Spine (33 Vertebrae)",
            "icon": "🦴",
            "latin": "Columna Vertebralis"
        },
        {
            "id": "thoracic_ribcage",
            "name": "Thoracic Cage (Ribs & Sternum)",
            "icon": "🦴",
            "latin": "Cavea Thoracis"
        },
        {
            "id": "pelvis_skeleton",
            "name": "Pelvic Girdle & Appendicular Bones",
            "icon": "🦴",
            "latin": "Pelvis"
        }
    ]
}


QUIZ_DATA = [
    {
        "id": 1,
        "organ": "heart",
        "question": "Which chamber of the heart has the thickest muscular myocardium?",
        "options": ["Left Ventricle", "Right Ventricle", "Left Atrium", "Right Atrium"],
        "correct": 0,
        "explanation": "The Left Ventricle has the thickest myocardial wall (10-12 mm) because it generates high systolic pressure (120 mmHg) to pump blood through the entire systemic arterial circuit."
    },
    {
        "id": 2,
        "organ": "heart",
        "question": "What is the primary function of epicardial adipose tissue seen along the coronary sulci?",
        "options": ["Absorbs digested food", "Cushions coronary arteries and protects from systolic shear stress", "Produces red blood cells", "Generates electrical pacemaker impulses"],
        "correct": 1,
        "explanation": "Epicardial adipose tissue lines the coronary grooves to cushion and protect coronary blood vessels from mechanical torsion during intense cardiac contractions."
    },
    {
        "id": 3,
        "organ": "liver",
        "question": "What percentage of blood supply to the liver comes from the Hepatic Portal Vein?",
        "options": ["25%", "50%", "75%", "100%"],
        "correct": 2,
        "explanation": "The liver receives approximately 75% of its total blood supply from the Hepatic Portal Vein (nutrient-rich blood from intestines) and 25% oxygenated blood from the Hepatic Artery."
    },
    {
        "id": 4,
        "organ": "right_lung",
        "question": "How many lobes does the right human lung have compared to the left lung?",
        "options": ["Right has 2, Left has 3", "Right has 3, Left has 2", "Both have 3 lobes", "Both have 2 lobes"],
        "correct": 1,
        "explanation": "The right lung has 3 lobes (Superior, Middle, Inferior), whereas the left lung has only 2 lobes to accommodate the cardiac notch for the heart."
    },
    {
        "id": 5,
        "organ": "brain",
        "question": "Which part of the brain contains over 50% of all neurons despite occupying only ~10% of total volume?",
        "options": ["Frontal Lobe", "Cerebellum", "Temporal Lobe", "Brainstem"],
        "correct": 1,
        "explanation": "The Cerebellum contains over 50% of all neurons in the central nervous system, densely packed in its cerebellar folia for fine motor coordination and balance."
    },
    {
        "id": 6,
        "organ": "kidney",
        "question": "Approximately how much blood filtrate do human kidneys process in a single 24-hour day?",
        "options": ["5 Liters", "25 Liters", "180 Liters", "1,000 Liters"],
        "correct": 2,
        "explanation": "Human kidneys filter approximately 180 Liters of blood plasma daily through 2 million glomeruli, but reabsorb 99% of fluid, resulting in about 1.5 Liters of excreted urine."
    }
]
