import React from 'react';
import { 
  LayoutDashboard, 
  SearchCode, 
  Network, 
  GitPullRequest, 
  Code2, 
  TestTube2, 
  FileCheck2, 
  Server, 
  GitBranch, 
  Bot, 
  Home,
  AlertTriangle,
  Zap,
  Activity
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuGroups = [
    {
      group: "FULL-STACK NAVIGATION",
      items: [
        { id: 'landing', label: 'Landing Page', icon: Home },
        { id: 'overview', label: 'Full-Stack Dashboard', icon: LayoutDashboard },
        { id: 'investigation', label: 'Incident & APM Investigation', icon: SearchCode, badge: '504 ALERT' },
        { id: 'graph', label: 'Full-Stack Context Graph', icon: Network },
      ]
    },
    {
      group: "ARCHITECTURE & REASONING",
      items: [
        { id: 'impact', label: 'Microservice Impact Analysis', icon: GitPullRequest },
        { id: 'patch', label: 'Full-Stack Patch & Code Diff', icon: Code2 },
        { id: 'tests', label: 'Load Test Suite Simulator', icon: TestTube2 },
        { id: 'traceability', label: 'Full-Stack Requirements', icon: FileCheck2 },
      ]
    },
    {
      group: "SERVICES & CLOUD",
      items: [
        { id: 'vehicle', label: 'Cloud Microservices View', icon: Server },
        { id: 'timeline', label: 'Git Revision Timeline', icon: GitBranch },
        { id: 'assistant', label: 'Full-Stack AI Copilot', icon: Bot },
      ]
    }
  ];

  return (
    <aside style={{
      width: '270px',
      background: 'var(--cyber-bg-alt)',
      borderRight: '1px solid var(--cyber-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '1.25rem 0.75rem',
      gap: '1.5rem',
      flexShrink: 0
    }}>
      {menuGroups.map((group, idx) => (
        <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <span className="font-hud" style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: 'var(--text-dim)',
            letterSpacing: '0.08em',
            paddingLeft: '0.75rem',
            marginBottom: '0.2rem'
          }}>
            {group.group}
          </span>
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '4px',
                  border: 'none',
                  background: isActive ? 'rgba(0, 240, 255, 0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--neon-cyan)' : '3px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Icon size={16} className={isActive ? 'text-cyan' : ''} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="cyber-badge cyber-badge-pink" style={{ fontSize: '0.6rem', padding: '0.1rem 0.35rem' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* Incident Box Banner */}
      <div className="cyber-card cyber-card-pink" style={{ marginTop: 'auto', padding: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neon-pink)', fontSize: '0.8rem', fontWeight: 700 }}>
          <AlertTriangle size={14} />
          <span>ACTIVE INCIDENT</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem', lineHeight: '1.4' }}>
          504 Gateway Timeout & Database Connection Leak under 10k RPS
        </div>
        <button
          onClick={() => setActiveTab('investigation')}
          className="cyber-btn cyber-btn-pink"
          style={{ marginTop: '0.6rem', width: '100%', fontSize: '0.75rem', padding: '0.4rem 0.6rem' }}
        >
          Investigate System →
        </button>
      </div>
    </aside>
  );
}
