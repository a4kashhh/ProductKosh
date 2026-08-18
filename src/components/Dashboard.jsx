import React from 'react';
import { activeIncident, systemStats } from '../data/seedData';
import { Zap, AlertTriangle, ShieldCheck, Activity, Code, FileText, CheckCircle2, GitCommit, Cpu, ZapOff } from 'lucide-react';

export default function Dashboard({ onInvestigate, onExploreGraph }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Header Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PCB COMPONENTS</span>
          <div className="font-hud text-cyan" style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{systemStats.loc}</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>NETLIST TRACES</span>
          <div className="font-hud text-purple" style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{systemStats.functions}</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HW TEST BENCHES</span>
          <div className="font-hud text-green" style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{systemStats.tests}</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>IC DATASHEETS</span>
          <div className="font-hud text-yellow" style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{systemStats.dependencies}</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PCB REVISIONS</span>
          <div className="font-hud text-cyan" style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{systemStats.commits}</div>
        </div>
        <div className="cyber-card" style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>HARDWARE ECOs</span>
          <div className="font-hud text-pink" style={{ fontSize: '1.2rem', marginTop: '0.25rem' }}>{systemStats.issues}</div>
        </div>
      </div>

      {/* Active Incident Alert Card (Main Feature) */}
      <div className="cyber-card cyber-card-pink pulse-card" style={{ padding: '1.75rem', background: 'rgba(255, 0, 85, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="cyber-badge cyber-badge-pink">HARDWARE ANOMALY DETECTED</span>
            <span className="cyber-badge cyber-badge-yellow">SEVERITY: {activeIncident.severity}</span>
            <span className="cyber-badge cyber-badge-cyan">CONFIDENCE: {activeIncident.confidence}%</span>
          </div>
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ID: {activeIncident.id}</span>
        </div>

        <h2 className="font-hud text-pink glow-pink" style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
          [ {activeIncident.title} ]
        </h2>

        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.25rem', maxWidth: '1000px' }}>
          {activeIncident.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '4px' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>AFFECTED HARDWARE MODULES</span>
            <div className="font-hud text-cyan" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{activeIncident.affectedComponentsCount} PCB Subsystems</div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>TEST BENCH SUITES</span>
            <div className="font-hud text-yellow" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{activeIncident.relatedTestsCount} Hardware Tests</div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>POTENTIAL RISK</span>
            <div className="font-hud text-pink" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>{activeIncident.potentialRisk} (ECU Reset)</div>
          </div>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SUSPECT ECO REVISION</span>
            <div className="font-hud text-purple" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>Rev B3 (ECO-4921)</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onInvestigate} className="cyber-btn cyber-btn-pink">
            <Zap size={18} />
            <span>INVESTIGATE HARDWARE CIRCUIT WITH CONTEXT ENGINE</span>
          </button>
          <button onClick={onExploreGraph} className="cyber-btn">
            <Activity size={18} />
            <span>INSPECT IN HARDWARE CONTEXT GRAPH</span>
          </button>
        </div>
      </div>

      {/* Grid of Subsystem Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Reliability & Quality Metrics */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 className="font-hud text-cyan" style={{ fontSize: '1rem' }}>HARDWARE RELIABILITY & POWER RAIL AUDIT</h3>
            <span className="cyber-badge cyber-badge-green">BENCH HARDWARE DATA</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                <span>Hardware Reliability Score</span>
                <span className="font-mono text-green">{systemStats.reliabilityScore}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '96.4%', height: '100%', background: 'var(--neon-green)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.3rem' }}>
                <span>Hardware Test Coverage</span>
                <span className="font-mono text-cyan">{systemStats.testCoverage}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--neon-cyan)' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--cyber-border)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Component Supply Risk</span>
                <div className="font-hud text-green" style={{ fontSize: '1rem', marginTop: '0.2rem' }}>{systemStats.dependencyRisk}</div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--cyber-border)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Power Rail Risk</span>
                <div className="font-hud text-yellow" style={{ fontSize: '1rem', marginTop: '0.2rem' }}>{systemStats.architectureRisk}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Graph Quick Stats */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 className="font-hud text-purple" style={{ fontSize: '1rem' }}>HARDWARE CONTEXT GRAPH ENTITIES</h3>
            <span className="cyber-badge cyber-badge-purple">8 HARDWARE TYPES</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              <div className="font-hud text-cyan" style={{ fontSize: '1.2rem' }}>15</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HW Specs</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              <div className="font-hud text-purple" style={{ fontSize: '1.2rem' }}>10</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PCB ICs</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              <div className="font-hud text-green" style={{ fontSize: '1.2rem' }}>40</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Schematic Nets</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              <div className="font-hud text-yellow" style={{ fontSize: '1.2rem' }}>25</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PCB Revisions</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              <div className="font-hud text-pink" style={{ fontSize: '1.2rem' }}>15</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ECO Reports</span>
            </div>
            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', textAlign: 'center' }}>
              <div className="font-hud text-cyan" style={{ fontSize: '1.2rem' }}>30</div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HW Tests</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
