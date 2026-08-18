import React from 'react';
import { GitPullRequest, AlertTriangle, ShieldCheck, ArrowRight, Layers, Lock, FileCode2 } from 'lucide-react';

export default function ImpactAnalysis({ onGoToPatch }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="cyber-badge cyber-badge-cyan">CHANGE IMPACT ANALYSIS</span>
            <span className="cyber-badge cyber-badge-yellow">DEPENDENCY PROPAGATION</span>
          </div>
          <h2 className="font-hud text-cyan" style={{ fontSize: '1.25rem' }}>
            Target Function: BluetoothSession.restore()
          </h2>
        </div>

        <button onClick={onGoToPatch} className="cyber-btn cyber-btn-pink">
          <ShieldCheck size={16} />
          <span>Review AI Patch Proposal</span>
        </button>
      </div>

      {/* Metric Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FILES AFFECTED</span>
          <div className="font-hud text-pink" style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>4</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>FUNCTIONS AFFECTED</span>
          <div className="font-hud text-cyan" style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>11</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>COMPONENTS</span>
          <div className="font-hud text-purple" style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>4</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>REQUIREMENTS</span>
          <div className="font-hud text-yellow" style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>3</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TESTS IMPACTED</span>
          <div className="font-hud text-green" style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>17</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OVERALL RISK</span>
          <div className="font-hud text-yellow" style={{ fontSize: '1.4rem', marginTop: '0.25rem' }}>MEDIUM</div>
        </div>
      </div>

      {/* Dependency Propagation Visualizer */}
      <div className="cyber-card">
        <h3 className="font-hud text-cyan" style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>
          DEPENDENCY PROPAGATION GRAPH
        </h3>

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          border: '1px solid var(--cyber-border)',
          borderRadius: '4px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {/* Node Level 1 */}
          <div className="cyber-badge cyber-badge-pink" style={{ fontSize: '1rem', padding: '0.6rem 1.25rem' }}>
            BluetoothSession.restore() [Target Function]
          </div>

          <div style={{ color: 'var(--neon-cyan)' }}>↓</div>

          {/* Node Level 2 */}
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div className="cyber-badge cyber-badge-cyan" style={{ padding: '0.5rem 1rem' }}>
              AudioManager::onBtConnect()
            </div>
            <div className="cyber-badge cyber-badge-yellow" style={{ padding: '0.5rem 1rem' }}>
              PowerManager::WakeHandler()
            </div>
          </div>

          <div style={{ color: 'var(--neon-cyan)' }}>↓</div>

          {/* Node Level 3 */}
          <div style={{ display: 'flex', gap: '4rem' }}>
            <div className="cyber-badge cyber-badge-purple" style={{ padding: '0.5rem 1rem' }}>
              DiagnosticsEngine::logState()
            </div>
            <div className="cyber-badge cyber-badge-green" style={{ padding: '0.5rem 1rem' }}>
              SessionManager::verifyNonce()
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
