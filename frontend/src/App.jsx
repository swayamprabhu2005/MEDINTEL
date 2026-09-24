import React, { useState } from 'react';
import Navbar from './components/Navbar';
import MultimodalAnalysis from './components/MultimodalAnalysis';
import DocumentRAG from './components/DocumentRAG';
import MedicalSearch from './components/MedicalSearch';
import AgentNetwork from './components/AgentNetwork';
import ExperienceHub from './components/ExperienceHub';

export default function App() {
  const [activeTab, setActiveTab] = useState('multimodal');
  const [orchestratedData, setOrchestratedData] = useState(null);

  const handleOrchestrateComplete = (data) => {
    setOrchestratedData(data);
    setActiveTab('agents'); // Switch to agent network tab to inspect traces
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '1.5rem' }}>
        {activeTab === 'multimodal' && (
          <MultimodalAnalysis onOrchestrateComplete={handleOrchestrateComplete} />
        )}
        {activeTab === 'rag' && (
          <DocumentRAG />
        )}
        {activeTab === 'search' && (
          <MedicalSearch />
        )}
        {activeTab === 'agents' && (
          <AgentNetwork orchestratedData={orchestratedData} />
        )}
        {activeTab === 'experience' && (
          <ExperienceHub />
        )}
      </main>

      {/* Safety & Educational Disclaimer Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(10, 15, 29, 0.95)',
        padding: '1.25rem 1.5rem',
        marginTop: '2rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <p style={{ color: '#f59e0b', fontWeight: 600 }}>
            ⚠️ CLINICAL RESEARCH & EDUCATIONAL DECISION-SUPPORT NOTICE
          </p>
          <p>
            MEDINTEL is an experimental decision-support research platform combining Computer Vision, Document RAG, and Multi-Agent consensus. It is NOT an autonomous diagnostic medical device or a replacement for licensed clinical judgment. All outputs must be audited and verified by medical professionals.
          </p>
          <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
            MEDINTEL Architecture Blueprint — Multimodal Medical Intelligence & Evidence Network
          </p>
        </div>
      </footer>

    </div>
  );
}
