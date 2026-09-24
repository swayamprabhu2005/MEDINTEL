# 🏥 MEDINTEL: Step-by-Step Google Colab Training Guide

This guide explains how to train the Chest X-Ray Computer Vision model on Google Colab's free T4 GPU and import the weights into your local MEDINTEL application.

---

## 📋 What You Need Before You Start
1. A free Google account (for Google Colab).
2. The notebook file located at: `MEDINTEL/notebooks/01_cxr_training_colab.ipynb`.
3. *(Optional)* A Kaggle account if you want to pull the 100k+ NIH dataset:
   - Go to Kaggle > Profile Settings > **Create New Token** (downloads `kaggle.json`).

---

## 🚀 Step-by-Step Training Instructions

### Step 1: Open Google Colab
1. In your web browser, navigate to [colab.research.google.com](https://colab.research.google.com/).
2. In the modal, click **Upload** and select `01_cxr_training_colab.ipynb` from your `MEDINTEL/notebooks/` folder.

### Step 2: Enable Free Cloud GPU
1. In the Colab top menu, click **Runtime** > **Change runtime type**.
2. Under **Hardware accelerator**, select **T4 GPU**.
3. Click **Save**.

### Step 3: Run the Cells
1. In the top menu, click **Runtime** > **Run all** (or press `Ctrl + F9`).
2. The notebook will:
   - Verify GPU access.
   - Install required dependencies (`onnx`, `albumentations`, `scikit-learn`).
   - Load/prepare the chest radiograph dataset for 14 pathology classes.
   - Train the `DenseNet-121` neural network using mixed-precision acceleration.
   - Generate and verify Grad-CAM explainability heatmaps.
   - Export optimized `medintel_cxr.onnx` (~28 MB) and `medintel_cxr_densenet121.pt` (~28 MB).

### Step 4: Export & Download Weights
- At the end of the notebook, Cell 8 will automatically trigger a browser download for:
  - `medintel_cxr.onnx`
  - `medintel_cxr_densenet121.pt`
- If your browser blocks popups, open the Colab left sidebar (folder icon labeled **Files**), find `medintel_cxr.onnx`, right-click and click **Download**.

---

## 📥 Where to Put the Downloaded Files on Your PC
Once downloaded to your computer:
1. Copy or move `medintel_cxr.onnx` and `medintel_cxr_densenet121.pt` into:
   ```
   MEDINTEL/backend/weights/
   ```
2. The local FastAPI backend will automatically detect the real trained weights upon server start and run lightning-fast CPU inference (<20ms, <200MB RAM)!

> [!NOTE]
> Even before you run Colab, the local MEDINTEL application includes high-fidelity synthetic baseline weights, so you can start, test, and use the full frontend dashboard, Grad-CAM viewer, and multi-agent system right away without waiting!
