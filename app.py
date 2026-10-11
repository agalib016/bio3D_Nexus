"""
Bio3D Anatomia - Comprehensive 3D Human Anatomy Segmented Atlas
Flask Backend Application
"""

import os
import json
import io
import time
from flask import Flask, render_template, jsonify, request, send_file

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static'),
    static_url_path='/static'
)

@app.route('/favicon.ico')
def favicon():
    return ('', 204)



# Complete Anatomical Dataset with all major body parts, segmented structures, and clinical insights
ANATOMY_DATA = {
    "full_body": {
        "id": "full_body",
        "name": "Full Human Body",
        "system": "Integrated Multi-System Anatomy",
        "latin": "Corpus Humanum Integratum",
        "icon": "🧍",
        "overview": "Complete anatomical human matrix displaying all vital organs and skeletal systems in their natural spatial hierarchy within a translucent biometric human silhouette. Click any organ to zoom in for high-resolution micro-dissection.",
        "height": "175 cm (Adult Average)",
        "organ_count": "78 Distinct Organs",
        "skeletal_bones": "206 Adult Bones",
        "blood_supply": "Comprehensive Systemic & Pulmonary Vasculature",
        "segments": [
            {
                "id": "body_brain",
                "name": "Cranial Encephalon (Brain)",
                "color": "#38bdf8",
                "accent": "#7dd3fc",
                "function": "Superior master control center encased within the protective neurocranium.",
                "pathology": "Traumatic Brain Injury, Encephalitis, Stroke",
                "pos": [0, 2.05, 0],
                "scale": [0.75, 0.75, 0.75]
            },
            {
                "id": "body_heart",
                "name": "Thoracic Heart & Aorta",
                "color": "#ef4444",
                "accent": "#f87171",
                "function": "Central mediastinal muscular pump driving systemic and pulmonary circulation.",
                "pathology": "Atherosclerosis, Myocardial Infarction, Arrhythmia",
                "pos": [-0.08, 0.95, 0.08],
                "scale": [0.7, 0.7, 0.7]
            },
            {
                "id": "body_lungs",
                "name": "Pulmonary Matrix (Bilateral Lungs)",
                "color": "#ec4899",
                "accent": "#f472b6",
                "function": "Flanks cardiac mediastinum for continuous atmospheric gas diffusion.",
                "pathology": "COPD, Asthma, Pneumonia",
                "pos": [0, 0.92, -0.05],
                "scale": [1.1, 0.85, 0.85]
            },
            {
                "id": "body_liver",
                "name": "Hepatic Viscus (Liver)",
                "color": "#9a3412",
                "accent": "#ea580c",
                "function": "Largest internal metabolic organ performing detoxification, bile production, and glycogen storage.",
                "pathology": "Hepatitis, Cirrhosis, Fatty Liver Disease",
                "pos": [0.35, 0.25, 0.08],
                "scale": [0.75, 0.65, 0.65]
            },
            {
                "id": "body_stomach",
                "name": "Gastric Chamber (Stomach)",
                "color": "#f59e0b",
                "accent": "#fbbf24",
                "function": "J-shaped muscular pouch secreting hydrochloric acid and pepsin for enzymatic food breakdown.",
                "pathology": "Gastritis, Peptic Ulcers, GERD",
                "pos": [-0.3, 0.22, 0.05],
                "scale": [0.65, 0.65, 0.65]
            },
            {
                "id": "body_kidneys",
                "name": "Retroperitoneal Renal Matrix (Kidneys)",
                "color": "#be123c",
                "accent": "#e11d48",
                "function": "Paired flank organs for systemic fluid balance and metabolic filtration.",
                "pathology": "Chronic Kidney Disease, Nephrolithiasis",
                "pos": [0, -0.15, -0.12],
                "scale": [0.85, 0.7, 0.65]
            },
            {
                "id": "body_intestines",
                "name": "Enteric Complex (Small & Large Intestines)",
                "color": "#10b981",
                "accent": "#34d399",
                "function": "Major site of nutrient absorption, water reabsorption, and microbial fermentation.",
                "pathology": "Crohn's Disease, Ulcerative Colitis, Appendicitis",
                "pos": [0, -0.45, 0.05],
                "scale": [0.95, 0.8, 0.75]
            },
            {
                "id": "body_skeleton",
                "name": "Axial Skeleton & Ribcage",
                "color": "#cbd5e1",
                "accent": "#f1f5f9",
                "function": "Rigid osteo-cartilaginous framework shielding vital organs and anchoring skeletal musculature.",
                "pathology": "Osteoporosis, Scoliosis, Fractures",
                "pos": [0, 0.35, 0],
                "scale": [1.2, 2.4, 0.9]
            }
        ],
        "clinical_facts": [
            "All human bodily systems operate in continuous homeostatic synergy via neural, hormonal, and vascular feedback loops.",
            "Skin is the largest human organ by weight and surface area (~3.6 kg, 2 m²), while the liver is the largest internal solid organ (~1.5 kg).",
            "The human body contains approximately 60,000 miles (100,000 km) of blood vessels when laid end to end."
        ]
    },

    "heart": {
        "id": "heart",
        "name": "Human Heart",
        "system": "Cardiovascular System",
        "latin": "Cor Humanum",
        "icon": "🫀",
        "overview": "A specialized muscular four-chambered organ displaying authentic anatomical specimen coloration (matching physical models): muscular ventricles with adipose fat deposits along coronary grooves, branched coronary arteries, ascending aortic arch, blue pulmonary trunk, and internal heart valves.",
        "weight": "~300g (Adult)",
        "rate": "60 - 100 BPM",
        "output": "~5.0 L/min",
        "blood_supply": "Left & Right Coronary Arteries (LAD, LCx, RCA)",
        "segments": [
            {
                "id": "ventricles_myocardium",
                "name": "Muscular Ventricles (Myocardium)",
                "color": "#d94828",
                "accent": "#ea580c",
                "function": "Thick contracting striated muscle mass providing contractile power to drive systemic and pulmonary blood flow.",
                "pathology": "Myocardial Infarction, Cardiomyopathy, Ventricular Tachycardia",
                "thickness": "Left Ventricle 10-12 mm, Right Ventricle 3-5 mm",
                "pos": [-0.05, -0.38, 0.12],
                "scale": [1.2, 1.25, 1.15]
            },
            {
                "id": "epicardial_fat",
                "name": "Epicardial Adipose Tissue (Fat Pads)",
                "color": "#eab308",
                "accent": "#facc15",
                "function": "Protective yellowish adipose cushioning layer lining the interventricular and atrioventricular coronary sulci.",
                "pathology": "Excess epicardial fat correlates with Coronary Artery Disease and metabolic syndrome",
                "pos": [0.05, -0.22, 0.42],
                "scale": [1.05, 0.95, 1.05]
            },
            {
                "id": "coronary_network",
                "name": "Coronary Arteries & Cardiac Veins",
                "color": "#ef4444",
                "accent": "#38bdf8",
                "function": "Intricate branching vascular tree supplying oxygenated blood directly to the contracting myocardium and draining via cardiac veins.",
                "pathology": "Atherosclerotic Plaque, Coronary Spasm, STEMI / NSTEMI",
                "branches": "LAD (Left Anterior Descending), LCx (Circumflex), RCA (Right Coronary)",
                "pos": [0.08, -0.28, 0.52],
                "scale": [1.02, 1.05, 1.02]
            },
            {
                "id": "aorta",
                "name": "Ascending Aorta & Aortic Arch",
                "color": "#e11d48",
                "accent": "#f43f5e",
                "function": "Grand thick elastic arterial trunk carrying high-pressure oxygenated blood from the left ventricle into systemic circulation.",
                "pathology": "Aortic Aneurysm, Aortic Dissection, Coarctation of Aorta",
                "pressure": "120/80 mmHg",
                "pos": [-0.05, 1.35, -0.1],
                "scale": [1.05, 1.05, 1.05]
            },
            {
                "id": "pulmonary_trunk",
                "name": "Pulmonary Trunk & Arteries",
                "color": "#1d4ed8",
                "accent": "#3b82f6",
                "function": "Prominent blue arterial conduit branching into left and right pulmonary arteries to deliver deoxygenated blood to lungs.",
                "pathology": "Pulmonary Embolism, Pulmonary Arterial Hypertension",
                "pressure": "25/10 mmHg",
                "pos": [0.15, 1.1, 0.35],
                "scale": [0.95, 0.95, 0.95]
            },
            {
                "id": "vena_cava",
                "name": "Superior & Inferior Vena Cava",
                "color": "#2563eb",
                "accent": "#60a5fa",
                "function": "Large caliber venous channels returning systemic venous deoxygenated blood into the right atrium.",
                "pathology": "SVC Syndrome, Central Venous Thrombosis",
                "pos": [0.72, 1.15, -0.35],
                "scale": [0.85, 1.15, 0.85]
            },
            {
                "id": "atria_auricles",
                "name": "Left & Right Atria & Auricles",
                "color": "#f1f5f9",
                "accent": "#cbd5e1",
                "function": "Thin-walled receiving chambers with scalloped auricle appendages capturing incoming venous blood.",
                "pathology": "Atrial Fibrillation, Patent Foramen Ovale, Atrial Septal Defect",
                "pos": [0.05, 0.55, -0.25],
                "scale": [1.1, 0.85, 1.0]
            },
            {
                "id": "heart_valves",
                "name": "Heart Valves & Chordae Tendineae",
                "color": "#ffffff",
                "accent": "#f8fafc",
                "function": "Delicate fibrous leaflets (Mitral, Tricuspid, Aortic, Pulmonary) tethered by fibrous cord strings preventing backflow.",
                "pathology": "Mitral Valve Prolapse, Aortic Stenosis, Infective Endocarditis",
                "structure": "Tricuspid, Bicuspid/Mitral, Papillary muscles & Chordae Tendineae",
                "pos": [-0.1, -0.15, 0.0],
                "scale": [0.9, 0.9, 0.9]
            }
        ],
        "clinical_facts": [
            "The heart pumps approximately 7,500 liters (2,000 gallons) of blood every single day.",
            "As seen in anatomical models, epicardial adipose tissue lines the coronary sulci to protect vessels from myocardial systolic shear stress.",
            "The mitral and tricuspid valves are tethered by 'chordae tendineae' (heart strings) attached to papillary muscles that contract synchronously to prevent valvular prolapse."
        ]
    },

    "lungs": {
        "id": "lungs",
        "name": "Human Respiratory System",
        "system": "Respiratory System",
        "latin": "Pulmones & Arbor Bronchialis",
        "icon": "🫁",
        "overview": "Spongy pink paired thoracic organs with segmented lobes, cartilaginous trachea, branching bronchial tree, and the inferior diaphragmatic muscle.",
        "weight": "~1,000g combined",
        "capacity": "4.5 - 6.0 Liters (Total Lung Capacity)",
        "surface_area": "~70-100 m²",
        "blood_supply": "Pulmonary Circulation & Bronchial Arteries",
        "segments": [
            {
                "id": "trachea_tree",
                "name": "Trachea & Bronchial Tree",
                "color": "#06d6a0",
                "accent": "#34d399",
                "function": "Windpipe supported by 16-20 hyaline cartilage rings dividing into primary and segmental bronchi.",
                "pathology": "Bronchitis, Tracheomalacia, Foreign Body Aspiration",
                "pos": [0, 1.35, 0],
                "scale": [0.75, 1.25, 0.75]
            },
            {
                "id": "right_lung",
                "name": "Right Lung (Superior, Middle & Inferior Lobes)",
                "color": "#ec4899",
                "accent": "#f472b6",
                "function": "Three-lobed lung with horizontal and oblique fissures conducting basal, middle and apical ventilation.",
                "pathology": "Pneumonia, Tuberculosis apical reactivation, Right middle lobe syndrome",
                "pos": [1.1, 0.05, 0.0],
                "scale": [1.1, 1.3, 1.05]
            },
            {
                "id": "left_lung",
                "name": "Left Lung & Cardiac Notch",
                "color": "#f43f5e",
                "accent": "#fb7185",
                "function": "Two-lobed lung accommodating the cardiac impression with lingula reflecting the middle lobe.",
                "pathology": "Atelectasis, Bronchogenic Carcinoma, Pleural Effusion",
                "pos": [-1.1, 0.0, 0.0],
                "scale": [1.05, 1.3, 1.0]
            },
            {
                "id": "diaphragm",
                "name": "Muscular Diaphragm Base Dome",
                "color": "#8b5cf6",
                "accent": "#a78bfa",
                "function": "Chief inspiratory muscular floor that drops during contraction to generate negative intrathoracic suction.",
                "pathology": "Diaphragmatic Hernia, Phrenic Nerve Paralysis",
                "pos": [0, -1.55, 0],
                "scale": [2.2, 0.35, 1.5]
            }
        ],
        "clinical_facts": [
            "The right lung has 3 lobes while the left lung has only 2 lobes to accommodate space for the heart's leftward apex.",
            "Both lungs contain roughly 300 to 500 million microscopic alveoli providing a gas exchange area equivalent to a tennis court.",
            "Surfactant produced by Type II pneumocytes prevents alveolar collapse at the end of each expiration."
        ]
    },

    "brain": {
        "id": "brain",
        "name": "Human Brain",
        "system": "Central Nervous System",
        "latin": "Encephalon",
        "icon": "🧠",
        "overview": "The central processor of the nervous system consisting of the convoluted cerebral hemispheres with gyri and sulci, cerebellum, and the autonomic brainstem.",
        "weight": "~1,350g (Adult)",
        "neuron_count": "~86 Billion Neurons",
        "power_consumption": "20% of resting metabolic energy",
        "blood_supply": "Circle of Willis (Internal Carotids & Vertebral Arteries)",
        "segments": [
            {
                "id": "cerebral_cortex",
                "name": "Cerebral Hemispheres (Gyri & Sulci)",
                "color": "#38bdf8",
                "accent": "#7dd3fc",
                "function": "Cerebral mantle governing high-order cognition, sensory perception, voluntary motion, and language.",
                "pathology": "Alzheimer's Disease, Ischemic Stroke, Glioblastoma",
                "pos": [0, 0.45, 0.1],
                "scale": [1.25, 0.95, 1.3]
            },
            {
                "id": "cerebellum",
                "name": "Cerebellum (Folia & Arbor Vitae)",
                "color": "#10b981",
                "accent": "#34d399",
                "function": "Infratentorial structure coordinating balance, fine motor precision timing, and motor skill learning.",
                "pathology": "Cerebellar Ataxia, Intention Tremor, Chiari Malformation",
                "pos": [0, -0.75, -0.75],
                "scale": [1.1, 0.75, 0.85]
            },
            {
                "id": "brainstem",
                "name": "Brainstem (Pons & Medulla)",
                "color": "#f59e0b",
                "accent": "#fbbf24",
                "function": "Vital conduit controlling respiration, heart rate, blood pressure, and cranial nerves III-XII.",
                "pathology": "Brainstem Stroke, Herniation, Locked-in Syndrome",
                "pos": [0, -1.15, -0.15],
                "scale": [0.45, 0.95, 0.45]
            }
        ],
        "clinical_facts": [
            "The brain itself has zero pain receptors; headaches originate in the meninges, cranial nerves, and cerebral blood vessels.",
            "The cerebellum contains over 50% of the entire brain's neurons despite occupying only 10% of total intracranial volume.",
            "The blood-brain barrier (BBB) strictly regulates chemical entry into neural parenchyma via tight endothelial junctions."
        ]
    },

    "eye": {
        "id": "eye",
        "name": "Human Eye (Ocular Globe)",
        "system": "Sensory Visual Apparatus",
        "latin": "Bulbus Oculi",
        "icon": "👁️",
        "overview": "Detailed sensory globe featuring the transparent curved cornea, colored contractile iris with central pupil, crystalline accommodating lens, vitreous chamber, retinal neurosensory cup, and optic nerve bundle.",
        "diameter": "~24 mm (Axial Length)",
        "refractive_power": "~60 Diopters",
        "photoreceptors": "120M Rods, 6M Cones",
        "blood_supply": "Ophthalmic Artery & Central Retinal Artery",
        "segments": [
            {
                "id": "cornea",
                "name": "Cornea (Transparent Optical Window)",
                "color": "#00f0ff",
                "accent": "#67e8f9",
                "function": "Avascular anterior dome providing ~43 diopters of refractive focus.",
                "pathology": "Keratoconus, Corneal Abrasion, Astigmatism",
                "pos": [0, 0, 1.15],
                "scale": [0.85, 0.85, 0.45]
            },
            {
                "id": "iris_pupil",
                "name": "Iris & Pupillary Aperture",
                "color": "#14b8a6",
                "accent": "#2dd4bf",
                "function": "Pigmented circular diaphragm regulating light entrance via pupillary constriction and dilation.",
                "pathology": "Iritis, Horner Syndrome, Aniridia",
                "pos": [0, 0, 0.85],
                "scale": [0.85, 0.85, 0.2]
            },
            {
                "id": "lens",
                "name": "Crystalline Lens & Zonules",
                "color": "#a5f3fc",
                "accent": "#cffafe",
                "function": "Biconvex crystal providing dynamic optical accommodation between distance and near vision.",
                "pathology": "Cataracts (Lens Opacity), Presbyopia",
                "pos": [0, 0, 0.55],
                "scale": [0.75, 0.75, 0.35]
            },
            {
                "id": "sclera_retina",
                "name": "Sclera Coat, Retina & Optic Nerve",
                "color": "#f1f5f9",
                "accent": "#f97316",
                "function": "White fibrous protective sphere, sensory photoreceptor retina, and optic nerve conducting impulses to occipital cortex.",
                "pathology": "Glaucoma, Retinal Detachment, Macular Degeneration",
                "pos": [0, 0, -0.4],
                "scale": [1.2, 1.2, 1.2]
            }
        ],
        "clinical_facts": [
            "The cornea is the only living human tissue with no blood vessels, absorbing oxygen directly from ambient air.",
            "Human eye muscles (extraocular recti and obliques) are the most active muscles in the body, moving over 100,000 times daily.",
            "The optic nerve creates a physiological blind spot where it exits the retina without photoreceptors."
        ]
    },

    "kidney": {
        "id": "kidney",
        "name": "Human Kidneys & Adrenals",
        "system": "Renal / Urinary System",
        "latin": "Renes & Glandulae Suprarenales",
        "icon": "🫘",
        "overview": "Bean-shaped retroperitoneal filtration organs showing outer parenchymal cortex, medullary pyramids, golden renal pelvis, suprarenal adrenal endocrine caps, renal pedicle vessels, and descending ureters.",
        "weight": "~150g each",
        "filtration": "180 Liters blood filtrate/day",
        "urine_production": "1.0 - 2.0 Liters/day",
        "blood_supply": "Renal Arteries (Receiving 20-25% of Cardiac Output)",
        "segments": [
            {
                "id": "renal_parenchyma",
                "name": "Renal Cortex & Glomeruli",
                "color": "#be123c",
                "accent": "#e11d48",
                "function": "Outer cortex housing ~1 million microscopic nephrons filtering plasma.",
                "pathology": "Glomerulonephritis, Polycystic Kidney Disease, Renal Cell Carcinoma",
                "pos": [0.65, 0.1, 0.0],
                "scale": [1.1, 1.35, 0.8]
            },
            {
                "id": "renal_medulla_pelvis",
                "name": "Medullary Pyramids & Renal Pelvis",
                "color": "#881337",
                "accent": "#f59e0b",
                "function": "Countercurrent osmotic gradient pyramids converging into pelvis to funnel urine into ureter.",
                "pathology": "Kidney Stones (Nephrolithiasis), Hydronephrosis",
                "pos": [0.35, 0.05, 0.0],
                "scale": [0.85, 0.95, 0.7]
            },
            {
                "id": "adrenal_glands",
                "name": "Suprarenal (Adrenal) Gland Cap",
                "color": "#eab308",
                "accent": "#facc15",
                "function": "Endocrine gland synthesizing cortisol, aldosterone, and adrenaline.",
                "pathology": "Pheochromocytoma, Addison's Disease, Cushing Syndrome",
                "pos": [0.55, 1.25, 0.0],
                "scale": [0.75, 0.45, 0.55]
            },
            {
                "id": "renal_vessels_ureter",
                "name": "Renal Artery, Vein & Ureter Conduit",
                "color": "#dc2626",
                "accent": "#2563eb",
                "function": "Vascular pedicle receiving massive cardiac flow and muscular tube conducting urine to bladder.",
                "pathology": "Renal Artery Stenosis, Ureteral Colic",
                "pos": [-0.35, -0.45, 0.05],
                "scale": [0.85, 1.2, 0.6]
            }
        ],
        "clinical_facts": [
            "Your kidneys filter 180 liters of blood plasma daily, reabsorbing over 99% of fluid and salts.",
            "Kidneys receive 20-25% of all blood pumped by the heart every minute.",
            "Kidneys produce Erythropoietin (EPO), the hormone stimulating red blood cell production in bone marrow."
        ]
    },

    "liver": {
        "id": "liver",
        "name": "Human Liver & Gallbladder",
        "system": "Digestive & Metabolic System",
        "latin": "Hepar & Vesica Biliaris",
        "icon": "🫓",
        "overview": "The largest solid internal organ located in the right upper abdominal quadrant, featuring asymmetric right and left anatomical lobes, falciform ligament, emerald gallbladder, and portal vein inflow.",
        "weight": "~1,500g (Adult)",
        "functions_count": "Over 500 vital biochemical functions",
        "blood_supply": "Hepatic Portal Vein (75%) & Hepatic Artery (25%)",
        "bile_production": "600 - 1,000 mL/day",
        "segments": [
            {
                "id": "right_hepatic_lobe",
                "name": "Right Hepatic Lobe",
                "color": "#9a3412",
                "accent": "#c2410c",
                "function": "Dominant parenchymal lobe performing majority of detoxification, protein synthesis, and glycogen metabolism.",
                "pathology": "Cirrhosis, Hepatocellular Carcinoma (HCC), Hepatic Steatosis",
                "pos": [0.45, 0.05, 0.05],
                "scale": [1.25, 1.05, 1.1]
            },
            {
                "id": "left_hepatic_lobe",
                "name": "Left Hepatic Lobe & Falciform Ligament",
                "color": "#7c2d12",
                "accent": "#ea580c",
                "function": "Flattens across the epigastrium above the stomach, bounded by falciform peritoneal fold.",
                "pathology": "Hepatomegaly, Hemangioma",
                "pos": [-0.65, 0.15, 0.1],
                "scale": [0.95, 0.85, 0.95]
            },
            {
                "id": "gallbladder_biliary",
                "name": "Gallbladder & Cystic/Bile Ducts",
                "color": "#10b981",
                "accent": "#34d399",
                "function": "Pear-shaped reservoir concentrating and storing hepatic bile for postprandial dietary fat emulsification.",
                "pathology": "Gallstones (Cholelithiasis), Cholecystitis, Biliary Atresia",
                "pos": [0.25, -0.65, 0.35],
                "scale": [0.55, 0.75, 0.55]
            },
            {
                "id": "hepatic_portal_triad",
                "name": "Portal Vein, Hepatic Artery & Common Bile Duct",
                "color": "#1d4ed8",
                "accent": "#dc2626",
                "function": "Vital porta hepatis conduit bringing nutrient-rich enteric blood directly from mesenteric veins.",
                "pathology": "Portal Hypertension, Esophageal Varices",
                "pos": [-0.05, -0.55, -0.2],
                "scale": [0.65, 0.75, 0.65]
            }
        ],
        "clinical_facts": [
            "The liver is the only visceral organ capable of true cellular regeneration; as little as 25% of a healthy liver can regenerate into a full organ.",
            "The liver receives a dual blood supply: 75% nutrient-rich venous blood from the portal vein and 25% oxygenated arterial blood from the hepatic artery.",
            "It stores sufficient glycogen, vitamin A, D, B12, and iron to sustain the body for months during fasting."
        ]
    },

    "stomach": {
        "id": "stomach",
        "name": "Human Stomach & Gastric Rugae",
        "system": "Gastrointestinal System",
        "latin": "Gaster / Ventriculus",
        "icon": "🥐",
        "overview": "Curved J-shaped hollow muscular organ located in the left hypochondrium featuring the cardiac notch, dome-like fundus, greater and lesser curvatures, pyloric sphincter, and internal folded rugae mucosa.",
        "capacity": "~1.5 Liters (Distended)",
        "gastric_ph": "1.5 - 2.0 (Hydrochloric Acid)",
        "emptying_time": "2 - 4 hours",
        "blood_supply": "Celiac Trunk branches (Gastric & Gastroepiploic Arteries)",
        "segments": [
            {
                "id": "fundus_body",
                "name": "Gastric Fundus & Body (Corpus)",
                "color": "#f59e0b",
                "accent": "#fbbf24",
                "function": "Superior dome collecting swallowed gases and primary muscular churning chamber secreting intrinsic factor and HCl.",
                "pathology": "Gastritis, Gastric Adenocarcinoma, Pernicious Anemia",
                "pos": [-0.35, 0.45, 0.05],
                "scale": [1.15, 1.15, 1.0]
            },
            {
                "id": "greater_lesser_curvature",
                "name": "Greater & Lesser Curvatures",
                "color": "#ea580c",
                "accent": "#f97316",
                "function": "Convex inferolateral and concave superomedial borders anchoring the greater and lesser omenta.",
                "pathology": "Gastric Peptic Ulcers (H. pylori predilection), Perforation",
                "pos": [-0.1, -0.15, 0.1],
                "scale": [1.2, 1.1, 1.05]
            },
            {
                "id": "pylorus_antrum",
                "name": "Pyloric Antrum & Sphincter",
                "color": "#d97706",
                "accent": "#b45309",
                "function": "Thick smooth muscle valve regulating metered chyme evacuation into the duodenum.",
                "pathology": "Hypertrophic Pyloric Stenosis, Gastroparesis",
                "pos": [0.65, -0.55, 0.15],
                "scale": [0.75, 0.65, 0.65]
            },
            {
                "id": "esophageal_junction",
                "name": "Cardia & Lower Esophageal Sphincter (LES)",
                "color": "#fb7185",
                "accent": "#f43f5e",
                "function": "Inlet transition preventing acidic gastric reflux into the squamous esophageal mucosa.",
                "pathology": "GERD, Barrett's Esophagus, Hiatal Hernia",
                "pos": [-0.35, 1.1, -0.1],
                "scale": [0.45, 0.85, 0.45]
            }
        ],
        "clinical_facts": [
            "The stomach lining secretes a protective alkaline mucus gel layer to prevent self-digestion by its concentrated hydrochloric acid (pH ~1.5).",
            "The stomach produces 'Intrinsic Factor', an indispensable glycoprotein required for Vitamin B12 absorption in the terminal ileum.",
            "Surface epithelial cells of the gastric mucosa are completely replaced every 3 to 6 days."
        ]
    },

    "intestines": {
        "id": "intestines",
        "name": "Human Intestinal Tract",
        "system": "Enteric & Digestive System",
        "latin": "Intestinum Tenue & Crassum",
        "icon": "🌀",
        "overview": "Comprehensive enteric labyrinth showing the tightly coiled loops of the small intestine (jejunum and ileum) framed by the peripheral large intestine (cecum, ascending, transverse, descending, and sigmoid colon with vermiform appendix).",
        "length": "~7.5 meters combined (Small intestine ~6m, Large ~1.5m)",
        "surface_area": "~30 m² (Microvilli Brush Border)",
        "microbiome": "~38 Trillion Symbiotic Microbes",
        "blood_supply": "Superior & Inferior Mesenteric Arteries",
        "segments": [
            {
                "id": "small_intestine_coils",
                "name": "Small Intestine (Jejunum & Ileum Coils)",
                "color": "#fb923c",
                "accent": "#fdba74",
                "function": "Central folded convolutions lined with microscopic villi responsible for ~90% of systemic nutrient absorption.",
                "pathology": "Celiac Disease, Crohn's Disease, Small Bowel Obstruction (SBO)",
                "pos": [0, -0.2, 0.2],
                "scale": [1.15, 1.05, 0.95]
            },
            {
                "id": "ascending_transverse_colon",
                "name": "Large Colon (Ascending, Transverse, Descending)",
                "color": "#10b981",
                "accent": "#34d399",
                "function": "Peripheral haustrated muscular colon compacting fecal waste and reabsorbing water and electrolytes.",
                "pathology": "Colorectal Polyps, Diverticulitis, Ulcerative Colitis",
                "pos": [0, 0.35, 0.05],
                "scale": [1.45, 1.3, 0.85]
            },
            {
                "id": "cecum_appendix",
                "name": "Cecum & Vermiform Appendix",
                "color": "#e11d48",
                "accent": "#f43f5e",
                "function": "Pouch at ileocecal junction harboring commensal biofilm reservoir.",
                "pathology": "Acute Appendicitis (McBurney's Point tenderness), Typhlitis",
                "pos": [0.95, -0.85, 0.15],
                "scale": [0.65, 0.65, 0.65]
            },
            {
                "id": "rectum_sigmoid",
                "name": "Sigmoid Colon & Rectum",
                "color": "#059669",
                "accent": "#10b981",
                "function": "S-shaped pelvic conduit holding waste prior to defecation via anal sphincters.",
                "pathology": "Hemorrhoids, Rectal Prolapse, Sigmoid Volvulus",
                "pos": [-0.15, -1.15, -0.1],
                "scale": [0.65, 0.95, 0.65]
            }
        ],
        "clinical_facts": [
            "The gut has its own autonomous nervous system (the Enteric Nervous System, or 'Second Brain') containing over 500 million neurons.",
            "Over 90% of the body's serotonin is synthesized by enterochromaffin cells in the gastrointestinal tract.",
            "The intestinal epithelial brush border renews itself completely every 4 to 5 days."
        ]
    },

    "pancreas_spleen": {
        "id": "pancreas_spleen",
        "name": "Pancreas & Spleen",
        "system": "Endocrine & Lymphatic System",
        "latin": "Pancreas & Splen / Lien",
        "icon": "🥖",
        "overview": "Retroperitoneal elongated digestive gland (head, uncinate process, body, and tail) cradled in the C-loop of the duodenum, alongside the purple lymphoid spleen in the left upper quadrant.",
        "pancreas_weight": "~80-100g",
        "spleen_weight": "~150g",
        "endocrine_output": "Insulin, Glucagon, Somatostatin (Islets of Langerhans)",
        "exocrine_output": "Amylase, Lipase, Trypsinogen (~1.5 L pancreatic juice/day)",
        "segments": [
            {
                "id": "pancreas_head_body",
                "name": "Pancreas (Head, Body & Tail)",
                "color": "#facc15",
                "accent": "#fde047",
                "function": "Dual exocrine digestive and endocrine glycemic control organ synthesizing insulin and glucagon.",
                "pathology": "Pancreatitis, Pancreatic Ductal Adenocarcinoma, Type 1 & 2 Diabetes",
                "pos": [0.15, 0.05, 0.05],
                "scale": [1.4, 0.65, 0.6]
            },
            {
                "id": "spleen_lymphoid",
                "name": "Spleen (Red & White Pulp)",
                "color": "#881337",
                "accent": "#9f1239",
                "function": "Largest secondary lymphoid organ filtering senescent erythrocytes and orchestrating humoral immune responses.",
                "pathology": "Splenomegaly, Splenic Rupture (Kehr's sign in trauma), ITP",
                "pos": [-1.05, 0.35, -0.2],
                "scale": [0.85, 0.95, 0.75]
            },
            {
                "id": "duodenal_loop",
                "name": "Duodenal C-Loop Cradling Head",
                "color": "#fb923c",
                "accent": "#fdba74",
                "function": "First section of small intestine receiving bile and pancreatic enzymes via Ampulla of Vater.",
                "pathology": "Duodenal Ulcers, Duodenal Atresia",
                "pos": [0.85, -0.15, 0.15],
                "scale": [0.75, 1.15, 0.65]
            }
        ],
        "clinical_facts": [
            "The pancreas contains roughly 1 million Islets of Langerhans, which make up only 1-2% of its total mass but produce all the body's insulin.",
            "The spleen holds approximately 1 cup (240 mL) of reserve blood that can be mobilized into circulation during hemorrhagic shock.",
            "Post-splenectomy patients require vaccinations against encapsulated bacteria (Pneumococcus, Meningococcus, H. influenzae) due to loss of splenic phagocytosis."
        ]
    },

    "bladder": {
        "id": "bladder",
        "name": "Urinary Bladder & Pelvic Viscera",
        "system": "Urinary Storage Apparatus",
        "latin": "Vesica Urinaria",
        "icon": "🎈",
        "overview": "Distensible muscular hollow organ resting on the pelvic floor designed to store urine received from bilateral ureters, bounded by the detrusor smooth muscle, trigone, and urethral internal sphincter.",
        "capacity": "400 - 600 mL (Adult normal capacity)",
        "urge_threshold": "First urge at ~150 - 250 mL",
        "muscle_wall": "Detrusor Smooth Muscle (Parasympathetic M3 receptors)",
        "blood_supply": "Superior & Inferior Vesical Arteries",
        "segments": [
            {
                "id": "detrusor_body",
                "name": "Detrusor Muscle Dome & Body",
                "color": "#f43f5e",
                "accent": "#fb7185",
                "function": "Thick woven interlacing smooth muscle fibers that relax to store urine and contract during micturition.",
                "pathology": "Overactive Bladder (OAB), Neurogenic Bladder, Urothelial Carcinoma",
                "pos": [0, 0.15, 0.05],
                "scale": [1.1, 1.1, 1.05]
            },
            {
                "id": "trigone_neck",
                "name": "Bladder Trigone & Internal Neck",
                "color": "#fbbf24",
                "accent": "#f59e0b",
                "function": "Smooth triangular non-distensible base bounded by left and right ureteral orifices and urethral internal meatus.",
                "pathology": "Trigonitis, Interstitial Cystitis (Hunner's Lesions)",
                "pos": [0, -0.45, 0.15],
                "scale": [0.85, 0.65, 0.75]
            },
            {
                "id": "ureters_inflow",
                "name": "Bilateral Ureteral Inflow Orifices",
                "color": "#f8fafc",
                "accent": "#e2e8f0",
                "function": "Oblique muscular intramural tunnels preventing urine vesicoureteral reflux during bladder filling.",
                "pathology": "Vesicoureteral Reflux (VUR), Ureterocele",
                "pos": [0, 0.55, -0.25],
                "scale": [0.55, 0.95, 0.55]
            }
        ],
        "clinical_facts": [
            "The bladder wall can stretch from 2-3 mm thick when distended to over 15 mm thick when emptied.",
            "The trigone region is embryologically derived from mesodermal Wolffian ducts, unlike the rest of the bladder which derives from endoderm.",
            "Urination involves precise reciprocal autonomic control: sympathetic storage (T11-L2) and parasympathetic voiding (S2-S4)."
        ]
    },

    "skeleton": {
        "id": "skeleton",
        "name": "Human Skeletal Spine & Ribcage",
        "system": "Skeletal Structural System",
        "latin": "Skeleton Axiale & Columna Vertebralis",
        "icon": "🦴",
        "overview": "The central articulating axial structural chassis of the human body, composed of the vertebral column (cervical, thoracic, lumbar, sacrum, coccyx) protecting the spinal cord, articulated with 12 pairs of ribs and the sternum.",
        "bones_count": "206 Adult Bones (80 Axial, 126 Appendicular)",
        "vertebrae": "33 Vertebrae (7 Cervical, 12 Thoracic, 5 Lumbar, 5 Sacral fused, 4 Coccygeal)",
        "mineral_storage": "Stores 99% of body's Calcium and 85% of Phosphorus",
        "blood_supply": "Nutrient Arteries & Periosteal Vascular Plexus",
        "segments": [
            {
                "id": "vertebral_column",
                "name": "Articulated Vertebral Column & Discs",
                "color": "#e2e8f0",
                "accent": "#f8fafc",
                "function": "Flexible curved S-shape column shielding spinal cord and distributing biomechanical gravity loads.",
                "pathology": "Herniated Nucleus Pulposus, Scoliosis, Spinal Stenosis, Spondylolisthesis",
                "pos": [0, 0.1, -0.35],
                "scale": [0.65, 2.3, 0.65]
            },
            {
                "id": "ribcage_cage",
                "name": "Thoracic Ribcage (True, False & Floating Ribs)",
                "color": "#cbd5e1",
                "accent": "#f1f5f9",
                "function": "12 pairs of osteo-cartilaginous arches shielding heart and lungs and expanding with respiration.",
                "pathology": "Rib Fractures, Flail Chest, Costochondritis",
                "pos": [0, 0.45, 0.05],
                "scale": [1.45, 1.35, 1.15]
            },
            {
                "id": "sternum_manubrium",
                "name": "Sternum (Manubrium, Body & Xiphoid)",
                "color": "#94a3b8",
                "accent": "#cbd5e1",
                "function": "Anterior midline breastplate anchoring costal cartilages and protecting mediastinal structures.",
                "pathology": "Sternal Fracture, Pectus Excavatum, Pectus Carinatum",
                "pos": [0, 0.65, 0.65],
                "scale": [0.45, 1.05, 0.35]
            },
            {
                "id": "pelvic_girdle",
                "name": "Pelvic Girdle (Ilium, Ischium & Pubis)",
                "color": "#cbd5e1",
                "accent": "#f8fafc",
                "function": "Massive basin transmitting upper body weight to femoral lower extremities and protecting pelvic viscera.",
                "pathology": "Pelvic Ring Fractures, Sacroiliitis, Osteoarthritis",
                "pos": [0, -1.15, -0.05],
                "scale": [1.35, 0.85, 0.95]
            }
        ],
        "clinical_facts": [
            "Bone is a living dynamic tissue that constantly remodels; your entire adult skeleton is completely replaced every 7 to 10 years.",
            "Bone marrow in the pelvis, vertebrae, and sternum produces roughly 200 billion red blood cells every single day.",
            "The human foot alone contains 26 bones—more than one-quarter of all the bones in the entire human body reside in both feet."
        ]
    }
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
        "organ": "lungs",
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

@app.route('/')
def index():
    return render_template('index.html', organs=ANATOMY_DATA)

@app.route('/api/organs')
def get_organs():
    return jsonify({
        "status": "success",
        "total": len(ANATOMY_DATA),
        "data": ANATOMY_DATA
    })

@app.route('/api/organ/<organ_id>')
def get_organ(organ_id):
    organ = ANATOMY_DATA.get(organ_id)
    if not organ:
        return jsonify({"status": "error", "message": f"Organ '{organ_id}' not found"}), 404
    return jsonify({
        "status": "success",
        "data": organ
    })

@app.route('/api/quiz')
def get_quiz():
    return jsonify({
        "status": "success",
        "questions": QUIZ_DATA
    })

@app.route('/api/search')
def search_anatomy():
    query = request.args.get('q', '').lower().strip()
    if not query:
        return jsonify({"results": []})
    
    results = []
    for organ_id, organ in ANATOMY_DATA.items():
        # Match organ name, overview, system
        if query in organ['name'].lower() or query in organ['overview'].lower() or query in organ['system'].lower():
            results.append({
                "type": "organ",
                "organ_id": organ_id,
                "title": organ['name'],
                "subtitle": organ['system'],
                "icon": organ['icon'],
                "segment_id": None
            })
        
        # Match individual segments
        for seg in organ.get('segments', []):
            if query in seg['name'].lower() or query in seg.get('function', '').lower() or query in seg.get('pathology', '').lower():
                results.append({
                    "type": "segment",
                    "organ_id": organ_id,
                    "title": seg['name'],
                    "subtitle": f"{organ['name']} • {seg.get('function', '')[:60]}...",
                    "icon": organ['icon'],
                    "segment_id": seg['id']
                })
    
    return jsonify({"results": results[:16]})

if __name__ == '__main__':
    print("[Bio3D Nexus] Server running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
