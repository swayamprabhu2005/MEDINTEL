import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, Sparkles, Layers, Sliders, Play, CheckCircle2, 
  AlertTriangle, AlertCircle, Info, ChevronRight, Eye, FileDown
} from 'lucide-react';
import { exportClinicalAuditPDF } from '../utils/pdfExport';

const MODALITIES = [
  { id: 'chest_xray', label: '8.1 Chest X-Ray', icon: '🩻', defaultSymptom: '65-year-old male with persistent cough, mild fever, and shortness of breath.' },
  { id: 'brain_mri', label: '8.2 Brain MRI / CT', icon: '🧠', defaultSymptom: '48-year-old female presenting with chronic morning headaches, nausea, and recent focal seizure.' },
  { id: 'dermatology', label: '8.3 Skin Dermatology', icon: '🔬', defaultSymptom: '55-year-old male with changing pigmented cutaneous lesion on back showing asymmetric borders and color variegation.' },
  { id: 'ophthalmology', label: '8.4 Retinal Ophthalmology', icon: '👁️', defaultSymptom: '60-year-old with type 2 diabetes presenting for annual diabetic retinopathy fundus screening; complains of blurry vision.' },
  { id: 'mammography', label: '8.5 Mammography', icon: '🎀', defaultSymptom: '52-year-old female presenting for routine bilateral screening mammogram; palpable right breast nodule noted on self-exam.' },
  { id: 'histopathology', label: '8.6 Histopathology Biopsy', icon: '🧫', defaultSymptom: 'Lymph node core needle biopsy submitted for evaluation of suspected metastatic carcinoma.' },
  { id: 'kidney_ct', label: '8.7 Kidney CT Scan', icon: '🫘', defaultSymptom: '58-year-old male presenting with intermittent painless macroscopic hematuria and mild right flank discomfort.' },
  { id: 'lung_ct', label: '8.8 Lung CT Scan', icon: '🫁', defaultSymptom: '63-year-old smoker presenting with persistent dry cough, 5kg weight loss, and incidental non-calcified pulmonary nodule.' }
];

export default function MultimodalAnalysis({ onOrchestrateComplete }) {
  const [selectedModality, setSelectedModality] = useState('chest_xray');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activePathology, setActivePathology] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [showHeatmapOnly, setShowHeatmapOnly] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState(MODALITIES[0].defaultSymptom);
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleModalityChange = (modId) => {
    setSelectedModality(modId);
    setAnalysisResult(null);
    setSelectedImage(null);
    setPreviewUrl(null);
    const mod = MODALITIES.find((m) => m.id === modId);
    if (mod) setSymptomsInput(mod.defaultSymptom);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const handleLoadSample = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 256, 256);

    if (selectedModality === 'brain_mri') {
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.ellipse(128, 128, 95, 115, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(118, 128, 12, 35, 0.1, 0, 2 * Math.PI);
      ctx.ellipse(138, 128, 12, 35, -0.1, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(160, 100, 24, 0, 2 * Math.PI);
      ctx.fill();
    } else if (selectedModality === 'dermatology') {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.ellipse(128, 128, 48, 62, 0.4, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(105, 95, 18, 0, 2 * Math.PI);
      ctx.fill();
    } else if (selectedModality === 'ophthalmology') {
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(128, 128, 110, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(80, 128, 22, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#450a0a';
      ctx.beginPath();
      ctx.arc(150, 115, 8, 0, 2 * Math.PI);
      ctx.arc(165, 140, 12, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.ellipse(80, 130, 45, 75, 0, 0, 2 * Math.PI);
      ctx.ellipse(176, 130, 45, 75, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'rgba(240, 240, 240, 0.65)';
      ctx.beginPath();
      ctx.arc(175, 140, 28, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.ellipse(125, 155, 38, 50, 0.2, 0, 2 * Math.PI);
      ctx.fill();
    }

    canvas.toBlob((blob) => {
      const file = new File([blob], `${selectedModality}_sample.png`, { type: 'image/png' });
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }, 'image/png');
  };

  const handleAnalyzeImage = async (targetCls = null) => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
      formData.append('modality', selectedModality);
      if (targetCls) {
        formData.append('target_pathology', targetCls);
      }
      const res = await fetch('/api/v1/vision/analyze', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        if (!targetCls && data.top_finding) {
          setActivePathology(data.top_finding.pathology);
        }
      }
    } catch (err) {
      console.error('Vision analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRunFullOrchestration = async () => {
    setIsOrchestrating(true);
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
      formData.append('symptoms', symptomsInput);
      formData.append('case_domain', selectedModality);
      formData.append('modality', selectedModality);

      const res = await fetch('/api/v1/orchestrate', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        if (onOrchestrateComplete) {
          onOrchestrateComplete(data);
        }
      }
    } catch (err) {
      console.error('Orchestration error:', err);
    } finally {
      setIsOrchestrating(false);
    }
  };

  const handleExportPDF = async () => {
    if (!analysisResult) return;
    setIsExportingPdf(true);
    try {
      const curMod = MODALITIES.find((m) => m.id === selectedModality);
      await exportClinicalAuditPDF({
        caseId: `MEDINTEL-${selectedModality.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        modalityLabel: curMod?.label || '8.1 Chest X-Ray',
        symptoms: symptomsInput,
        originalImageUrl: previewUrl,
        gradcamImageUrl: showHeatmapOnly 
          ? analysisResult?.saliency?.heatmap_base64 
          : (analysisResult?.saliency?.overlay_base64 || analysisResult?.saliency?.original_image_base64),
        analysisResult: analysisResult,
        activePathology: activePathology,
        orchestratedData: null
      });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const currentMod = MODALITIES.find((m) => m.id === selectedModality);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* 8-Modality Selector Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ padding: '0.85rem 1.15rem', background: '#ffffff' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Clinical Modality Lineup (Blueprint Sections 8.1 - 8.8)
          </span>
          <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
            8 Modalities Enabled
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {MODALITIES.map((mod) => {
            const isSel = selectedModality === mod.id;
            return (
              <motion.button
                key={mod.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleModalityChange(mod.id)}
                style={{
                  background: isSel ? '#e0f2fe' : '#f8fafc',
                  color: isSel ? '#0369a1' : '#475569',
                  border: isSel ? '1px solid #7dd3fc' : '1px solid #e2e8f0',
                  boxShadow: isSel ? '0 2px 6px rgba(2, 132, 199, 0.12)' : 'none',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '10px',
                  fontSize: '0.785rem',
                  fontWeight: isSel ? 700 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{mod.icon}</span>
                <span>{mod.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Grid Layout: Left (Image & Grad-CAM) + Right (Pathology Predictions) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '1.5rem' }}>
        
        {/* Left Column: Image Upload & Saliency Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{currentMod.icon}</span>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  1. {currentMod.label} Input Scan
                </h3>
              </div>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleLoadSample} 
                className="btn btn-secondary" 
                style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
              >
                <Sparkles size={13} color="#0284c7" />
                <span>Load Sample Scan</span>
              </motion.button>
            </div>

            {/* Upload Area / Canvas View */}
            <div 
              style={{
                border: '2px dashed #cbd5e1',
                borderRadius: '12px',
                padding: '1.5rem',
                textAlign: 'center',
                background: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => document.getElementById('modality-file-input').click()}
            >
              <input 
                id="modality-file-input" 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              {previewUrl ? (
                <div style={{ position: 'relative', display: 'inline-block', maxHeight: '300px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)' }}>
                  {analysisResult && analysisResult.saliency ? (
                    <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                      <img 
                        src={analysisResult.saliency.original_image_base64} 
                        alt="Original Scan" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} 
                      />
                      <img 
                        src={showHeatmapOnly ? analysisResult.saliency.heatmap_base64 : analysisResult.saliency.overlay_base64} 
                        alt="Grad-CAM Saliency" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain', 
                          position: 'absolute', 
                          top: 0, 
                          left: 0,
                          opacity: showHeatmapOnly ? 1 : overlayOpacity,
                          transition: 'opacity 0.15s ease'
                        }} 
                      />
                    </div>
                  ) : (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain', borderRadius: '10px' }} 
                    />
                  )}
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{currentMod.icon}</p>
                  <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Click to upload {currentMod.label} scan</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>DICOM, PNG, or JPEG</p>
                </div>
              )}
            </div>

            {/* Grad-CAM Controls */}
            {analysisResult && analysisResult.saliency && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: '1rem', background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Layers size={14} color="#0284c7" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0284c7' }}>
                      Grad-CAM Saliency Overlay
                    </span>
                  </div>
                  <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                    Target: <strong>{analysisResult.saliency.target_pathology}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Opacity:</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                    value={overlayOpacity} 
                    onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))} 
                    style={{ flex: 1, accentColor: '#0284c7' }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0284c7', minWidth: '35px' }}>{Math.round(overlayOpacity * 100)}%</span>
                </div>
              </motion.div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <motion.button 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAnalyzeImage(activePathology)} 
                disabled={!selectedImage || isAnalyzing} 
                className="btn btn-primary"
                style={{ flex: 1, padding: '0.65rem 1rem' }}
              >
                {isAnalyzing ? (
                  <>Processing Scan...</>
                ) : (
                  <>⚡ Analyze {currentMod.label.split(' ')[1]} Scan</>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Clinical Context Input */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card"
          >
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.65rem' }}>
              2. Clinical Context & History
            </h3>
            <textarea
              className="textarea"
              rows="3"
              value={symptomsInput}
              onChange={(e) => setSymptomsInput(e.target.value)}
              placeholder="Enter patient clinical background, history, or symptoms..."
            />
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleRunFullOrchestration}
              disabled={isOrchestrating}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '0.85rem', background: 'linear-gradient(135deg, #0d9488, #059669)', boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)' }}
            >
              {isOrchestrating ? (
                <>Orchestrating 5-Agent Consensus...</>
              ) : (
                <>
                  <Play size={14} style={{ display: 'inline', marginRight: '4px' }} />
                  Run Multi-Agent Consensus on {currentMod.label.split(' ')[1]}
                </>
              )}
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Pathology Predictions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card" 
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {currentMod.label} Classification & Saliency
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Calibrated probabilities & Grad-CAM visual hotspots
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {analysisResult && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleExportPDF}
                    disabled={isExportingPdf}
                    className="btn btn-secondary"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.75rem',
                      padding: '0.35rem 0.65rem',
                      color: '#0284c7',
                      borderColor: '#bae6fd',
                      background: '#f0f9ff',
                      fontWeight: 600
                    }}
                  >
                    <FileDown size={14} color="#0284c7" />
                    <span>{isExportingPdf ? 'Exporting...' : 'Export Audit PDF'}</span>
                  </motion.button>
                )}
                {analysisResult && (
                  <span className={`badge ${analysisResult.status === 'ABNORMAL' ? 'badge-high' : 'badge-low'}`}>
                    {analysisResult.status === 'ABNORMAL' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                    {analysisResult.status}
                  </span>
                )}
              </div>
            </div>

            {analysisResult ? (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Engine: <strong>{analysisResult.weights_source}</strong></span>
                  <span>Classes Evaluated: <strong>{analysisResult.findings.length}</strong></span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.35rem' }}>
                  {analysisResult.findings.map((f, i) => {
                    const isSelected = activePathology === f.pathology;
                    const severityBadgeClass = 
                      f.severity === 'Critical' ? 'badge-critical' :
                      f.severity === 'High' ? 'badge-high' :
                      f.severity === 'Moderate' ? 'badge-moderate' : 'badge-low';
                      
                    const barColor = 
                      f.probability > 0.5 ? '#e11d48' :
                      f.probability > 0.3 ? '#d97706' : '#059669';

                    return (
                      <motion.div 
                        key={f.pathology}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        onClick={() => {
                          setActivePathology(f.pathology);
                          handleAnalyzeImage(f.pathology);
                        }}
                        style={{
                          background: isSelected ? '#f0f9ff' : '#ffffff',
                          border: isSelected ? '1px solid #7dd3fc' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '0.75rem 0.95rem',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.1)' : 'var(--shadow-sm)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: isSelected ? '#0284c7' : 'var(--text-primary)' }}>
                              {f.pathology}
                            </span>
                            <span className={`badge ${severityBadgeClass}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem' }}>
                              {f.severity}
                            </span>
                          </div>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: barColor }}>
                            {f.percentage}%
                          </span>
                        </div>

                        <div className="progress-bar-bg">
                          <motion.div 
                            className="progress-bar-fill" 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.max(f.percentage, 3)}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            style={{ background: barColor }} 
                          />
                        </div>

                        {isSelected && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{ marginTop: '0.65rem', fontSize: '0.775rem', color: 'var(--text-secondary)', borderTop: '1px dashed #cbd5e1', paddingTop: '0.5rem' }}
                          >
                            <p style={{ lineHeight: 1.5 }}>{f.description}</p>
                            <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                              <strong>Anatomical regions:</strong> {f.typical_regions.join(', ')}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleExportPDF}
                  disabled={isExportingPdf}
                  className="btn btn-secondary"
                  style={{
                    width: '100%',
                    marginTop: '0.85rem',
                    padding: '0.65rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    color: '#0284c7',
                    borderColor: '#bae6fd',
                    background: '#f0f9ff'
                  }}
                >
                  <FileDown size={16} color="#0284c7" />
                  <span>{isExportingPdf ? 'Generating PDF...' : '1-Click Export Clinical Audit Report (PDF)'}</span>
                </motion.button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{currentMod.icon}</p>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  No {currentMod.label.split(' ')[1]} scan analyzed yet
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                  Select or upload a scan and click "Analyze {currentMod.label.split(' ')[1]} Scan".
                </p>
              </div>
            )}
          </motion.div>
        </div>

      </div>

    </div>
  );
}
