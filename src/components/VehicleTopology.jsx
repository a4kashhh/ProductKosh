import React, { useState } from 'react';
import { Server, Cpu, ShieldCheck, AlertTriangle, Zap, Activity, Database, Layers } from 'lucide-react';

export default function VehicleTopology() {
  const [selectedService, setSelectedService] = useState({
    name: "Auth Microservice",
    type: "Node.js / Express API Service",
    protocol: "gRPC / HTTP2",
    status: "INCIDENT_ACTIVE",
    coverage: "88%",
    openIssues: 3,
    health: "89%"
  });

  const microservicesHierarchy = [
    {
      domain: "API & Gateway Layer",
      services: [
        { name: "API Gateway Router", status: "HEALTHY", coverage: "94%", health: "98%" },
        { name: "Auth Microservice", status: "INCIDENT_ACTIVE", coverage: "88%", health: "89%" },
        { name: "User Service", status: "HEALTHY", coverage: "91%", health: "96%" }
      ]
    },
    {
      domain: "Core Business & Payment Services",
      services: [
        { name: "Payment Engine Service", status: "HEALTHY", coverage: "96%", health: "99%" },
        { name: "Notification Worker", status: "HEALTHY", coverage: "89%", health: "97%" }
      ]
    },
    {
      domain: "Data & Caching Infrastructure",
      services: [
        { name: "PostgreSQL Primary Pool", status: "HEALTHY", coverage: "92%", health: "95%" },
        { name: "Redis Distributed Cache Cluster", status: "HEALTHY", coverage: "95%", health: "99%" }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Server size={20} className="text-cyan" />
          <h2 className="font-hud text-cyan" style={{ fontSize: '1.1rem' }}>
            CLOUD MICROSERVICES & FULL-STACK ARCHITECTURE
          </h2>
        </div>
        <span className="cyber-badge cyber-badge-cyan">ENTERPRISE CLOUD STACK</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
        
        {/* Microservices Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {microservicesHierarchy.map((domain, idx) => (
            <div key={idx} className="cyber-card">
              <h3 className="font-hud text-purple" style={{ fontSize: '0.95rem', marginBottom: '0.85rem' }}>
                [ {domain.domain} ]
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
                {domain.services.map((svc, eIdx) => (
                  <div
                    key={eIdx}
                    onClick={() => setSelectedService(svc)}
                    style={{
                      background: svc.status === 'INCIDENT_ACTIVE' ? 'rgba(255,0,85,0.1)' : 'rgba(0,0,0,0.4)',
                      border: svc.status === 'INCIDENT_ACTIVE' ? '1px solid var(--neon-pink)' : '1px solid var(--cyber-border)',
                      padding: '0.85rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    className="cyber-card-hover"
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>{svc.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      <span className={`cyber-badge ${svc.status === 'INCIDENT_ACTIVE' ? 'cyber-badge-pink' : 'cyber-badge-green'}`} style={{ fontSize: '0.62rem' }}>
                        {svc.status}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Health: {svc.health}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Service Telemetry Inspector Sidebar */}
        <div className="cyber-card cyber-card-pink">
          <h3 className="font-hud text-pink" style={{ fontSize: '1rem', marginBottom: '1rem' }}>
            SERVICE INSPECTOR
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <span className="cyber-badge cyber-badge-cyan">{selectedService.name}</span>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Node.js / Express microservice handling user authentication & token verification.
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '4px', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Health Score</span>
                <span className="font-mono text-cyan">{selectedService.health}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span>Test Coverage</span>
                <span className="font-mono text-green">{selectedService.coverage}</span>
              </div>
            </div>

            {selectedService.status === 'INCIDENT_ACTIVE' && (
              <div style={{ background: 'rgba(255,0,85,0.12)', border: '1px solid var(--neon-pink)', padding: '0.75rem', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--neon-pink)', fontSize: '0.8rem', fontWeight: 700 }}>
                  <AlertTriangle size={14} />
                  <span>Active Anomaly Alert</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  PostgreSQL connection leak in AuthService tokenController.ts causing 504 Gateway Timeouts under load.
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
