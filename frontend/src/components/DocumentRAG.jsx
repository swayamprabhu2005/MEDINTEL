import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, UploadCloud, Sparkles, Send, CheckCircle2, BookOpen, Quote, RefreshCw } from 'lucide-react';

export default function DocumentRAG() {
  const [fileToUpload, setFileToUpload] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [query, setQuery] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your clinical document RAG assistant. Upload radiology notes, discharge summaries, or clinical reports, and I will answer questions grounded in the exact source passages.',
      citations: []
    }
  ]);

  const handleLoadSampleDocument = async () => {
    setIsUploading(true);
    const sampleText = `
PATIENT RADIOLOGY REPORT
EXAMINATION: CHEST PA AND LATERAL
INDICATION: 68-year-old female with progressive dyspnea and productive cough for 4 days.
COMPARISON: Chest radiograph dated 6 months prior.

FINDINGS:
LUNGS: There is a new consolidation in the right lower lobe with surrounding ground-glass opacity, consistent with acute pneumonia. The left lung field remains clear without focal infiltrate.
PLEURA: Minimal blunting of the right costophrenic angle suggesting a small sympathetic pleural effusion. No pneumothorax.
CARDIAC: The cardiac silhouette demonstrates moderate cardiomegaly with a cardiothoracic ratio of 0.54, slightly increased compared to the previous examination.
OSSEOUS: Mild diffuse thoracic osteopenia and degenerative changes of the thoracic spine.

IMPRESSION:
1. Acute right lower lobe consolidation consistent with community-acquired pneumonia.
2. Small right-sided reactive pleural effusion.
3. Moderate cardiomegaly, slightly progressed from prior study.
RECOMMENDATION: Clinical correlation with sputum cultures, empiric antibiotic therapy, and follow-up radiograph in 6 weeks to ensure resolution.
    `.trim();

    const blob = new Blob([sampleText], { type: 'text/plain' });
    const file = new File([blob], 'sample_radiology_report.txt', { type: 'text/plain' });

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/rag/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadStatus(data);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'system',
            text: `Indexed sample document "sample_radiology_report.txt" into ${data.chunks_indexed} clinical section chunks (Findings, Impression, Indication).`,
            citations: []
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/v1/rag/upload', {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        setUploadStatus(data);
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'system',
            text: `Indexed "${data.filename}" (${data.chunks_indexed} clinical section chunks created).`,
            citations: []
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendQuery = async (e) => {
    e.preventDefault();
    if (!query.trim() || isQuerying) return;

    const userQ = query;
    setQuery('');
    setChatHistory((prev) => [...prev, { role: 'user', text: userQ, citations: [] }]);
    setIsQuerying(true);

    try {
      const res = await fetch('/api/v1/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQ, top_k: 3 })
      });
      if (res.ok) {
        const data = await res.json();
        setChatHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.answer,
            citations: data.citations || [],
            retrieved_chunks: data.retrieved_chunks || []
          }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '0.5rem' }}>
      
      {/* Left Column: Document Upload & Chunker Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <BookOpen size={18} color="#0284c7" />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Clinical Document Store</h3>
            </div>
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLoadSampleDocument}
              disabled={isUploading}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              <Sparkles size={13} color="#0284c7" />
              <span>Sample Report</span>
            </motion.button>
          </div>

          <div
            style={{
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              padding: '1.75rem 1rem',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onClick={() => document.getElementById('rag-file-input').click()}
          >
            <input
              id="rag-file-input"
              type="file"
              accept=".txt,.pdf,.md,.csv"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <UploadCloud size={32} color="#0284c7" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {isUploading ? 'Parsing & Indexing...' : 'Upload Medical Report / PDF'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Section-aware semantic parsing & BM25 hybrid index
            </p>
          </div>

          {uploadStatus && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ marginTop: '1rem', background: '#ecfdf5', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #a7f3d0', fontSize: '0.8rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#059669', fontWeight: 700 }}>
                <CheckCircle2 size={16} />
                <span>Document Successfully Indexed</span>
              </div>
              <p style={{ color: '#334155', marginTop: '0.25rem', fontWeight: 500 }}>{uploadStatus.filename}</p>
              <p style={{ color: '#64748b', fontSize: '0.75rem' }}>
                Chunks: <strong>{uploadStatus.chunks_indexed}</strong> | Total in Database: <strong>{uploadStatus.total_documents_in_retriever}</strong>
              </p>
            </motion.div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.785rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              💡 Example Grounded Queries:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {[
                'What changed between the previous and latest scan?',
                'Is there any evidence of pleural effusion or consolidation?',
                'What are the recommended clinical next steps and medications?'
              ].map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(ex)}
                  style={{
                    textAlign: 'left',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    color: '#334155',
                    fontSize: '0.775rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0284c7'; e.currentTarget.style.background = '#f0f9ff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#f8fafc'; }}
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Grounded Clinical Chat */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card" 
        style={{ display: 'flex', flexDirection: 'column', height: '640px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Grounded Document Assistant</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answers backed by verifiable citations from uploaded records</p>
          </div>
          <span className="badge badge-verified">Hybrid BM25 + Vector</span>
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isSystem = msg.role === 'system';

            if (isSystem) {
              return (
                <div key={idx} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#0369a1', background: '#f0f9ff', padding: '0.4rem 0.85rem', borderRadius: '8px', margin: '0 auto', border: '1px solid #bae6fd' }}>
                  ℹ️ {msg.text}
                </div>
              );
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isUser ? 'linear-gradient(135deg, #0284c7, #0369a1)' : '#f8fafc',
                  border: isUser ? 'none' : '1px solid #e2e8f0',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '0.85rem 1.15rem',
                  fontSize: '0.85rem',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: isUser ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'var(--shadow-sm)'
                }}
              >
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.text}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: '0.75rem', borderTop: '1px solid rgba(226, 232, 240, 0.8)', paddingTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.7rem', color: '#0369a1', fontWeight: 700 }}>
                      <Quote size={11} /> Citations:
                    </div>
                    {msg.citations.map((c, i) => (
                      <span key={i} style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 600, border: '1px solid #bae6fd' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            );
          })}
          {isQuerying && (
            <div style={{ alignSelf: 'flex-start', color: '#0284c7', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0f9ff', padding: '0.5rem 0.85rem', borderRadius: '8px' }}>
              <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              Searching hybrid indices & synthesizing grounded answer...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendQuery} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
          <input
            className="input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the uploaded medical documents..."
          />
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            disabled={!query.trim() || isQuerying} 
            className="btn btn-primary"
            style={{ padding: '0.65rem 1.25rem' }}
          >
            <Send size={15} />
            <span>Ask RAG</span>
          </motion.button>
        </form>
      </motion.div>

    </div>
  );
}
