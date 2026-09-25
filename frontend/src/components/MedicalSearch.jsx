import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ExternalLink, BookOpen, Lightbulb, Calendar, User, CheckCircle2 } from 'lucide-react';

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
    <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Search Bar Header */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BookOpen size={18} color="#0284c7" />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Biomedical Evidence Search (PubMed E-Utilities)</h3>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Real-time literature retrieval from NCBI PubMed with clinical practice guideline filters
            </p>
          </div>
          <span className="badge badge-low" style={{ fontSize: '0.7rem' }}>
            <CheckCircle2 size={12} /> Live NCBI API
          </span>
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
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSearch()} 
            disabled={isSearching} 
            className="btn btn-primary"
            style={{ minWidth: '140px', padding: '0.65rem 1.15rem' }}
          >
            <Search size={15} />
            <span>{isSearching ? 'Searching...' : 'Search PubMed'}</span>
          </motion.button>
        </div>

        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Quick Topics:</span>
          {presets.map((p, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setSearchQuery(p);
                handleSearch(p);
              }}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                padding: '0.35rem 0.75rem',
                borderRadius: '8px',
                fontSize: '0.75rem',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.15s ease'
              }}
            >
              {p}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results List */}
      {results && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Found {results.total_results} Peer-Reviewed Articles for "{results.query}"
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ranked by Clinical Relevance & Recency</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {results.articles.map((art, idx) => (
              <motion.div
                key={art.pmid}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '1.15rem 1.35rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <a
                    href={art.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: '0.975rem',
                      fontWeight: 700,
                      color: '#0284c7',
                      textDecoration: 'none',
                      lineHeight: 1.4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <span>{art.title}</span>
                    <ExternalLink size={14} style={{ display: 'inline', flexShrink: 0 }} />
                  </a>
                  <span className="badge badge-low" style={{ fontSize: '0.675rem', whiteSpace: 'nowrap' }}>
                    {art.evidence_level}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.785rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <User size={13} />
                    <span>{art.authors}</span>
                  </div>
                  <span>•</span>
                  <em>{art.journal}</em>
                  <span>•</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={13} />
                    <span>{art.pub_date}</span>
                  </div>
                </div>

                {art.key_summary && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.8rem', color: '#1e293b', background: '#ecfdf5', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid #a7f3d0', marginTop: '0.25rem' }}>
                    <Lightbulb size={15} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p>
                      <strong>Clinical Practice Guidance:</strong> {art.key_summary}
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #e2e8f0', paddingTop: '0.45rem' }}>
                  <span>PMID: <code>{art.pmid}</code></span>
                  <span style={{ fontWeight: 600, color: '#0284c7' }}>Clinical Match: {(art.relevance_score * 100).toFixed(0)}%</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
}
