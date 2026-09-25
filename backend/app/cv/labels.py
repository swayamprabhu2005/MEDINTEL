# ==========================================
# MEDINTEL 8-Modality Clinical Taxonomy
# ==========================================

MODALITIES = {
    "chest_xray": {
        "title": "8.1 Chest X-Ray (CXR)",
        "weights_subdir": "01_chest_xray",
        "onnx_name": "medintel_cxr.onnx",
        "pt_name": "medintel_cxr_densenet121.pt",
        "classes": [
            "Atelectasis", "Cardiomegaly", "Effusion", "Infiltration", "Mass", "Nodule",
            "Pneumonia", "Pneumothorax", "Consolidation", "Edema", "Emphysema", "Fibrosis",
            "Pleural_Thickening", "Hernia"
        ]
    },
    "brain_mri": {
        "title": "8.2 Brain MRI / CT",
        "weights_subdir": "02_brain_mri",
        "onnx_name": "medintel_brain_mri.onnx",
        "pt_name": "medintel_brain_mri.pt",
        "classes": ["Glioma", "Meningioma", "Pituitary_Tumor", "No_Tumor"]
    },
    "dermatology": {
        "title": "8.3 Skin Dermatology",
        "weights_subdir": "03_dermatology",
        "onnx_name": "medintel_skin_derm.onnx",
        "pt_name": "medintel_skin_derm.pt",
        "classes": [
            "Melanoma", "Melanocytic_Nevi", "Basal_Cell_Carcinoma",
            "Actinic_Keratoses", "Benign_Keratosis", "Dermatofibroma", "Vascular_Lesion"
        ]
    },
    "ophthalmology": {
        "title": "8.4 Retinal Ophthalmology",
        "weights_subdir": "04_ophthalmology",
        "onnx_name": "medintel_retinal_eye.onnx",
        "pt_name": "medintel_retinal_eye.pt",
        "classes": ["No_DR", "Mild_DR", "Moderate_DR", "Severe_DR", "Proliferative_DR"]
    },
    "mammography": {
        "title": "8.5 Mammography",
        "weights_subdir": "05_mammography",
        "onnx_name": "medintel_mammography.onnx",
        "pt_name": "medintel_mammography.pt",
        "classes": ["Normal", "Benign_Mass", "Malignant_Mass", "Calcification"]
    },
    "histopathology": {
        "title": "8.6 Histopathology Biopsy",
        "weights_subdir": "06_histopathology",
        "onnx_name": "medintel_histopathology.onnx",
        "pt_name": "medintel_histopathology.pt",
        "classes": ["Normal_Tissue", "Metastatic_Tumor"]
    },
    "kidney_ct": {
        "title": "8.7 Kidney & Abdominal CT",
        "weights_subdir": "07_kidney_ct",
        "onnx_name": "medintel_kidney_ct.onnx",
        "pt_name": "medintel_kidney_ct.pt",
        "classes": ["Normal_Kidney", "Kidney_Cyst", "Kidney_Stone", "Kidney_Tumor"]
    },
    "lung_ct": {
        "title": "8.8 Lung CT Scan",
        "weights_subdir": "08_lung_ct",
        "onnx_name": "medintel_lung_ct.onnx",
        "pt_name": "medintel_lung_ct.pt",
        "classes": ["Adenocarcinoma", "Large_Cell_Carcinoma", "Squamous_Cell_Carcinoma", "Benign_Normal"]
    }
}

# Legacy backwards compatibility alias
PATHOLOGIES = MODALITIES["chest_xray"]["classes"]

PATHOLOGY_DETAILS = {
    # Chest X-Ray
    "Atelectasis": {"description": "Partial or complete collapse of the lung or lobe.", "severity": "Moderate", "typical_regions": ["Lower lobes"]},
    "Cardiomegaly": {"description": "Enlargement of cardiac silhouette (CTR > 0.50).", "severity": "Moderate", "typical_regions": ["Cardiac silhouette"]},
    "Effusion": {"description": "Fluid accumulation in pleural space, blunted costophrenic angle.", "severity": "Moderate", "typical_regions": ["Costophrenic angles"]},
    "Infiltration": {"description": "Ill-defined opacity in lung parenchyma denser than air.", "severity": "Moderate", "typical_regions": ["Mid and lower lung zones"]},
    "Mass": {"description": "Discrete soft-tissue opacity > 30 mm in diameter.", "severity": "Critical", "typical_regions": ["Upper or mid lung parenchyma"]},
    "Nodule": {"description": "Well-defined discrete round or oval opacity <= 30 mm.", "severity": "Moderate", "typical_regions": ["Peripheral lung fields"]},
    "Pneumonia": {"description": "Infectious consolidation or airspace opacification.", "severity": "High", "typical_regions": ["Segmental or lobar opacities"]},
    "Pneumothorax": {"description": "Presence of air in pleural space, absent lung markings.", "severity": "Critical", "typical_regions": ["Apex", "Pleural margin"]},
    "Consolidation": {"description": "Alveolar airspace filled with inflammatory fluid/exudate.", "severity": "High", "typical_regions": ["Lobar distribution"]},
    "Edema": {"description": "Fluid accumulation in pulmonary interstitial/alveolar spaces.", "severity": "High", "typical_regions": ["Perihilar / bat-wing distribution"]},
    "Emphysema": {"description": "Permanent enlargement of airspaces, hyperlucency.", "severity": "Moderate", "typical_regions": ["Apices", "Bilateral fields"]},
    "Fibrosis": {"description": "Interstitial lung scarring, reticular opacities.", "severity": "Moderate", "typical_regions": ["Subpleural / basal"]},
    "Pleural_Thickening": {"description": "Fibrotic scarring and calcification of pleura.", "severity": "Low", "typical_regions": ["Pleural boundaries"]},
    "Hernia": {"description": "Protrusion of abdominal structures into thorax.", "severity": "Moderate", "typical_regions": ["Retrocardiac space"]},

    # Brain MRI / CT
    "Glioma": {"description": "Primary intra-axial brain tumor arising from glial cells.", "severity": "Critical", "typical_regions": ["Cerebral hemispheres", "White matter"]},
    "Meningioma": {"description": "Typically benign extra-axial tumor arising from the meninges.", "severity": "High", "typical_regions": ["Parasagittal", "Convexity", "Sphenoid ridge"]},
    "Pituitary_Tumor": {"description": "Adenoma arising from the pituitary gland within sella turcica.", "severity": "High", "typical_regions": ["Sella turcica", "Suprasellar cistern"]},
    "No_Tumor": {"description": "Normal intracranial anatomy without mass effect or midline shift.", "severity": "Low", "typical_regions": ["Normal parenchyma"]},

    # Dermatology
    "Melanoma": {"description": "Highly aggressive malignancy arising from melanocytes (ABCDE criteria).", "severity": "Critical", "typical_regions": ["Epidermal-dermal junction"]},
    "Melanocytic_Nevi": {"description": "Common benign proliferation of melanocytes (moles).", "severity": "Low", "typical_regions": ["Cutaneous surface"]},
    "Basal_Cell_Carcinoma": {"description": "Most common non-melanoma skin cancer with pearly telangiectatic borders.", "severity": "High", "typical_regions": ["Sun-exposed head/neck"]},
    "Actinic_Keratoses": {"description": "Pre-malignant scaly macule/papule induced by UV radiation.", "severity": "Moderate", "typical_regions": ["Scalp, face, forearms"]},
    "Benign_Keratosis": {"description": "Seborrheic keratosis with stuck-on warty appearance.", "severity": "Low", "typical_regions": ["Trunk, face"]},
    "Dermatofibroma": {"description": "Benign fibrous histiocytoma exhibiting dimple sign upon lateral compression.", "severity": "Low", "typical_regions": ["Lower extremities"]},
    "Vascular_Lesion": {"description": "Angioma, pyogenic granuloma, or vascular malformation.", "severity": "Low", "typical_regions": ["Cutaneous vessels"]},

    # Ophthalmology
    "No_DR": {"description": "Normal fundus examination without retinal microvascular lesions.", "severity": "Low", "typical_regions": ["Macula, optic disc"]},
    "Mild_DR": {"description": "Presence of microaneurysms only in retinal fundus.", "severity": "Low", "typical_regions": ["Perimacular region"]},
    "Moderate_DR": {"description": "Microaneurysms, dot-and-blot hemorrhages, hard exudates.", "severity": "Moderate", "typical_regions": ["Posterior pole"]},
    "Severe_DR": {"description": "Severe intraretinal hemorrhages (4-2-1 rule), venous beading.", "severity": "High", "typical_regions": ["All four retinal quadrants"]},
    "Proliferative_DR": {"description": "Neovascularization of disc/retina with vitreous hemorrhage risk.", "severity": "Critical", "typical_regions": ["Optic disc, arcade vessels"]},

    # Mammography
    "Normal": {"description": "Symmetric fibroglandular density without dominant masses or calcifications.", "severity": "Low", "typical_regions": ["Bilateral breasts"]},
    "Benign_Mass": {"description": "Well-circumscribed radiopaque mass (e.g. fibroadenoma or simple cyst).", "severity": "Low", "typical_regions": ["Upper outer quadrant"]},
    "Malignant_Mass": {"description": "Spiculated, ill-defined radiodense lesion suspicious for carcinoma.", "severity": "Critical", "typical_regions": ["Parenchymal breast tissue"]},
    "Calcification": {"description": "Clustered pleomorphic microcalcifications requiring magnification view.", "severity": "High", "typical_regions": ["Ductal distribution"]},

    # Histopathology
    "Normal_Tissue": {"description": "Organized histological architecture without neoplastic cellular atypia.", "severity": "Low", "typical_regions": ["Lymph node architecture"]},
    "Metastatic_Tumor": {"description": "Malignant epithelial metastasis within lymphoid stroma.", "severity": "Critical", "typical_regions": ["Subcapsular sinuses / cortex"]},

    # Kidney CT
    "Normal_Kidney": {"description": "Homogeneous nephrogram phase without focal mass or calculus.", "severity": "Low", "typical_regions": ["Renal parenchyma"]},
    "Kidney_Cyst": {"description": "Well-defined fluid attenuation lesion with imperceptible wall (Bosniak I).", "severity": "Low", "typical_regions": ["Cortical margin"]},
    "Kidney_Stone": {"description": "Hyperdense calculus within renal collecting system or ureter.", "severity": "Moderate", "typical_regions": ["Renal pelvis, calyces"]},
    "Kidney_Tumor": {"description": "Heterogeneously enhancing solid renal mass (suspicious for RCC).", "severity": "Critical", "typical_regions": ["Exophytic renal cortex"]},

    # Lung CT
    "Adenocarcinoma": {"description": "Peripheral subsolid or solid pulmonary mass with ground-glass halos.", "severity": "Critical", "typical_regions": ["Peripheral lung parenchyma"]},
    "Large_Cell_Carcinoma": {"description": "Large necrotic pulmonary mass typically > 4 cm with aggressive invasion.", "severity": "Critical", "typical_regions": ["Central and mid zones"]},
    "Squamous_Cell_Carcinoma": {"description": "Centrally located endobronchial mass with cavitation.", "severity": "Critical", "typical_regions": ["Hilar / proximal bronchi"]},
    "Benign_Normal": {"description": "Clear lung parenchyma without suspicious nodule or lymphadenopathy.", "severity": "Low", "typical_regions": ["Bronchovascular bundles"]}
}
