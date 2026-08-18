import React from 'react';
import { Cpu, ShieldCheck, Activity, Search, Sparkles, BookOpen, Layers } from 'lucide-react';

export default function Header({ currentProject, onOpenReport, onEnterDemo }) {
  return (
    <header style={{
      height: '64px',
      background: 'rgba(3, 6, 13, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--cyber-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.75rem',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Left Title & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '4px',
            background: 'linear-gradient(135deg, #00f0ff 0%, #9d4edd 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)'
          }}>
            <Layers size={22} color="#fff" />
          </div>
          <div>
            <div className="font-hud glow-cyan" style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>ContextForge <span className="text-pink glow-pink">AI</span></span>
              <span className="cyber-badge cyber-badge-purple" style={{ fontSize: '0.62rem' }}>ENTERPRISE v5.1</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Full-Stack Engineering Intelligence Platform
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '24px', background: 'var(--cyber-border)' }}></div>

        {/* Project Selector Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(0,0,0,0.4)',
          border: '1px solid var(--cyber-border)',
          padding: '0.35rem 0.75rem',
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}>
          <Activity size={14} className="text-cyan" />
          <span style={{ color: 'var(--text-muted)' }}>System:</span>
          <strong style={{ color: '#fff' }}>{currentProject || 'Enterprise Cloud Stack v5.1'}</strong>
        </div>
      </div>

      {/* Center Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        background: 'rgba(8, 14, 28, 0.9)',
        border: '1px solid var(--cyber-border)',
        padding: '0.4rem 0.85rem',
        borderRadius: '20px',
        width: '340px'
      }}>
        <Search size={14} className="text-dim" />
        <input 
          type="text" 
          placeholder="Search API endpoints, SQL queries, APM traces..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            width: '100%',
            fontFamily: 'var(--font-sans)'
          }}
        />
        <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px', color: 'var(--text-muted)' }}>⌘K</span>
      </div>

      {/* Right Telemetry & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div className="cyber-badge cyber-badge-green">
          <ShieldCheck size={12} />
          <span>MICROSERVICES ONLINE</span>
        </div>

        <button onClick={onOpenReport} className="cyber-btn btn-sm">
          <BookOpen size={14} />
          <span>Full-Stack Report</span>
        </button>

        <button onClick={onEnterDemo} className="cyber-btn cyber-btn-pink btn-sm">
          <Sparkles size={14} />
          <span>Launch Demo Scenario</span>
        </button>
      </div>
    </header>
  );
}
