import React, { useState, useEffect } from 'react';

export default function ExperienceHub() {
  const [metrics, setMetrics] = useState(null);
  const [trajectories, setTrajectories] = useState([]);
  const [taxonomy, setTaxonomy] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metRes, trajRes, taxRes] = await Promise.all([
          fetch('/api/v1/trajectories/metrics'),
          fetch('/api/v1/trajectories?limit=20'),
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
    fetchData();
  }, []);

  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header Banner */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(45, 212, 191, 0.05))' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38bdf8' }}>
          🧠 Self-Improving Experience & Trajectory Loop
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.5 }}>
          MEDINTEL records structured execution traces across cases (models, retrieval methods, search queries, and verifier audits). Over time, the platform refines its orchestration policies to minimize hallucinations and unnecessary computation.
        </p>
      </div>

      {/* Metrics Row */}
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cases in Experience DB</span>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
              {metrics.total_cases_analyzed}
            </p>
            <span style={{ fontSize: '0.7rem', color: '#38bdf8' }}>SQLite Auditable Trajectories</span>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verification Pass Rate</span>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981', marginTop: '0.25rem' }}>
              {(metrics.overall_verification_rate * 100).toFixed(0)}%
            </p>
            <span style={{ fontSize: '0.7rem', color: '#34d399' }}>Skeptic Auditor Consensus</span>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mean Verification Confidence</span>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.25rem' }}>
              {metrics.mean_confidence.toFixed(2)}
            </p>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Normalized [0.0 - 1.0]</span>
          </div>

          <div className="card" style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Adaptive PubMed Threshold</span>
            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b', marginTop: '0.25rem' }}>
              {(metrics.active_policies?.pubmed_escalation_threshold * 100).toFixed(0)}%
            </p>
            <span style={{ fontSize: '0.7rem', color: '#fbbf24' }}>Auto-search Escalation</span>
          </div>

        </div>
      )}

      {/* Trajectories Table */}
      <div className="card">
        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.85rem' }}>
          Audited Case Trajectories
        </h3>
        
        {trajectories.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Case ID</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Timestamp</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Modality</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Agents Invoked</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Confidence</th>
                  <th style={{ padding: '0.65rem 0.5rem' }}>Failure Type</th>
                </tr>
              </thead>
              <tbody>
                {trajectories.map((t) => (
                  <tr key={t.case_id} style={{ borderBottom: '1px solid rgba(51, 65, 85, 0.3)', color: 'var(--text-secondary)' }}>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#38bdf8' }}>{t.case_id}</td>
                    <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)' }}>{t.timestamp.split('T')[0]}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>{t.modality}</td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <span style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '0.2rem 0.45rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                        {t.agents_invoked.length} Agents
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem' }}>
                      <span className={`badge ${t.verification_status === 'VERIFIED' ? 'badge-verified' : 'badge-moderate'}`}>
                        {t.verification_status}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>
                      {(t.verifier_confidence * 100).toFixed(0)}%
                    </td>
                    <td style={{ padding: '0.65rem 0.5rem', color: t.failure_type === 'None' ? '#10b981' : '#f43f5e' }}>
                      {t.failure_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No trajectories recorded yet. Run a case in the Multimodal Analysis tab to record your first trace!
          </p>
        )}
      </div>

      {/* 14-Category Failure Taxonomy Reference */}
      <div className="card">
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.65rem', color: 'var(--text-primary)' }}>
          14-Point Medical AI Failure Taxonomy (MEDINTEL Specification)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', fontSize: '0.75rem' }}>
          {Object.entries(taxonomy).map(([k, v]) => (
            <div key={k} style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontWeight: 600, color: '#93c5fd' }}>{k}</span>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{v}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
