import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import MultimodalAnalysis from './components/MultimodalAnalysis';
import DocumentRAG from './components/DocumentRAG';
import MedicalSearch from './components/MedicalSearch';
import AgentNetwork from './components/AgentNetwork';
import ExperienceHub from './components/ExperienceHub';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('multimodal');
  const [orchestratedData, setOrchestratedData] = useState(null);

  const handleOrchestrateComplete = (data) => {
    setOrchestratedData(data);
    setActiveTab('agents'); // Switch to agent network tab to inspect traces
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '1.5rem' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'multimodal' && (
            <motion.div
              key="multimodal"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MultimodalAnalysis onOrchestrateComplete={handleOrchestrateComplete} />
            </motion.div>
          )}

          {activeTab === 'rag' && (
            <motion.div
              key="rag"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <DocumentRAG />
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <MedicalSearch />
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AgentNetwork orchestratedData={orchestratedData} />
            </motion.div>
          )}

          {activeTab === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <ExperienceHub />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Safety & Educational Disclaimer Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        background: '#ffffff',
        padding: '1.5rem',
        marginTop: '3rem',
        textAlign: 'center',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        boxShadow: '0 -1px 8px rgba(0, 0, 0, 0.02)'
      }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', color: '#b45309', fontWeight: 700, fontSize: '0.8rem' }}>
            <AlertTriangle size={15} />
            <span>CLINICAL RESEARCH & EDUCATIONAL DECISION-SUPPORT NOTICE</span>
          </div>
          <p style={{ lineHeight: 1.5, color: '#475569' }}>
            MEDINTEL is an experimental decision-support research platform combining Computer Vision, Document RAG, and Multi-Agent consensus. It is <strong>NOT</strong> an autonomous diagnostic medical device or a replacement for licensed clinical judgment. All outputs must be audited and verified by medical professionals.
          </p>
          <div style={{ marginTop: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', color: '#64748b', fontSize: '0.725rem' }}>
            <span>MEDINTEL Architecture Blueprint — 8 Clinical Modalities</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <ShieldCheck size={13} color="#0284c7" /> Verifiable Audit Trajectories
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
