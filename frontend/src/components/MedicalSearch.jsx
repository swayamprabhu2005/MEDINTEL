import React, { useState } from 'react';

export default function MedicalSearch() {
  const [searchQuery, setSearchQuery] = useState('Pneumonia clinical practice guidelines');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);

  const presets = [
    'Community-acquired pneumonia treatment',
    'Cardiomegaly heart failure guidelines',
    'Fleischner Society pulmonary nodules',
    'Pleural effusion diagnosis and drainage'
  ];

  const handleSearch = async (term = searchQuery) => {
    if (!term.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/v1/search/pubmed?query=${encodeURIComponent(term)}&max_results=6`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      }
    } catch (err) {
      console.error('PubMed search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Search Bar Header */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Biomedical Evidence Search (PubMed E-Utilities)</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Real-time literature retrieval from NCBI PubMed with clinical practice guideline filters
            </p>
          </div>
          <span className="badge badge-low">Live NCBI API</span>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            className="input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search PubMed for disease guidelines, clinical trials, or drug indications..."
          />
          <button 
            onClick={() => handleSearch()} 
            disabled={isSearching} 
            className="btn btn-primary"
            style={{ minWidth: '130px' }}
          >
            {isSearching ? 'Searching...' : '🔍 Search PubMed'}
          </button>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Topics:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchQuery(p);
                handleSearch(p);
              }}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: '1px solid var(--border-color)',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Results List */}
      {results && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Found {results.total_results} Peer-Reviewed Articles for "{results.query}"
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ranked by Clinical Relevance & Recency</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.articles.map((art) => (
              <div
                key={art.pmid}
                style={{
                  background: 'rgba(15, 23, 42, 0.55)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: '#38bdf8',
                      textDecoration: 'none',
                      lineHeight: 1.4
                    }}
                  >
                    {art.title} ↗
                  </a>
                  <span className="badge badge-low" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>
                    {art.evidence_level}
                  </span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>{art.authors}</span> • <em>{art.journal}</em> • <span>{art.pub_date}</span>
                </div>

                {art.key_summary && (
                  <p style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(30, 41, 59, 0.4)', padding: '0.5rem 0.75rem', borderRadius: '6px', marginTop: '0.25rem' }}>
                    💡 <strong>Clinical Takeaway:</strong> {art.key_summary}
                  </p>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>PMID: <code>{art.pmid}</code></span>
                  <span>Relevance Score: {(art.relevance_score * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
