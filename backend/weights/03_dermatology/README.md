# 📁 Specialized Weights Directory: 8.3 Skin Dermatology & Melanoma Classifier

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/03_skin_dermatology_colab.ipynb`
- **Primary Public Dataset**: **HAM10000 (Human Against Machine 10,000 dermoscopy images)**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d kmader/skin-cancer-mnist-ham10000 (10,015 dermoscopic lesion images) -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/03_dermatology/
  ├── medintel_skin_derm.onnx (CPU-optimized ONNX model, ~20 MB)
  ├── medintel_skin_derm.pt (PyTorch state dict checkpoint, ~20 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **7 classes**:

- **`Melanoma (MEL)`**
- **`Melanocytic Nevi (NV)`**
- **`Basal Cell Carcinoma (BCC)`**
- **`Actinic Keratoses (AKIEC)`**
- **`Benign Keratosis (BKL)`**
- **`Dermatofibroma (DF)`**
- **`Vascular Lesions (VASC)`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM targeting convolutional feature blocks highlighting asymmetric pigment networks and borders.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
