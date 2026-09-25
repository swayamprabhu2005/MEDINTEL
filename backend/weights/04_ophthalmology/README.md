# 📁 Specialized Weights Directory: 8.4 Retinal Ophthalmology & Diabetic Retinopathy

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/04_retinal_ophthalmology_colab.ipynb`
- **Primary Public Dataset**: **APTOS 2019 Blindness Detection / EyePACS**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d c/aptos2019-blindness-detection (3,662 high-resolution fundus images) -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/04_ophthalmology/
  ├── medintel_retinal_eye.onnx (CPU-optimized ONNX model, ~45 MB)
  ├── medintel_retinal_eye.pt (PyTorch state dict checkpoint, ~45 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **5 classes**:

- **`0 - No DR (Normal)`**
- **`1 - Mild (Microaneurysms)`**
- **`2 - Moderate (Hemorrhages/Exudates)`**
- **`3 - Severe (Venous beading)`**
- **`4 - Proliferative DR (Neovascularization)`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM targeting macular and peripapillary retinal exudate and microvascular lesion zones.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
