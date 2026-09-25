# 📁 Specialized Weights Directory: 8.8 Lung CT Scan Nodule & Carcinoma Classifier

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/08_lung_ct_colab.ipynb`
- **Primary Public Dataset**: **LIDC-IDRI / Chest CT Scan Carcinoma Collection**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d mohamedhanyyy/chest-ctscan-images -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/08_lung_ct/
  ├── medintel_lung_ct.onnx (CPU-optimized ONNX model, ~28 MB)
  ├── medintel_lung_ct.pt (PyTorch state dict checkpoint, ~28 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **4 classes**:

- **`Adenocarcinoma`**
- **`Large_Cell_Carcinoma`**
- **`Squamous_Cell_Carcinoma`**
- **`Benign_Normal`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM targeting spicular borders, ground-glass opacities, and solitary pulmonary nodules.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
