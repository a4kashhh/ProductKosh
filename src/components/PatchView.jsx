import React, { useState } from 'react';
import { originalCodeSnippet, patchedCodeSnippet } from '../data/seedData';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight, Code2, Zap } from 'lucide-react';

export default function PatchView({ onApproveForValidation }) {
  const [patchStatus, setPatchStatus] = useState('PENDING_REVIEW'); // PENDING_REVIEW, APPROVED, REJECTED

  const handleApprove = () => {
    setPatchStatus('APPROVED');
    if (onApproveForValidation) onApproveForValidation();
  };

  const handleReject = () => {
    setPatchStatus('REJECTED');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="cyber-card cyber-card-pink" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="cyber-badge cyber-badge-pink">HARDWARE ECO & REGISTER PATCH</span>
            <span className="cyber-badge cyber-badge-cyan">CONFIDENCE: 94%</span>
            <span className="cyber-badge cyber-badge-yellow">HUMAN SIGN-OFF REQUIRED</span>
          </div>
          <h2 className="font-hud text-pink glow-pink" style={{ fontSize: '1.25rem' }}>
            [ Hardware Patch: Restore Decoupling Cap C410 & Reconfigure PMIC UVLO Threshold ]
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {patchStatus === 'PENDING_REVIEW' && (
            <>
              <button onClick={handleReject} className="cyber-btn cyber-btn-pink">
                <XCircle size={16} />
                <span>REJECT ECO</span>
              </button>
              <button onClick={handleApprove} className="cyber-btn cyber-btn-purple">
                <CheckCircle2 size={16} />
                <span>APPROVE FOR HARDWARE TEST BENCH VALIDATION</span>
              </button>
            </>
          )}

          {patchStatus === 'APPROVED' && (
            <div className="cyber-badge cyber-badge-green" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              ✓ APPROVED — DISPATCHED TO TEST BENCH
            </div>
          )}

          {patchStatus === 'REJECTED' && (
            <div className="cyber-badge cyber-badge-pink" style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
              ✗ REJECTED BY HARDWARE ARCHITECT
            </div>
          )}
        </div>
      </div>

      {/* Code / Netlist Diff Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Original Code */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 className="font-hud text-pink" style={{ fontSize: '0.95rem' }}>
              REVISION B3 NETLIST (VULNERABLE)
            </h3>
            <span className="cyber-badge cyber-badge-pink">BMS_Power_Stage_v3.2.sch</span>
          </div>

          <div className="diff-container" style={{ height: '360px', padding: '1rem' }}>
            <div className="diff-line diff-ctx">// NETLIST DEFINITION & REGISTERS</div>
            <div className="diff-line diff-ctx">// REVISION B3 (ECO-4921): Removed C402 & C404</div>
            <div className="diff-line diff-del">- NET "VNAV_3V3_PMIC" LOC "U401-PIN14";</div>
            <div className="diff-line diff-del">- // Total Rail Capacitance: 10uF (VIOLATES SPEC)</div>
            <div className="diff-line diff-ctx">#define PMIC_UVLO_THRESHOLD_REG 0x04</div>
            <div className="diff-line diff-del">- pmic_write_reg(0x04, 0x31); // Threshold 3.10V</div>
          </div>
        </div>

        {/* Patched Code */}
        <div className="cyber-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <h3 className="font-hud text-green" style={{ fontSize: '0.95rem' }}>
              HARDWARE ECO FIX & REGISTER PATCH
            </h3>
            <span className="cyber-badge cyber-badge-green">PROPOSED ECO REVISION</span>
          </div>

          <div className="diff-container" style={{ height: '360px', padding: '1rem' }}>
            <div className="diff-line diff-ctx">// HARDWARE FIX & ECO PATCH</div>
            <div className="diff-line diff-add">+ NET "VNAV_3V3_PMIC" LOC "U401-PIN14" ADD_CAP "C410_22uF";</div>
            <div className="diff-line diff-add">+ // Total Capacitance Restored to 54uF (PASSES SPEC)</div>
            <div className="diff-line diff-ctx">#define PMIC_UVLO_THRESHOLD_REG 0x04</div>
            <div className="diff-line diff-add">+ pmic_write_reg(0x04, 0x2E); // Threshold 2.95V (Safe)</div>
          </div>
        </div>

      </div>

      {/* Safety & Risk Summary Card */}
      <div className="cyber-card">
        <h4 className="font-hud text-cyan" style={{ fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          HARDWARE CIRCUIT SAFETY GUARANTEES
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CONFIDENCE SCORE</span>
            <div className="font-hud text-green" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>94%</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TRANSIENT STABILITY</span>
            <div className="font-hud text-cyan" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>3.28V Stable</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>THERMAL & VOLTAGE RISK</span>
            <div className="font-hud text-green" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>LOW</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>HARDWARE SIGN-OFF</span>
            <div className="font-hud text-yellow" style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>REQUIRED</div>
          </div>
        </div>
      </div>

    </div>
  );
}
