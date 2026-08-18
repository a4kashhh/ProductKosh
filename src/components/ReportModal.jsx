import React from 'react';
import { activeIncident, systemStats } from '../data/seedData';
import { FileText, Download, CheckCircle2, X } from 'lucide-react';

export default function ReportModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    }}>
      <div className="cyber-card cyber-card-pink" style={{ width: '780px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--cyber-border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <span className="cyber-badge cyber-badge-pink">EXECUTIVE FULL-STACK ENGINEERING REPORT</span>
            <h2 className="font-hud text-cyan" style={{ fontSize: '1.25rem', marginTop: '0.25rem' }}>
              ContextForge AI System Resolution Summary
            </h2>
          </div>
          <button onClick={onClose} className="cyber-btn btn-sm">
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', lineHeight: '1.6' }}>
          
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '4px' }}>
            <h4 className="font-hud text-pink" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>1. INCIDENT & SYSTEM SCOPE</h4>
            <p><strong>Incident:</strong> {activeIncident.title}</p>
            <p><strong>System:</strong> Enterprise Cloud Microservices Stack v5.1 (Node.js, Express, PostgreSQL, Redis)</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '4px' }}>
            <h4 className="font-hud text-yellow" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>2. CONTEXTUAL ROOT CAUSE ANALYSIS</h4>
            <p>Leaked PostgreSQL connection handle in <code>AuthService.validateToken()</code> introduced in Commit <code>c91f04</code>, causing connection pool exhaustion under 10,000 RPS load.</p>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '4px' }}>
            <h4 className="font-hud text-cyan" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>3. APM EVIDENCE VECTORS</h4>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li>OpenTelemetry Trace #TR-9901 (HTTP 504 Gateway Timeout log)</li>
              <li>PostgreSQL DB Log: FATAL remaining connection slots reserved for non-replication superuser connections</li>
              <li>Commit c91f04 (A. Vance, March 2 2026)</li>
              <li>Issue BUG-3049 correlation</li>
              <li>REQ-104 Sub-200ms SLA Specification Mapping</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '1rem', borderRadius: '4px' }}>
            <h4 className="font-hud text-green" style={{ fontSize: '0.9rem', marginBottom: '0.3rem' }}>4. LOAD VALIDATION & SAFETY RESULTS</h4>
            <p><strong>Proposed Code Patch:</strong> Wrapped DB connection acquisition in a guaranteed try / finally block with explicit client release.</p>
            <p><strong>K6 Load Test Results:</strong> 10,000 RPS Load Test — 100% Pass Rate (0% Errors, 45ms Avg Latency).</p>
            <p><strong>Human Sign-off Status:</strong> Approved by Lead Full-Stack Architect.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>KPIT SPARKLE 2026 PROTOTYPE SUMMARY</span>
          <button onClick={() => window.print()} className="cyber-btn cyber-btn-pink">
            <Download size={16} />
            <span>Export Report PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
}
