import React from 'react';
import { requirementsList } from '../data/seedData';
import { FileCheck2, ArrowRight } from 'lucide-react';

export default function TraceabilityView() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <FileCheck2 size={20} className="text-cyan" />
          <h2 className="font-hud text-cyan" style={{ fontSize: '1.1rem' }}>
            REQUIREMENTS TRACEABILITY MATRIX (REQ → CODE → TEST → ISSUE → COMMIT)
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-green">100% TRACEABLE</span>
      </div>

      <div className="cyber-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.6)', borderBottom: '1px solid var(--cyber-border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem' }}>
              <th style={{ padding: '1rem' }}>REQ CODE</th>
              <th style={{ padding: '1rem' }}>TITLE & DESCRIPTION</th>
              <th style={{ padding: '1rem' }}>COMPONENT</th>
              <th style={{ padding: '1rem' }}>TARGET FUNCTION</th>
              <th style={{ padding: '1rem' }}>ASSOCIATED TEST</th>
              <th style={{ padding: '1rem' }}>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {requirementsList.map((req) => (
              <tr key={req.id} style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                <td style={{ padding: '1rem' }} className="font-mono text-cyan">{req.code}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{req.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{req.description}</div>
                </td>
                <td style={{ padding: '1rem' }} className="font-mono text-purple">{req.component}</td>
                <td style={{ padding: '1rem' }} className="font-mono text-yellow">{req.functionName}</td>
                <td style={{ padding: '1rem' }} className="font-mono text-cyan">{req.testId}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`cyber-badge ${req.status === 'VERIFIED' ? 'cyber-badge-green' : 'cyber-badge-pink'}`}>
                    {req.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
