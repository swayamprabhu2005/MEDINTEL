# 📚 MEDINTEL Dataset Catalog & Direct Kaggle Porting Guide

This document lists the curated, benchmark datasets for all 8 clinical imaging modalities specified in **Section 8.1 to 8.8** of the MEDINTEL Blueprint.

> **Zero Local Disk Strain**: You do **not** need to download these datasets to your computer. Each Google Colab notebook includes one-line commands that fetch the data directly into Colab's cloud disk via the Kaggle API.

---

## 🗂️ Modality & Dataset Reference Matrix

| Section | Modality | Colab Notebook | Recommended Benchmark Dataset | Kaggle API Direct Command | Classes | Model Backbone | Destination Subdirectory |
|---|---|---|---|---|---|---|---|
| **8.1** | **Chest X-Ray** | `01_cxr_training_colab.ipynb` | NIH ChestX-ray14 / CheXpert | `kaggle datasets download -d nih-chest-xrays/data -p dataset/ --unzip` | 14 Pathologies | DenseNet-121 | `backend/weights/01_chest_xray/` |
| **8.2** | **Brain MRI / CT** | `02_brain_mri_colab.ipynb` | BraTS / Brain Tumor MRI | `kaggle datasets download -d masoudnickparvar/brain-tumor-mri-dataset -p dataset/ --unzip` | 4 Classes | ResNet-50 | `backend/weights/02_brain_mri/` |
| **8.3** | **Skin Dermatology** | `03_skin_dermatology_colab.ipynb` | HAM10000 (ISIC Archive) | `kaggle datasets download -d kmader/skin-cancer-mnist-ham10000 -p dataset/ --unzip` | 7 Lesions | ResNet-34 | `backend/weights/03_dermatology/` |
| **8.4** | **Retinal Ophthalmology** | `04_retinal_ophthalmology_colab.ipynb` | APTOS 2019 / EyePACS | `kaggle competitions download -c aptos2019-blindness-detection -p dataset/` | 5 Grades (0-4) | ResNet-50 | `backend/weights/04_ophthalmology/` |
| **8.5** | **Mammography** | `05_mammography_colab.ipynb` | CBIS-DDSM / VinDr-Mammo | `kaggle datasets download -d awsaf49/cbis-ddsm-breast-cancer-image-dataset -p dataset/ --unzip` | 4 Classes | ResNet-50 | `backend/weights/05_mammography/` |
| **8.6** | **Histopathology** | `06_histopathology_colab.ipynb` | PatchCamelyon (PCam) | `kaggle competitions download -c histopathologic-cancer-detection -p dataset/` | 2 Classes (Tumor/Normal) | DenseNet-121 | `backend/weights/06_histopathology/` |
| **8.7** | **Kidney CT** | `07_kidney_ct_colab.ipynb` | CT Kidney Dataset / KiTS | `kaggle datasets download -d nazmul0087/ct-kidney-dataset-normal-cyst-tumor-and-stone -p dataset/ --unzip` | 4 Classes | ResNet-50 | `backend/weights/07_kidney_ct/` |
| **8.8** | **Lung CT** | `08_lung_ct_colab.ipynb` | LIDC-IDRI / Chest CT Scan | `kaggle datasets download -d mohamedhanyyy/chest-ctscan-images -p dataset/ --unzip` | 4 Classes | DenseNet-121 | `backend/weights/08_lung_ct/` |

---

## 🔑 How to Setup Kaggle in Google Colab (One-Time, 2 Minutes)
1. Go to your [Kaggle Account Settings](https://www.kaggle.com/settings).
2. Scroll to the **API** section and click **Create New Token**.
3. This downloads a file named `kaggle.json`.
4. In Google Colab, upload `kaggle.json` using the file upload button on the left sidebar, or paste this in a cell:
   ```python
   !mkdir -p ~/.kaggle
   !cp kaggle.json ~/.kaggle/
   !chmod 600 ~/.kaggle/kaggle.json
   ```
5. Once configured, running the notebook will stream the dataset directly into Google Colab's cloud storage at 50-100 MB/s!

---

## ⚡ Instant Verification Mode (Without Kaggle)
Every notebook has a built-in automated synthetic generator. If you run the notebook without a `kaggle.json`, it automatically generates a structured prototype dataset and completes:
1. Data loading and augmentation
2. GPU mixed-precision training loop
3. Grad-CAM saliency extraction
4. ONNX and PyTorch weight export and download

This guarantees you can test and verify all 8 notebooks immediately!
