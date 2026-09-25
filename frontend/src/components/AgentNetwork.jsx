import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, ShieldCheck, Clock, CheckCircle2, AlertTriangle, Scan, FileText, Search, Sparkles, ShieldAlert, FileDown } from 'lucide-react';
import { exportClinicalAuditPDF } from '../utils/pdfExport';

export default function AgentNetwork({ orchestratedData }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const traces = orchestratedData?.agent_traces || [
    {
      agent: 'Vision Analyst Agent',
      model_used: 'microsoft/phi-3-vision-128k-instruct',
      latency_ms: 120,
      output: 'Radiographic examination demonstrates focal bibasilar opacification. Cardiac silhouette within normal limits. Grad-CAM saliency confirms elevated localized density in the lower right thoracic field.'
    },
    {
      agent: 'Clinical Context Agent',
      model_used: 'meta/llama-3.1-70b-instruct',
      latency_ms: 95,
      output: 'Patient exhibits acute subacute presentation (fever, dyspnea) lasting 4 days. Documented medical history indicates no prior recurrent aspiration or severe immunocompromise.'
    },
    {
      agent: 'Evidence Researcher Agent',
      model_used: 'mistralai/mixtral-8x22b-instruct',
      latency_ms: 210,
      output: 'Cross-referenced ATS/IDSA Community-Acquired Pneumonia (CAP) 2019 guidelines (PMID 31580790). First-line outpatient recommendations: Amoxicillin or Doxycycline.'
    },
    {
      agent: 'Reasoning & Synthesis Agent',
      model_used: 'meta/llama-3.1-70b-instruct',
      latency_ms: 140,
      output: 'Multimodal impression: Findings are clinically most consistent with acute uncomplicated community-acquired pneumonia. Low probability of pulmonary edema given normal cardiac silhouette.'
    },
    {
      agent: 'Skeptic / Verifier Agent',
      model_used: 'meta/llama-3.1-70b-instruct',
      latency_ms: 88,
      verification_status: 'VERIFIED',
      confidence_score: 0.96,
      output: 'Verification audit: All diagnostic claims correlate with Computer Vision findings and cited ATS/IDSA guidelines. No contradictions or unsupported statements detected. Hallucination score: 0.00.'
    }
  ];

  const verification = orchestratedData?.verification || {
    status: 'VERIFIED',
    confidence: 0.96,
    audit_notes: 'Verified consensus across Vision, Clinical Context, and PubMed literature.'
  };

  const stepIcons = [Scan, FileText, Search, Sparkles, ShieldAlert];

  const handleExportPDF = async () => {
    setIsExportingPdf(true);
    try {
      await exportClinicalAuditPDF({
        caseId: orchestratedData?.case_id || `MEDINTEL-AUDIT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        modalityLabel: orchestratedData?.modality ? orchestratedData.modality.replace('_', ' ').toUpperCase() : '8.1 Chest X-Ray',
        symptoms: orchestratedData?.patient_symptoms || 'Patient presented with acute clinical indication.',
        originalImageUrl: orchestratedData?.saliency_heatmap?.original_image_base64 || orchestratedData?.vision_analysis?.saliency?.original_image_base64 || null,
        gradcamImageUrl: orchestratedData?.saliency_heatmap?.overlay_base64 || orchestratedData?.vision_analysis?.saliency?.overlay_base64 || null,
        analysisResult: orchestratedData?.vision_analysis,
        activePathology: orchestratedData?.vision_analysis?.top_finding?.pathology || 'Primary Pathology',
        orchestratedData: orchestratedData
      });
    } catch (err) {
      console.error('PDF export failed:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner: Verification Badge & Latency */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card" 
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', flexWrap: 'wrap', gap: '0.75rem' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={20} color="#0284c7" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Multi-Agent Verification Network
                </h3>
                <span className={`badge ${verification.status === 'VERIFIED' ? 'badge-verified' : 'badge-moderate'}`}>
                  <ShieldCheck size={13} /> {verification.status} ({(verification.confidence * 100).toFixed(0)}% Confidence)
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Heterogeneous NVIDIA NIM Models coordinating specialist roles with adversarial verification
              </p>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleExportPDF}
            disabled={isExportingPdf}
            className="btn btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.9rem',
              fontSize: '0.785rem',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)'
            }}
          >
            <FileDown size={15} />
            <span>{isExportingPdf ? 'Exporting...' : 'Export Audit PDF'}</span>
          </motion.button>

          <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.45rem 0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <Clock size={16} color="#0284c7" />
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Pipeline Latency</span>
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                {orchestratedData?.total_latency_ms || 653} ms
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Step Sequence Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
        {traces.map((trace, idx) => {
          const isSelected = activeStep === idx;
          const StepIcon = stepIcons[idx] || Bot;

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveStep(idx)}
              style={{
                background: isSelected ? '#f0f9ff' : '#ffffff',
                border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem',
                boxShadow: isSelected ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: isSelected ? '#e0f2fe' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StepIcon size={16} color={isSelected ? '#0284c7' : '#64748b'} />
                </div>
                <span style={{ fontSize: '0.675rem', fontWeight: 700, color: 'var(--text-muted)' }}>Step {idx + 1}</span>
              </div>
              <h4 style={{ fontSize: '0.825rem', fontWeight: 700, color: isSelected ? '#0284c7' : 'var(--text-primary)', marginTop: '0.2rem' }}>
                {trace.agent.replace(' Agent', '')}
              </h4>
              <span style={{ fontSize: '0.675rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {trace.model_used.split('/').pop()}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Active Agent Output Card */}
      {traces[activeStep] && (
        <motion.div 
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" 
          style={{ minHeight: '260px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {React.createElement(stepIcons[activeStep] || Bot, { size: 18, color: '#0284c7' })}
              </div>
              <div>
                <h4 style={{ fontSize: '0.975rem', fontWeight: 700 }}>{traces[activeStep].agent}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Engine: <code>{traces[activeStep].model_used}</code> • Execution Latency: <strong>{traces[activeStep].latency_ms} ms</strong>
                </p>
              </div>
            </div>
            {traces[activeStep].verification_status && (
              <span className="badge badge-verified">
                <CheckCircle2 size={12} /> Audit Status: {traces[activeStep].verification_status}
              </span>
            )}
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.15rem', fontSize: '0.875rem', lineHeight: 1.7, color: '#1e293b', whiteSpace: 'pre-wrap' }}>
            {traces[activeStep].output}
          </div>
        </motion.div>
      )}

      {/* Final Integrated Impression & Audit */}
      {orchestratedData?.final_synthesis && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card" 
          style={{ borderLeft: '4px solid #059669', background: '#f0fdf4' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
            <CheckCircle2 size={18} color="#059669" />
            <h4 style={{ fontSize: '0.975rem', fontWeight: 700, color: '#065f46' }}>
              Final Clinical Consensus & Audit
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {orchestratedData.final_synthesis}
          </p>
        </motion.div>
      )}

    </div>
  );
}
