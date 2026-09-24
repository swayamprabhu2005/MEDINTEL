import React, { useState } from 'react';

export default function AgentNetwork({ orchestratedData, onTriggerRun }) {
  const [activeStep, setActiveStep] = useState(0);

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

  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner: Verification Badge & Latency */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9), rgba(15, 23, 42, 0.9))' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Multi-Agent Verification Network</h3>
            <span className={`badge ${verification.status === 'VERIFIED' ? 'badge-verified' : 'badge-moderate'}`}>
              ✓ {verification.status} ({(verification.confidence * 100).toFixed(0)}% Confidence)
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Heterogeneous NVIDIA NIM Models coordinating specialist roles with adversarial verification
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Case Execution Latency</span>
          <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
            {orchestratedData?.total_latency_ms || 653} ms
          </p>
        </div>
      </div>

      {/* Step Sequence Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.75rem' }}>
        {traces.map((trace, idx) => {
          const isSelected = activeStep === idx;
          const icons = ['🩻', '📋', '🔬', '💡', '🛡️'];

          return (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              style={{
                background: isSelected ? 'rgba(14, 165, 233, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                border: isSelected ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid var(--border-color)',
                borderRadius: '10px',
                padding: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.35rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem' }}>{icons[idx]}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Step {idx + 1}</span>
              </div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: isSelected ? '#38bdf8' : 'var(--text-primary)' }}>
                {trace.agent.replace(' Agent', '')}
              </h4>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {trace.model_used.split('/').pop()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Agent Output Card */}
      {traces[activeStep] && (
        <div className="card" style={{ minHeight: '280px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>
                {['🩻', '📋', '🔬', '💡', '🛡️'][activeStep]}
              </span>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{traces[activeStep].agent}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Model: <code>{traces[activeStep].model_used}</code> • Latency: <strong>{traces[activeStep].latency_ms} ms</strong>
                </p>
              </div>
            </div>
            {traces[activeStep].verification_status && (
              <span className="badge badge-verified">
                Audit Status: {traces[activeStep].verification_status}
              </span>
            )}
          </div>

          <div style={{ background: 'rgba(10, 15, 29, 0.7)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', fontSize: '0.875rem', lineHeight: 1.7, color: '#e2e8f0', whiteSpace: 'pre-wrap' }}>
            {traces[activeStep].output}
          </div>
        </div>
      )}

      {/* Final Integrated Impression & Audit */}
      {orchestratedData?.final_synthesis && (
        <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#34d399', marginBottom: '0.5rem' }}>
            🎯 Final Clinical Consensus & Verification
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {orchestratedData.final_synthesis}
          </p>
        </div>
      )}

    </div>
  );
}
