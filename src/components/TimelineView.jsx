import React from 'react';
import { timelineEvents, gitCommitsList } from '../data/seedData';
import { GitBranch, GitCommit, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function TimelineView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <GitBranch size={20} className="text-cyan" />
          <h2 className="font-hud text-cyan" style={{ fontSize: '1.1rem' }}>
            GIT ENGINEERING CHRONOLOGY & REVISION TIMELINE
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-cyan">AUDIT TRAIL VERIFIED</span>
      </div>

      {/* Timeline Stream */}
      <div className="cyber-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative', paddingLeft: '1.5rem' }}>
          
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '18px', width: '2px', background: 'var(--cyber-border)' }} />

          {timelineEvents.map((ev, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                position: 'relative'
              }}
            >
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: ev.highlight ? 'var(--neon-pink)' : 'var(--neon-cyan)',
                  boxShadow: ev.highlight ? '0 0 10px var(--neon-pink)' : '0 0 8px var(--neon-cyan)',
                  position: 'absolute',
                  left: '-24px',
                  top: '4px'
                }}
              />

              <div style={{
                background: ev.highlight ? 'rgba(255,0,85,0.1)' : 'rgba(0,0,0,0.3)',
                border: ev.highlight ? '1px solid var(--neon-pink)' : '1px solid var(--cyber-border)',
                padding: '0.85rem 1.1rem',
                borderRadius: '4px',
                flex: 1
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-mono text-cyan" style={{ fontSize: '0.78rem' }}>{ev.date}</span>
                  <span className={`cyber-badge ${ev.highlight ? 'cyber-badge-pink' : 'cyber-badge-purple'}`} style={{ fontSize: '0.65rem' }}>
                    {ev.type.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginTop: '0.3rem' }}>{ev.label}</div>
              </div>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}
