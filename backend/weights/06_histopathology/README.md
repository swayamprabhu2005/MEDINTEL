# 📁 Specialized Weights Directory: 8.6 Histopathology Biopsy & Lymph Node Metastasis

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/06_histopathology_colab.ipynb`
- **Primary Public Dataset**: **PatchCamelyon (PCam) / CAMELYON16**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d c/histopathologic-cancer-detection (220,025 96x96 whole-slide biopsy patches) -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/06_histopathology/
  ├── medintel_histopathology.onnx (CPU-optimized ONNX model, ~28 MB)
  ├── medintel_histopathology.pt (PyTorch state dict checkpoint, ~28 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **2 classes**:

- **`Normal_Tissue`**
- **`Metastatic_Tumor_Cells`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM highlighting atypical nuclear pleomorphism, hyperchromasia, and mitotic figures in biopsy tissue.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
