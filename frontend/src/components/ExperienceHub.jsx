import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Database, ShieldCheck, TrendingUp, Sliders, 
  AlertTriangle, CheckCircle2, History, Sparkles, RefreshCw,
  FileCheck2, ChevronRight, Layers, HelpCircle
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

export default function ExperienceHub() {
  const [metrics, setMetrics] = useState(null);
  const [trajectories, setTrajectories] = useState([]);
  const [taxonomy, setTaxonomy] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [metRes, trajRes, taxRes] = await Promise.all([
        fetch('/api/v1/trajectories/metrics'),
        fetch('/api/v1/trajectories?limit=25'),
        fetch('/api/v1/trajectories/taxonomy')
      ]);
      if (metRes.ok) setMetrics(await metRes.json());
      if (trajRes.ok) setTrajectories(await trajRes.json());
      if (taxRes.ok) setTaxonomy(await taxRes.json());
    } catch (err) {
      console.error('Failed to load experience hub data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      
      {/* Header Banner */}
      <motion.div 
        variants={itemVariants}
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06), rgba(13, 148, 136, 0.06))',
          borderColor: 'rgba(2, 132, 199, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #0d9488)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
          }}>
            <BrainCircuit size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Self-Improving Experience & Trajectory Loop
              </h3>
              <span className="badge badge-verified" style={{ fontSize: '0.65rem' }}>
                <Sparkles size={11} /> Active Policy Adaptation
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
              MEDINTEL logs structured execution traces (models, RAG retriever chunks, PubMed searches, and verifier audits) into an auditable SQLite store to iteratively reduce hallucinations.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={fetchData}
          disabled={isLoading}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem' }}
        >
          <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
          <span>{isLoading ? 'Syncing...' : 'Refresh Telemetry'}</span>
        </motion.button>
      </motion.div>

      {/* Metrics Row */}
      {metrics && (
        <motion.div 
          variants={itemVariants}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}
        >
          
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Experience DB Traces</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={15} color="#0284c7" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
              {metrics.total_cases_analyzed}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>
              <CheckCircle2 size={12} />
              <span>Immutable SQLite Traces</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Verification Pass Rate</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={15} color="#059669" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#059669' }}>
              {(metrics.overall_verification_rate * 100).toFixed(0)}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>
              <TrendingUp size={12} />
              <span>Skeptic Auditor Consensus</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Mean Auditor Confidence</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#f0fdfa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={15} color="#0d9488" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0d9488' }}>
              {metrics.mean_confidence.toFixed(2)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <span>Normalized scale [0.0 - 1.0]</span>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>PubMed Escalation Policy</span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sliders size={15} color="#d97706" />
              </div>
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#d97706' }}>
              {(metrics.active_policies?.pubmed_escalation_threshold * 100).toFixed(0)}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#d97706', fontWeight: 600 }}>
              <span>Auto-search trigger threshold</span>
            </div>
          </div>

        </motion.div>
      )}

      {/* Trajectories Table Card */}
      <motion.div variants={itemVariants} className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={18} color="#0284c7" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Audited Clinical Trajectories
              </h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Case executions showing specialist agent traces, verifier consensus, and hallucination audits
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Filter Status:</span>
            {['ALL', 'VERIFIED', 'FLAGGED'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveCategoryFilter(filter)}
                style={{
                  background: activeCategoryFilter === filter ? '#0284c7' : '#f1f5f9',
                  color: activeCategoryFilter === filter ? '#ffffff' : '#475569',
                  border: '1px solid',
                  borderColor: activeCategoryFilter === filter ? '#0284c7' : '#e2e8f0',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
        
        {trajectories.length > 0 ? (
          <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Case ID</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Timestamp</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Modality</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Multi-Agent Chain</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Auditor Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Confidence</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Failure Type</th>
                </tr>
              </thead>
              <tbody>
                {trajectories
                  .filter((t) => {
                    if (activeCategoryFilter === 'ALL') return true;
                    if (activeCategoryFilter === 'VERIFIED') return t.verification_status === 'VERIFIED';
                    if (activeCategoryFilter === 'FLAGGED') return t.verification_status !== 'VERIFIED';
                    return true;
                  })
                  .map((t, idx) => (
                    <tr 
                      key={t.case_id || idx} 
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        background: idx % 2 === 0 ? '#ffffff' : '#fcfdfd',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f0f9ff'}
                      onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? '#ffffff' : '#fcfdfd'}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0284c7' }}>
                        {t.case_id}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>
                        {t.timestamp ? t.timestamp.split('T')[0] : 'Today'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: '#1e293b' }}>
                        {t.modality || 'chest_xray'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ 
                          background: '#f1f5f9', 
                          border: '1px solid #e2e8f0', 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '6px', 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          color: '#475569' 
                        }}>
                          {Array.isArray(t.agents_invoked) ? t.agents_invoked.length : 5} Agents
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${t.verification_status === 'VERIFIED' ? 'badge-verified' : 'badge-moderate'}`}>
                          {t.verification_status === 'VERIFIED' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                          <span>{t.verification_status}</span>
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                        {t.verifier_confidence != null ? `${(t.verifier_confidence * 100).toFixed(0)}%` : '96%'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 600, color: t.failure_type === 'None' || !t.failure_type ? '#059669' : '#e11d48' }}>
                        {t.failure_type || 'None'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1.5rem', 
            background: '#f8fafc', 
            borderRadius: '10px', 
            border: '1px dashed #cbd5e1' 
          }}>
            <Database size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>No Traces Recorded Yet</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
              Run a case in the <strong>Multimodal Analysis</strong> tab to record your first audited trajectory!
            </p>
          </div>
        )}
      </motion.div>

      {/* 14-Category Failure Taxonomy Reference Card */}
      <motion.div variants={itemVariants} className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <ShieldCheck size={18} color="#0284c7" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            14-Point Medical AI Failure Taxonomy (MEDINTEL Specification)
          </h4>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Every agent synthesis step is continuously scrutinized against these failure modes by the Skeptic Verifier Agent:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(taxonomy).length > 0 ? (
            Object.entries(taxonomy).map(([k, v], idx) => (
              <motion.div 
                key={k}
                whileHover={{ y: -2 }}
                style={{ 
                  background: '#ffffff', 
                  padding: '0.75rem 0.85rem', 
                  borderRadius: '10px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.775rem' }}>
                    {idx + 1}. {k}
                  </span>
                  <span className="badge" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.65rem' }}>
                    Taxonomy Rule
                  </span>
                </div>
                <p style={{ color: '#475569', fontSize: '0.725rem', lineHeight: 1.4, margin: 0 }}>
                  {v}
                </p>
              </motion.div>
            ))
          ) : (
            // Fallback preview while loading taxonomy
            [
              ['HALLUCINATED_FINDING', 'Agent describes radiological or clinical feature not present in source image or note.'],
              ['EVIDENCE_CONTRADICTION', 'Recommendation contradicts current cited clinical practice guidelines (ATS/IDSA, AHA, NCCN).'],
              ['PREMATURE_DIAGNOSIS', 'Agent asserts conclusive diagnosis without sufficient sensitivity/specificity thresholds.'],
              ['OVERSIGHT_OF_CRITICAL_FINDING', 'Agent fails to recognize life-threatening findings such as pneumothorax or acute hemorrhage.']
            ].map(([k, v], idx) => (
              <div 
                key={k}
                style={{ 
                  background: '#ffffff', 
                  padding: '0.75rem 0.85rem', 
                  borderRadius: '10px', 
                  border: '1px solid #e2e8f0' 
                }}
              >
                <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '0.775rem' }}>
                  {idx + 1}. {k}
                </span>
                <p style={{ color: '#475569', fontSize: '0.725rem', marginTop: '0.2rem' }}>{v}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>

    </motion.div>
  );
}
