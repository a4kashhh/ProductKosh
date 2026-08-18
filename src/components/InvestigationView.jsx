import React, { useState, useEffect } from 'react';
import { activeIncident, originalCodeSnippet } from '../data/seedData';
import { Play, CheckCircle2, AlertTriangle, ShieldCheck, ArrowRight, GitCommit, FileText, Bug, Network, ActivitySquare, Cpu } from 'lucide-react';

export default function InvestigationView({ onGoToPatch, onGoToGraph }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(null);

  const reasoningSteps = [
    { num: '01', title: 'Parsing full-stack incident report & APM metrics', summary: 'Extracted key symptoms: 504 Gateway Timeout during peak 10,000 RPS traffic.' },
    { num: '02', title: 'Analyzing OpenTelemetry traces & DB connection logs', summary: 'Found APM Trace #TR-9901: FATAL connection pool exhaustion at 15:10:04.' },
    { num: '03', title: 'Tracing PostgreSQL connection pool exhaustion', summary: 'Database client handles remain unreleased when Redis cache misses occur.' },
    { num: '04', title: 'Mapping API routes, controllers, and Prisma ORM', summary: 'Mapped endpoint /api/v2/auth/verify to AuthService.validateToken().' },
    { num: '05', title: 'Traversing full-stack dependency graph', summary: 'Discovered missing try/finally connection release block in tokenController.ts.' },
    { num: '06', title: 'Comparing Git commit history & PR diffs', summary: 'Identified commit c91f04 (A. Vance) bypassing Redis cache on miss.' },
    { num: '07', title: 'Searching historical incident database', summary: 'Correlated with BUG-3049 (Intermittent token validation delay under load).' },
    { num: '08', title: 'Checking requirement relationships (REQ-104)', summary: 'Traced REQ-104 (Sub-200ms Auth Token Validation SLA under 10k RPS).' },
    { num: '09', title: 'Checking load test suite coverage', summary: 'Found existing test suite lacks connection leak detection under burst traffic.' },
    { num: '10', title: 'Generating full-stack root-cause hypothesis', summary: 'Hypothesis: Connection pool exhaustion caused by unreleased DB client handles.' },
    { num: '11', title: 'Validating hypothesis against context graph', summary: 'Hypothesis validated with 93% confidence score across 5 APM evidence vectors.' }
  ];

  const evidenceItems = [
    { id: 1, title: 'OpenTelemetry Trace #TR-9901: HTTP 504 Gateway Timeout', detail: 'APM trace shows 5000ms latency spike in API Gateway waiting on AuthService DB pool.', icon: ActivitySquare, type: 'APM_TRACE' },
    { id: 2, title: 'PostgreSQL Log: FATAL remaining connection slots reserved', detail: 'Database server log confirms 100/100 connection slots exhausted at 15:10:04.', icon: FileText, type: 'DB_LOG' },
    { id: 3, title: 'Git Commit c91f04 added direct DB query on cache miss', detail: 'Commit c91f04 bypassed Redis cache without adding a try/finally release block.', icon: GitCommit, type: 'COMMIT' },
    { id: 4, title: 'Historical Ticket BUG-3049 flagged memory & handle leak', detail: 'BUG-3049 noted connection handle growth during previous staging stress test.', icon: Bug, type: 'JIRA' },
    { id: 5, title: 'K6 Load Test TEST-AUTH-092 reproduces pool crash at 10k RPS', detail: 'K6 benchmark script reproduces 32% failure rate under 10,000 RPS burst load.', icon: Network, type: 'LOAD_TEST' }
  ];

  const handleStartInvestigation = () => {
    setIsSimulating(true);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    if (isSimulating && currentStepIndex < reasoningSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    } else if (currentStepIndex === reasoningSteps.length - 1) {
      setIsSimulating(false);
    }
  }, [isSimulating, currentStepIndex]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Banner */}
      <div className="cyber-card cyber-card-pink" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span className="cyber-badge cyber-badge-pink">AI REASONING ENGINE</span>
            <span className="cyber-badge cyber-badge-cyan">FULL-STACK SYSTEM DEMO</span>
          </div>
          <h2 className="font-hud text-pink glow-pink" style={{ fontSize: '1.25rem' }}>
            [ Investigation: {activeIncident.title} ]
          </h2>
        </div>

        <button 
          onClick={handleStartInvestigation} 
          disabled={isSimulating}
          className="cyber-btn cyber-btn-pink"
        >
          <Play size={16} />
          <span>{isSimulating ? 'Traversing Context Graph...' : 'Re-Run AI Investigation'}</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem' }}>
        
        {/* Left: 11-Stage Reasoning Steps */}
        <div className="cyber-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '720px', overflowY: 'auto' }}>
          <h3 className="font-hud text-cyan" style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            REASONING TRAVERSAL STEPS ({currentStepIndex + 1}/11)
          </h3>

          {reasoningSteps.map((step, idx) => {
            const isDone = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex && isSimulating;

            return (
              <div 
                key={idx}
                style={{
                  background: isCurrent ? 'rgba(0,240,255,0.12)' : isDone ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
                  border: isCurrent ? '1px solid var(--neon-cyan)' : isDone ? '1px solid var(--cyber-border)' : '1px solid transparent',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div className="font-mono text-cyan" style={{ fontSize: '0.75rem', opacity: isDone ? 1 : 0.4 }}>
                  {step.num}.
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isDone ? '#fff' : 'var(--text-dim)' }}>
                    {step.title}
                  </div>
                  {isDone && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: '1.3' }}>
                      {step.summary}
                    </div>
                  )}
                </div>
                {isDone && <CheckCircle2 size={14} className="text-green" style={{ flexShrink: 0, marginTop: '0.2rem' }} />}
              </div>
            );
          })}
        </div>

        {/* Right: Root Cause Identified Screen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Root Cause Card */}
          <div className="cyber-card cyber-card-pink" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 className="font-hud text-pink glow-pink" style={{ fontSize: '1.3rem' }}>
                FULL-STACK ROOT CAUSE IDENTIFIED
              </h3>
              <div className="cyber-badge cyber-badge-cyan" style={{ fontSize: '0.85rem' }}>
                AI CONFIDENCE: 93%
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '4px', borderLeft: '4px solid var(--neon-pink)', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>PRIMARY ROOT CAUSE</div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '0.25rem' }}>
                PostgreSQL Connection Leak in <span className="text-cyan">AuthService.validateToken()</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.5 }}>
                The regression correlates with <strong>Commit c91f04</strong>, which added direct database queries on Redis cache misses without a <code>try / finally client.release()</code> block. Under 10,000 RPS, unreleased DB connections exhaust the pool, triggering cascading 504 Gateway Timeouts.
              </p>
            </div>

            {/* Clickable Evidence List */}
            <h4 className="font-hud text-cyan" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              SUPPORTING APM EVIDENCE VECTORS (CLICK TO INSPECT)
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {evidenceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.id}
                    onClick={() => setShowEvidenceModal(item)}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid var(--cyber-border)',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="cyber-card-hover"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <Icon size={16} className="text-cyan" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{item.title}</span>
                    </div>
                    <span className="cyber-badge cyber-badge-purple" style={{ fontSize: '0.65rem' }}>{item.type}</span>
                  </div>
                );
              })}
            </div>

            {/* Causal Path Visualization */}
            <h4 className="font-hud text-purple" style={{ fontSize: '0.9rem', marginBottom: '0.75rem' }}>
              CAUSAL PROPAGATION CALL PATH
            </h4>

            <div style={{
              background: 'rgba(0,0,0,0.6)',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid var(--cyber-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              overflowX: 'auto'
            }}>
              <span className="text-cyan">10k RPS Burst</span>
              <span className="text-muted">➔</span>
              <span className="text-cyan">API Gateway</span>
              <span className="text-muted">➔</span>
              <span className="text-yellow">AuthService</span>
              <span className="text-muted">➔</span>
              <span className="text-purple">validateToken()</span>
              <span className="text-muted">➔</span>
              <span className="text-pink">Postgres Pool Exhausted</span>
              <span className="text-muted">➔</span>
              <span className="text-pink glow-pink">504 TIMEOUT</span>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={onGoToPatch} className="cyber-btn cyber-btn-pink">
                <ShieldCheck size={16} />
                <span>ANALYZE PROPOSED AI CODE PATCH & DIFF</span>
                <ArrowRight size={16} />
              </button>
              <button onClick={onGoToGraph} className="cyber-btn">
                <Network size={16} />
                <span>VIEW IN CONTEXT GRAPH</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Evidence Inspector Modal */}
      {showEvidenceModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="cyber-card cyber-card-pink" style={{ width: '560px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 className="font-hud text-pink">{showEvidenceModal.title}</h3>
              <span className="cyber-badge cyber-badge-cyan">{showEvidenceModal.type}</span>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1rem' }}>
              {showEvidenceModal.detail}
            </p>

            <div style={{ background: '#05070c', padding: '0.85rem', borderRadius: '4px', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              <pre>{originalCodeSnippet}</pre>
            </div>

            <button onClick={() => setShowEvidenceModal(null)} className="cyber-btn btn-sm">
              Close Inspector
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
