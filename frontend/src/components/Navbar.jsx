import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, FileText, Search, Bot, BrainCircuit, ShieldCheck, Cpu } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const [serverHealth, setServerHealth] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/api/v1/health');
        if (res.ok) {
          const data = await res.json();
          setServerHealth(data);
        }
      } catch (err) {
        setServerHealth({ status: 'offline' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'multimodal', label: 'Multimodal Case Analysis', icon: Activity },
    { id: 'rag', label: 'Clinical Document RAG', icon: FileText },
    { id: 'search', label: 'PubMed Evidence Engine', icon: Search },
    { id: 'agents', label: 'Multi-Agent Network', icon: Bot },
    { id: 'experience', label: 'Experience Hub', icon: BrainCircuit }
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(255, 255, 255, 0.92)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 1px 10px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          <motion.img 
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            src="/logo.png" 
            alt="MEDINTEL Logo" 
            style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(2, 132, 199, 0.2))' }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.03em', background: 'linear-gradient(135deg, #0284c7, #0d9488)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                MEDINTEL
              </span>
              <span className="badge" style={{ background: '#e0f2fe', color: '#0284c7', border: '1px solid #bae6fd', fontSize: '0.65rem' }}>
                <ShieldCheck size={12} style={{ display: 'inline' }} /> Clinical AI v1.0
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Multimodal Medical Intelligence & Evidence Network
            </p>
          </div>
        </div>

        {/* Animated Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.3rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  color: isActive ? '#0284c7' : '#475569',
                  border: 'none',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '9px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  outline: 'none',
                  zIndex: 1,
                  transition: 'color 0.2s ease'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#ffffff',
                      borderRadius: '9px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
                      border: '1px solid rgba(226, 232, 240, 0.9)',
                      zIndex: -1
                    }}
                  />
                )}
                <Icon size={16} color={isActive ? '#0284c7' : '#64748b'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Live Server & RAM Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
          {serverHealth && serverHealth.status === 'healthy' ? (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ecfdf5', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #a7f3d0' }}
            >
              <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#10b981', opacity: 0.75, animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                <span style={{ position: 'relative', width: '8px', height: '8px', borderRadius: '50%', background: '#059669' }} />
              </span>
              <span style={{ color: '#059669', fontWeight: 600 }}>API Ready</span>
              <span style={{ color: '#cbd5e1' }}>|</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#334155' }}>
                <Cpu size={12} color="#059669" />
                <span>RAM: <strong>{serverHealth.process_ram_mb} MB</strong></span>
              </div>
            </motion.div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#fff1f2', padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #fecdd3' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#e11d48' }} />
              <span style={{ color: '#be123c', fontWeight: 600 }}>Backend Offline</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
