import React, { useState } from 'react';
import { Bot, Send, Sparkles, FileText, GitCommit, Bug } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello. I am the **ContextForge AI Assistant**. I have fully indexed the Vehicle Connectivity Stack repository, including 15 requirements, 48,321 LOC, 25 commits, and crash logs. Ask me any question about architecture, root cause analysis, or change impact.'
    },
    {
      sender: 'user',
      text: 'Why did this regression appear after the power-management refactor?'
    },
    {
      sender: 'ai',
      text: 'The regression correlates directly with **Commit a83f21** (authored by M. Weber), which reordered the wake lifecycle execution sequence. `BluetoothSession.restore()` now triggers before `PowerManager` reaches the `ACTIVE` state. Under partial wake conditions, this produces a SIGSEGV race condition.',
      citations: [
        { label: 'Commit a83f21', type: 'COMMIT' },
        { label: 'WakeHandler.cpp:L42', type: 'CODE' },
        { label: 'BUG-1842', type: 'ISSUE' },
        { label: 'REQ-142', type: 'REQUIREMENT' }
      ]
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg = { sender: 'user', text: inputVal };
    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      const aiReply = {
        sender: 'ai',
        text: `Based on graph traversal across **REQ-142** and **PowerManager.cpp**, the failure is isolated to the lifecycle state transition. Re-synchronizing session restoration after power rails stabilize guarantees 100% test pass rate.`,
        citations: [
          { label: 'PowerManager.cpp', type: 'CODE' },
          { label: 'TEST-BT-031', type: 'TEST' }
        ]
      };
      setMessages(prev => [...prev, aiReply]);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '640px' }}>
      
      <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Bot size={20} className="text-cyan" />
          <h2 className="font-hud text-cyan" style={{ fontSize: '1.1rem' }}>
            CONTEXT-AWARE ENGINEERING AI COPILOT
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-purple">EVIDENCE CITATION ENGINE ENABLED</span>
      </div>

      {/* Messages Box */}
      <div className="cyber-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflowY: 'auto', gap: '1rem' }}>
        {messages.map((m, idx) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: m.sender === 'user' ? 'rgba(0, 240, 255, 0.12)' : 'rgba(0, 0, 0, 0.4)',
              border: m.sender === 'user' ? '1px solid var(--neon-cyan)' : '1px solid var(--cyber-border)',
              padding: '0.85rem 1.1rem',
              borderRadius: '4px'
            }}
          >
            <div style={{ fontSize: '0.72rem', color: m.sender === 'user' ? 'var(--neon-cyan)' : 'var(--neon-purple)', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem', fontWeight: 700 }}>
              {m.sender === 'user' ? 'SYSTEM ENGINEER' : 'CONTEXTFORGE REASONING ENGINE'}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#fff', lineHeight: '1.5' }}>
              {m.text}
            </div>

            {m.citations && (
              <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Citations:</span>
                {m.citations.map((c, cIdx) => (
                  <span key={cIdx} className="cyber-badge cyber-badge-cyan" style={{ fontSize: '0.62rem' }}>
                    📌 {c.label} ({c.type})
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.85rem' }}>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask a context-aware question about code, REQs, Git history, or bugs..."
          style={{
            flex: 1,
            background: 'rgba(8, 14, 28, 0.9)',
            border: '1px solid var(--cyber-border)',
            color: '#fff',
            padding: '0.75rem 1rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />
        <button type="submit" className="cyber-btn cyber-btn-pink">
          <Send size={16} />
          <span>Ask Copilot</span>
        </button>
      </form>

    </div>
  );
}
