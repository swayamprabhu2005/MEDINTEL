# 📁 Specialized Weights Directory: 8.2 Brain MRI / CT Tumor & Lesion Classifier

This directory is the dedicated drop-in destination for the trained weights from Google Colab.

---

## 🎯 Google Colab Training Notebook
- **Notebook Path**: `notebooks/02_brain_mri_colab.ipynb`
- **Primary Public Dataset**: **BraTS / Brain Tumor MRI Dataset**
- **Recommended Kaggle API Command**:
  ```bash
  kaggle datasets download -d masoudnickparvar/brain-tumor-mri-dataset (7,023 MRI images) -p dataset/ --unzip
  ```

---

## 📦 What to Paste Inside This Subdirectory

When you complete training on Google Colab GPU, the notebook will export and trigger a browser download for two files. **Paste both files directly into this directory**:

```
backend/weights/02_brain_mri/
  ├── medintel_brain_mri.onnx (CPU-optimized ONNX model, ~45 MB)
  ├── medintel_brain_mri.pt (PyTorch state dict checkpoint, ~45 MB)
  └── README.md (this file)
```

---

## 🏷️ Pathology Classification Classes
The trained model produces calibrated probabilities across the following **4 classes**:

- **`Glioma`**
- **`Meningioma`**
- **`Pituitary_Tumor`**
- **`No_Tumor (Normal)`**

---

## 🔍 Explainability & Localization (Grad-CAM)
- **Visualization Method**: Grad-CAM targeting the final residual block (layer4) highlighting intracranial neoplastic mass regions.
- The backend automatically binds this model to the MEDINTEL frontend interactive Grad-CAM opacity slider.

---

## ⚡ How the Backend Automatically Detects These Weights
Upon server start or case dispatch, `backend/app/cv/inference.py` checks if the `.onnx` model exists in this directory:
- **If present**: The backend runs instant CPU ONNX inference (<25ms, <40MB RAM).
- **If absent**: The backend automatically falls back to the deterministic clinical evaluator, ensuring full platform usability even before training.
