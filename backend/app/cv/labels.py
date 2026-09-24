PATHOLOGIES = [
    "Atelectasis",
    "Cardiomegaly",
    "Effusion",
    "Infiltration",
    "Mass",
    "Nodule",
    "Pneumonia",
    "Pneumothorax",
    "Consolidation",
    "Edema",
    "Emphysema",
    "Fibrosis",
    "Pleural_Thickening",
    "Hernia"
]

PATHOLOGY_DETAILS = {
    "Atelectasis": {
        "description": "Partial or complete collapse of the lung or lobe, leading to reduced gas exchange.",
        "severity": "Moderate",
        "typical_regions": ["Lower lobes", "Lung bases"]
    },
    "Cardiomegaly": {
        "description": "Enlargement of the cardiac silhouette (cardiothoracic ratio > 0.50 on PA view).",
        "severity": "Moderate",
        "typical_regions": ["Cardiac silhouette", "Left ventricular border"]
    },
    "Effusion": {
        "description": "Fluid accumulation in the pleural space, often blunting the costophrenic angles.",
        "severity": "Moderate",
        "typical_regions": ["Costophrenic angles", "Pleural base"]
    },
    "Infiltration": {
        "description": "Ill-defined opacity indicating substance denser than air (pus, blood, protein) in lung parenchyma.",
        "severity": "Moderate",
        "typical_regions": ["Mid and lower lung zones"]
    },
    "Mass": {
        "description": "Discrete soft-tissue opacity > 30 mm in diameter, suspicious for malignancy or abscess.",
        "severity": "Critical",
        "typical_regions": ["Upper or mid lung parenchyma"]
    },
    "Nodule": {
        "description": "Well-defined discrete round or oval parenchymal opacity <= 30 mm in diameter.",
        "severity": "Moderate",
        "typical_regions": ["Peripheral lung fields"]
    },
    "Pneumonia": {
        "description": "Infectious consolidation or airspace opacification with air bronchograms.",
        "severity": "High",
        "typical_regions": ["Segmental or lobar opacities"]
    },
    "Pneumothorax": {
        "description": "Presence of air in the pleural space, characterized by a visible visceral pleural line and absent lung markings.",
        "severity": "Critical",
        "typical_regions": ["Apex", "Pleural margin", "Hemithorax"]
    },
    "Consolidation": {
        "description": "Alveolar airspace filled with fluid, cellular debris or exudate rather than gas.",
        "severity": "High",
        "typical_regions": ["Lobar distribution"]
    },
    "Edema": {
        "description": "Accumulation of fluid in pulmonary interstitial and alveolar spaces (vascular congestion, Kerley B lines).",
        "severity": "High",
        "typical_regions": ["Perihilar / bat-wing distribution"]
    },
    "Emphysema": {
        "description": "Permanent enlargement of airspaces distal to terminal bronchioles; hyperlucency and flattened diaphragms.",
        "severity": "Moderate",
        "typical_regions": ["Apices", "Bilateral lung fields"]
    },
    "Fibrosis": {
        "description": "Interstitial lung scarring, reticular opacities, traction bronchiectasis, and volume loss.",
        "severity": "Moderate",
        "typical_regions": ["Subpleural and basal predominance"]
    },
    "Pleural_Thickening": {
        "description": "Fibrotic scarring and calcification of the pleura, often apical caps or blunted sulci.",
        "severity": "Low",
        "typical_regions": ["Pleural boundaries", "Apical caps"]
    },
    "Hernia": {
        "description": "Protrusion of abdominal structures into the thoracic cavity (e.g., hiatal or diaphragmatic).",
        "severity": "Moderate",
        "typical_regions": ["Retrocardiac / diaphragmatic hiatus"]
    }
}
