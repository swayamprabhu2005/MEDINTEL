# 🏥 MEDINTEL: Master Google Colab GPU Training Guide (All 8 Modalities)

This master guide explains how to train any of the **8 Clinical Imaging Modalities** (Sections 8.1 to 8.8) using Google Colab's free cloud T4 GPU and import the weights into your local MEDINTEL application.

---

## 📋 Available Colab Notebooks

| Section | Modality | Notebook File | Output Weights | Destination Folder |
|---|---|---|---|---|
| **8.1** | Chest X-Ray | [`01_cxr_training_colab.ipynb`](01_cxr_training_colab.ipynb) | `medintel_cxr.onnx`, `medintel_cxr_densenet121.pt` | `backend/weights/01_chest_xray/` |
| **8.2** | Brain MRI / CT | [`02_brain_mri_colab.ipynb`](02_brain_mri_colab.ipynb) | `medintel_brain_mri.onnx`, `medintel_brain_mri.pt` | `backend/weights/02_brain_mri/` |
| **8.3** | Skin Dermatology | [`03_skin_dermatology_colab.ipynb`](03_skin_dermatology_colab.ipynb) | `medintel_skin_derm.onnx`, `medintel_skin_derm.pt` | `backend/weights/03_dermatology/` |
| **8.4** | Retinal Ophthalmology | [`04_retinal_ophthalmology_colab.ipynb`](04_retinal_ophthalmology_colab.ipynb) | `medintel_retinal_eye.onnx`, `medintel_retinal_eye.pt` | `backend/weights/04_ophthalmology/` |
| **8.5** | Mammography | [`05_mammography_colab.ipynb`](05_mammography_colab.ipynb) | `medintel_mammography.onnx`, `medintel_mammography.pt` | `backend/weights/05_mammography/` |
| **8.6** | Histopathology | [`06_histopathology_colab.ipynb`](06_histopathology_colab.ipynb) | `medintel_histopathology.onnx`, `medintel_histopathology.pt` | `backend/weights/06_histopathology/` |
| **8.7** | Kidney CT | [`07_kidney_ct_colab.ipynb`](07_kidney_ct_colab.ipynb) | `medintel_kidney_ct.onnx`, `medintel_kidney_ct.pt` | `backend/weights/07_kidney_ct/` |
| **8.8** | Lung CT | [`08_lung_ct_colab.ipynb`](08_lung_ct_colab.ipynb) | `medintel_lung_ct.onnx`, `medintel_lung_ct.pt` | `backend/weights/08_lung_ct/` |

---

## 🚀 Execution Steps (For Any Notebook)

### Step 1: Open Google Colab
1. In your browser, navigate to [colab.research.google.com](https://colab.research.google.com/).
2. Click **Upload** and pick the notebook you want to train (e.g. `02_brain_mri_colab.ipynb`).

### Step 2: Enable Free GPU
1. In the top menu, go to **Runtime > Change runtime type**.
2. Under **Hardware accelerator**, select **T4 GPU**.
3. Click **Save**.

### Step 3: Run All Cells
1. Press `Ctrl + F9` (or click **Runtime > Run all**).
2. The notebook will:
   - Check GPU acceleration.
   - Stream the official public dataset directly to Colab disk via Kaggle API (or generate the automated fallback sample dataset).
   - Train the PyTorch neural network with mixed precision.
   - Generate Grad-CAM heatmaps.
   - Export optimized CPU `.onnx` and `.pt` weights.
   - Trigger an automatic browser download.

### Step 4: Drop the Files in the Corresponding Subdirectory
Once downloaded to your computer:
1. Open the corresponding subdirectory inside `backend/weights/` (e.g., `backend/weights/02_brain_mri/`).
2. Move the downloaded `.onnx` and `.pt` files there.
3. Each subdirectory contains a `README.md` that confirms the exact file names expected!

---

## ⚡ Instant Fallback Mode
You do **not** need to wait for model training to test the MEDINTEL platform. The local backend has built-in calibrated clinical evaluators for all 8 modalities, so the entire frontend, Grad-CAM viewer, and multi-agent network work right out of the box!
