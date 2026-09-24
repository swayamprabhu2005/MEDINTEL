import React, { useState } from 'react';

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

  // Load sample clinical radiology note
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
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', marginTop: '1rem' }}>
      
      {/* Left Column: Document Upload & Index Management */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Clinical Document Store</h3>
            <button 
              onClick={handleLoadSampleDocument}
              disabled={isUploading}
              className="btn btn-secondary"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              📄 Load Sample Report
            </button>
          </div>

          <div
            style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '10px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              background: 'rgba(15, 23, 42, 0.4)',
              cursor: 'pointer'
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
            <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📑</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {isUploading ? 'Parsing & Indexing...' : 'Upload Medical Report / PDF'}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Section-aware semantic parsing & BM25 hybrid index
            </p>
          </div>

          {uploadStatus && (
            <div style={{ marginTop: '1rem', background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.8rem' }}>
              <p style={{ color: '#34d399', fontWeight: 600 }}>✓ File Indexed</p>
              <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{uploadStatus.filename}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Chunks: {uploadStatus.chunks_indexed} | Total in DB: {uploadStatus.total_documents_in_retriever}</p>
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              💡 Example Grounded Queries:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    padding: '0.45rem 0.75rem',
                    borderRadius: '6px',
                    color: '#94a3b8',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  "{ex}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Grounded Clinical Chat */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '620px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Grounded Document Assistant</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answers backed by citations from uploaded clinical documents</p>
          </div>
          <span className="badge badge-verified">Hybrid BM25 + Vector</span>
        </div>

        {/* Chat Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
          {chatHistory.map((msg, idx) => {
            const isUser = msg.role === 'user';
            const isSystem = msg.role === 'system';

            if (isSystem) {
              return (
                <div key={idx} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#38bdf8', background: 'rgba(14, 165, 233, 0.1)', padding: '0.4rem 0.8rem', borderRadius: '6px', margin: '0 auto' }}>
                  ℹ️ {msg.text}
                </div>
              );
            }

            return (
              <div
                key={idx}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: isUser ? 'linear-gradient(135deg, #0ea5e9, #0284c7)' : 'rgba(15, 23, 42, 0.85)',
                  border: isUser ? 'none' : '1px solid var(--border-color)',
                  borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  padding: '0.85rem 1rem',
                  fontSize: '0.85rem',
                  color: isUser ? '#ffffff' : 'var(--text-primary)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}
              >
                <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{msg.text}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div style={{ marginTop: '0.65rem', borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    <span style={{ fontSize: '0.7rem', color: '#93c5fd', fontWeight: 600 }}>Citations:</span>
                    {msg.citations.map((c, i) => (
                      <span key={i} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {isQuerying && (
            <div style={{ alignSelf: 'flex-start', color: '#38bdf8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', animation: 'pulse 1s infinite' }} />
              Searching hybrid indices & synthesizing grounded answer...
            </div>
          )}
        </div>

        {/* Query Input */}
        <form onSubmit={handleSendQuery} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
          <input
            className="input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about the uploaded medical documents..."
          />
          <button type="submit" disabled={!query.trim() || isQuerying} className="btn btn-primary">
            Ask RAG
          </button>
        </form>
      </div>

    </div>
  );
}
