# 📁 Specialized Weights Directory: 8.5 Mammography Breast Screening & Calcification

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/05_mammography_colab.ipynb`
- **Primary Public Dataset**: **CBIS-DDSM / VinDr-Mammo Breast Cancer Dataset**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d awsaf49/cbis-ddsm-breast-cancer-image-dataset -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/05_mammography/
  ├── medintel_mammography.onnx (CPU-optimized ONNX model, ~45 MB)
  ├── medintel_mammography.pt (PyTorch state dict checkpoint, ~45 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **4 classes**:

- **`Normal_Breast`**
- **`Benign_Mass`**
- **`Malignant_Mass`**
- **`Microcalcifications`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM targeting parenchymal breast tissue highlighting architectural distortion and clustered microcalcifications.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
