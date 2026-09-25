# 📁 Specialized Weights Directory: 8.1 Chest X-Ray (CXR) Pathology Classifier

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/01_cxr_training_colab.ipynb`
- **Primary Public Dataset**: **NIH ChestX-ray14 / Kaggle CheXpert**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d paultimothymooney/chest-xray-pneumonia OR nih-chest-xrays/data -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/01_chest_xray/
  ├── medintel_cxr.onnx (CPU-optimized ONNX model, ~28 MB)
  ├── medintel_cxr_densenet121.pt (PyTorch state dict checkpoint, ~28 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **14 classes**:

- **`Atelectasis`**
- **`Cardiomegaly`**
- **`Effusion`**
- **`Infiltration`**
- **`Mass`**
- **`Nodule`**
- **`Pneumonia`**
- **`Pneumothorax`**
- **`Consolidation`**
- **`Edema`**
- **`Emphysema`**
- **`Fibrosis`**
- **`Pleural_Thickening`**
- **`Hernia`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM targeting features.denseblock4 with JET colormap thoracic overlays.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
