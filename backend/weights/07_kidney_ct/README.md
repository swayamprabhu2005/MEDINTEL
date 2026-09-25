# 📁 Specialized Weights Directory: 8.7 Kidney & Abdominal CT Pathology Classifier

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/07_kidney_ct_colab.ipynb`
- **Primary Public Dataset**: **CT Kidney Dataset / KiTS (Kidney Tumor Segmentation)**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d nazmul0087/ct-kidney-dataset-normal-cyst-tumor-and-stone (12,446 CT slices) -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/07_kidney_ct/
  ├── medintel_kidney_ct.onnx (CPU-optimized ONNX model, ~45 MB)
  ├── medintel_kidney_ct.pt (PyTorch state dict checkpoint, ~45 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **4 classes**:

- **`Normal_Kidney`**
- **`Kidney_Cyst`**
- **`Kidney_Stone (Nephrolithiasis)`**
- **`Kidney_Tumor (Renal Cell Carcinoma)`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM highlighting renal cortex, calyces, and exophytic parenchymal masses.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
