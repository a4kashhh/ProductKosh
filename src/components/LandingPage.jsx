import React from 'react';
import { Cpu, Network, ShieldCheck, Zap, ArrowRight, Activity, Terminal, Server } from 'lucide-react';

export default function LandingPage({ onExplore, onInvestigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', padding: '1rem 0' }}>
      
      {/* Hero Section */}
      <div className="cyber-card cyber-card-pink" style={{
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, rgba(8,14,28,0.95) 0%, rgba(20,8,30,0.95) 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(0,240,255,0.18) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="cyber-badge cyber-badge-pink">SYSTEM INTELLIGENCE PLATFORM</span>
          <span className="cyber-badge cyber-badge-cyan">Full-Stack Context Reasoning</span>
        </div>

        <h1 className="font-hud glow-cyan" style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1.1, textTransform: 'uppercase' }}>
          ContextForge <span className="text-pink glow-pink">AI</span>
        </h1>

        <p className="font-sub" style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--neon-cyan)', maxWidth: '850px' }}>
          "The engineering intelligence layer between code, APIs, databases, and microservices architecture."
        </p>

        <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: '1.6', maxWidth: '900px' }}>
          Traditional AI coding tools only look at single files in isolation. <strong>ContextForge AI</strong> connects Software Requirements, Microservices Architecture, Node.js/React Source Code, PostgreSQL Schemas, Git History, Issue Trackers, Automated Tests, and OpenTelemetry Distributed Traces into a unified <strong>Full-Stack Context Knowledge Graph</strong> to diagnose complex system anomalies with explainable evidence.
        </p>

        {/* Core Statement Box */}
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          borderLeft: '4px solid var(--neon-cyan)',
          padding: '1rem 1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.92rem',
          color: '#fff'
        }}>
          <code>"Code tells you what the API does. Context tells you why the distributed full-stack system behaves that way."</code>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.5rem' }}>
          <button onClick={onInvestigate} className="cyber-btn cyber-btn-pink">
            <Zap size={18} />
            <span>Launch Live Full-Stack Investigation Demo</span>
            <ArrowRight size={18} />
          </button>
          <button onClick={onExplore} className="cyber-btn">
            <Network size={18} />
            <span>Explore Context Knowledge Graph</span>
          </button>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <div className="cyber-card">
          <div style={{ color: 'var(--neon-cyan)', marginBottom: '0.85rem' }}><Network size={32} /></div>
          <h3 className="font-hud" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Unified Context Graph</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Traverses non-obvious relationships across SLA Requirements, Express Controllers, PostgreSQL Queries, Git PRs, and OpenTelemetry Traces.
          </p>
        </div>

        <div className="cyber-card">
          <div style={{ color: 'var(--neon-purple)', marginBottom: '0.85rem' }}><Terminal size={32} /></div>
          <h3 className="font-hud" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Root-Cause & APM Evidence</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Diagnoses 504 Timeouts and Database Connection Leaks with 93% confidence, clickable APM evidence citations, and causal call paths.
          </p>
        </div>

        <div className="cyber-card">
          <div style={{ color: 'var(--neon-green)', marginBottom: '0.85rem' }}><ShieldCheck size={32} /></div>
          <h3 className="font-hud" style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Code Patch & Load Validation</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Proposes type-safe Node.js / Prisma ORM patches, running 10,000 RPS load tests to verify 100% pass rates before production deployment.
          </p>
        </div>
      </div>

      {/* Cyberpunk Architecture Flow Visual */}
      <div className="cyber-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 className="font-hud text-cyan" style={{ fontSize: '1.1rem' }}>FULL-STACK CONTEXT PIPELINE TOPOLOGY</h3>
          <span className="cyber-badge cyber-badge-green">CLOUD MICROSERVICES READY</span>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.6)',
          padding: '1.5rem',
          borderRadius: '4px',
          border: '1px solid var(--cyber-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflowX: 'auto'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--neon-cyan)' }}>
            <div>📄 Requirements</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>REQ-104</div>
          </div>
          <div style={{ color: 'var(--text-dim)' }}>➔</div>
          <div style={{ textAlign: 'center', color: 'var(--neon-purple)' }}>
            <div>🚀 API Gateway</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Express Router</div>
          </div>
          <div style={{ color: 'var(--text-dim)' }}>➔</div>
          <div style={{ textAlign: 'center', color: 'var(--neon-cyan)' }}>
            <div>💻 Auth Service</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>tokenController.ts</div>
          </div>
          <div style={{ color: 'var(--text-dim)' }}>➔</div>
          <div style={{ textAlign: 'center', color: 'var(--neon-pink)' }}>
            <div>🗄️ PostgreSQL DB</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Pool Leaked #9901</div>
          </div>
          <div style={{ color: 'var(--text-dim)' }}>➔</div>
          <div style={{ textAlign: 'center', color: 'var(--neon-yellow)' }}>
            <div>🕸️ Context Engine</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Knowledge Graph</div>
          </div>
          <div style={{ color: 'var(--text-dim)' }}>➔</div>
          <div style={{ textAlign: 'center', color: 'var(--neon-green)' }}>
            <div>🛡️ Validated Patch</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>10k RPS 100% Pass</div>
          </div>
        </div>
      </div>

    </div>
  );
}
