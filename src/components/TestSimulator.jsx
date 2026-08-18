import React, { useState } from 'react';
import { TestTube2, CheckCircle2, Play, RefreshCw, ArrowRight, ActivitySquare } from 'lucide-react';

export default function TestSimulator({ onGoToTraceability }) {
  const [isRunning, setIsRunning] = useState(false);
  const [testStage, setTestStage] = useState('BEFORE_PATCH'); // BEFORE_PATCH, EXECUTING, AFTER_PATCH

  const regressionTests = [
    { id: 'HW-REG-01', name: '3.3V Power Rail Transient Voltage Sweep during 22A/µs Wake', statusBefore: 'FAIL (SAG TO 2.85V)', statusAfter: 'PASS (3.28V STABLE)' },
    { id: 'HW-REG-02', name: 'PMIC Under-Voltage Lockout (UVLO) Threshold Verification', statusBefore: 'FAIL (UVLO RESET)', statusAfter: 'PASS (NO RESET)' },
    { id: 'HW-REG-03', name: 'MCU Hardware Reset Pin (NRST) Pulse Hold Time', statusBefore: 'FAIL (INTERMITTENT PULSE)', statusAfter: 'PASS (STABLE HIGH)' },
    { id: 'HW-REG-04', name: 'CAN-FD Transceiver Differential Voltage Isolation Test', statusBefore: 'PASS', statusAfter: 'PASS' },
    { id: 'HW-REG-05', name: 'Repeated Rapid Transient Switching Stress (500 Cycles)', statusBefore: 'FAIL (RESET ON CYC 14)', statusAfter: 'PASS (500/500 CYCLES)' }
  ];

  const handleRunValidation = () => {
    setIsRunning(true);
    setTestStage('EXECUTING');

    setTimeout(() => {
      setIsRunning(false);
      setTestStage('AFTER_PATCH');
    }, 2200);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="cyber-card cyber-card-pink" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="cyber-badge cyber-badge-green">HARDWARE TEST BENCH</span>
            <span className="cyber-badge cyber-badge-cyan">5 HARDWARE REGRESSION SUITES</span>
          </div>
          <h2 className="font-hud text-green glow-green" style={{ fontSize: '1.25rem' }}>
            [ Hardware Test Bench & Oscilloscope Signal Validation ]
          </h2>
        </div>

        <button
          onClick={handleRunValidation}
          disabled={isRunning}
          className="cyber-btn cyber-btn-purple"
        >
          <Play size={16} />
          <span>{isRunning ? 'Running Hardware Test Bench...' : 'Execute Hardware Test Validation'}</span>
        </button>
      </div>

      {/* Score & Oscilloscope Waveform Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        
        {/* Score Before */}
        <div className="cyber-card cyber-card-pink">
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OSCILLOSCOPE BEFORE ECO FIX</span>
          <div className="font-hud text-pink glow-pink" style={{ fontSize: '2.5rem', marginTop: '0.3rem' }}>
            47 / 50 <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>PASS</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--neon-pink)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            CH1: 3.3V Rail sags to 2.85V (Triggers UVLO Reset)
          </div>
        </div>

        {/* Score After */}
        <div className="cyber-card">
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>OSCILLOSCOPE AFTER ECO FIX (C410 RESTORED)</span>
          <div className="font-hud text-green glow-green" style={{ fontSize: '2.5rem', marginTop: '0.3rem' }}>
            {testStage === 'AFTER_PATCH' ? '50 / 50' : '47 / 50'} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>PASS</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: testStage === 'AFTER_PATCH' ? 'var(--neon-green)' : 'var(--neon-yellow)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            {testStage === 'AFTER_PATCH' ? 'CH1: 3.3V Rail stays at 3.28V (Stable Regulation)' : 'PENDING TEST BENCH EXECUTION'}
          </div>
        </div>

      </div>

      {/* Test Matrix Cards */}
      <div className="cyber-card">
        <h3 className="font-hud text-cyan" style={{ fontSize: '1.05rem', marginBottom: '1rem' }}>
          HARDWARE TEST BENCH REGRESSION CASES
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {regressionTests.map((t) => {
            const isPassedAfter = testStage === 'AFTER_PATCH';

            return (
              <div
                key={t.id}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--cyber-border)',
                  padding: '0.85rem 1.25rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <ActivitySquare size={18} className="text-cyan" />
                  <div>
                    <span className="font-mono text-cyan" style={{ fontSize: '0.75rem' }}>{t.id}</span>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginTop: '0.1rem' }}>{t.name}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="cyber-badge cyber-badge-pink" style={{ fontSize: '0.7rem' }}>
                    BEFORE: {t.statusBefore}
                  </span>

                  <span className={`cyber-badge ${isPassedAfter ? 'cyber-badge-green' : 'cyber-badge-yellow'}`} style={{ fontSize: '0.7rem' }}>
                    AFTER: {isPassedAfter ? t.statusAfter : 'PENDING'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {testStage === 'AFTER_PATCH' && (
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onGoToTraceability} className="cyber-btn cyber-btn-pink">
              <span>View Hardware Requirements Traceability Matrix</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
