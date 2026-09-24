import React, { useState } from 'react';

export default function MultimodalAnalysis({ onOrchestrateComplete }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activePathology, setActivePathology] = useState(null);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [showHeatmapOnly, setShowHeatmapOnly] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState('65-year-old male with persistent cough, mild fever, and shortness of breath.');
  const [isOrchestrating, setIsOrchestrating] = useState(false);

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  // Generate synthetic sample radiograph for immediate instant testing
  const handleLoadSample = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Draw thoracic cavity simulation
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 256, 256);
    
    // Lungs
    ctx.fillStyle = '#222222';
    ctx.beginPath();
    ctx.ellipse(80, 130, 45, 75, 0, 0, 2 * Math.PI);
    ctx.ellipse(176, 130, 45, 75, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Infiltration opacity
    ctx.fillStyle = 'rgba(150, 150, 150, 0.45)';
    ctx.beginPath();
    ctx.arc(175, 140, 28, 0, 2 * Math.PI);
    ctx.fill();

    // Cardiac silhouette
    ctx.fillStyle = '#444444';
    ctx.beginPath();
    ctx.ellipse(125, 155, 38, 50, 0.2, 0, 2 * Math.PI);
    ctx.fill();

    canvas.toBlob((blob) => {
      const file = new File([blob], 'synthetic_sample_cxr.png', { type: 'image/png' });
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult(null);
    }, 'image/png');
  };

  // Run Vision Inference
  const handleAnalyzeImage = async (targetCls = null) => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedImage);
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

  // Run Full Multi-Agent Orchestration
  const handleRunFullOrchestration = async () => {
    setIsOrchestrating(true);
    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('file', selectedImage);
      }
      formData.append('symptoms', symptomsInput);
      formData.append('case_domain', 'chest_radiology');

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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '1.5rem', marginTop: '1rem' }}>
      
      {/* Left Column: Image Upload & Grad-CAM Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              1. Chest Radiograph (CXR) Input
            </h3>
            <button onClick={handleLoadSample} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
              ✨ Load Sample CXR
            </button>
          </div>

          <div 
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer'
            }}
            onClick={() => document.getElementById('cxr-file-input').click()}
          >
            <input 
              id="cxr-file-input" 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
            {previewUrl ? (
              <div style={{ position: 'relative', display: 'inline-block', maxHeight: '320px', borderRadius: '8px', overflow: 'hidden' }}>
                {analysisResult && analysisResult.saliency ? (
                  <div style={{ position: 'relative', width: '280px', height: '280px' }}>
                    {/* Base Image */}
                    <img 
                      src={analysisResult.saliency.original_image_base64} 
                      alt="Original CXR" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'absolute', top: 0, left: 0 }} 
                    />
                    {/* Grad-CAM Saliency Overlay */}
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
                    style={{ maxHeight: '280px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px' }} 
                  />
                )}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🩻</p>
                <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Click to upload Chest X-ray (DICOM / PNG / JPEG)</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>or drag and drop file here</p>
              </div>
            )}
          </div>

          {/* Grad-CAM Interactive Controls */}
          {analysisResult && analysisResult.saliency && (
            <div style={{ marginTop: '1rem', background: 'rgba(15, 23, 42, 0.6)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#38bdf8' }}>
                  🔥 Grad-CAM Overlay Saliency
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Target: <strong>{analysisResult.saliency.target_pathology}</strong>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Opacity:</span>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.05" 
                  value={overlayOpacity} 
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))} 
                  style={{ flex: 1, accentColor: '#0ea5e9' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', minWidth: '35px' }}>{Math.round(overlayOpacity * 100)}%</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              onClick={() => handleAnalyzeImage(activePathology)} 
              disabled={!selectedImage || isAnalyzing} 
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {isAnalyzing ? 'Analyzing Image...' : '⚡ Analyze CXR Pathology'}
            </button>
          </div>
        </div>

        {/* Symptoms & Context Input */}
        <div className="card">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
            2. Clinical History & Symptoms
          </h3>
          <textarea
            className="textarea"
            rows="3"
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
            placeholder="Enter patient symptoms, vitals, or clinical indications..."
          />
          <button
            onClick={handleRunFullOrchestration}
            disabled={isOrchestrating}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.85rem', background: 'linear-gradient(135deg, #10b981, #059669)' }}
          >
            {isOrchestrating ? 'Running 5-Agent Consensus...' : '🚀 Execute Full Multi-Agent Clinical Case'}
          </button>
        </div>

      </div>

      {/* Right Column: Pathology Predictions & Explainability */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="card" style={{ height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>
              Pathology Classification & Uncertainty
            </h3>
            {analysisResult && (
              <span className={`badge ${analysisResult.status === 'ABNORMAL' ? 'badge-high' : 'badge-low'}`}>
                {analysisResult.status}
              </span>
            )}
          </div>

          {analysisResult ? (
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Model: {analysisResult.weights_source}</span>
                <span>Detected: {analysisResult.detected_count} / 14</span>
              </div>

              {/* Pathology Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '520px', overflowY: 'auto', paddingRight: '0.35rem' }}>
                {analysisResult.findings.map((f) => {
                  const isSelected = activePathology === f.pathology;
                  const severityBadgeClass = 
                    f.severity === 'Critical' ? 'badge-critical' :
                    f.severity === 'High' ? 'badge-high' :
                    f.severity === 'Moderate' ? 'badge-moderate' : 'badge-low';
                    
                  const barColor = 
                    f.probability > 0.5 ? '#f43f5e' :
                    f.probability > 0.3 ? '#f59e0b' : '#10b981';

                  return (
                    <div 
                      key={f.pathology}
                      onClick={() => {
                        setActivePathology(f.pathology);
                        handleAnalyzeImage(f.pathology);
                      }}
                      style={{
                        background: isSelected ? 'rgba(14, 165, 233, 0.15)' : 'rgba(15, 23, 42, 0.5)',
                        border: isSelected ? '1px solid rgba(14, 165, 233, 0.5)' : '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '0.65rem 0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                            {f.pathology}
                          </span>
                          <span className={`badge ${severityBadgeClass}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                            {f.severity}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: barColor }}>
                          {f.percentage}%
                        </span>
                      </div>

                      <div className="progress-bar-bg">
                        <div 
                          className="progress-bar-fill" 
                          style={{ width: `${Math.max(f.percentage, 3)}%`, background: barColor }} 
                        />
                      </div>

                      {isSelected && (
                        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px dashed rgba(51, 65, 85, 0.6)', paddingTop: '0.4rem' }}>
                          <p>{f.description}</p>
                          <p style={{ marginTop: '0.2rem', color: 'var(--text-muted)' }}>Typical regions: {f.typical_regions.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📊</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No image analyzed yet</p>
              <p style={{ fontSize: '0.75rem', marginTop: '0.35rem' }}>Upload or select a chest X-ray and click "Analyze CXR Pathology".</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
