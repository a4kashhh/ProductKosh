import React, { useState, useEffect, useRef } from 'react';
import { graphNodesList, graphEdgesList } from '../data/seedData';
import { Network, Filter, Info, ShieldAlert, GitCommit, FileText, Bug, Search } from 'lucide-react';

export default function ContextGraph() {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState(graphNodesList);
  const [edges, setEdges] = useState(graphEdgesList);
  const [selectedNode, setSelectedNode] = useState(graphNodesList[4]); // BluetoothSession.restore()
  const [filterType, setFilterType] = useState('ALL');
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Types available
  const nodeTypes = ['ALL', 'REQUIREMENT', 'COMPONENT', 'FUNCTION', 'COMMIT', 'ISSUE', 'TEST', 'LOG'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const parent = canvas.parentElement;

    const width = parent.clientWidth || 800;
    const height = parent.clientHeight || 550;
    canvas.width = width;
    canvas.height = height;

    let animationId;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // Draw edges
      edges.forEach(e => {
        const fromNode = nodes.find(n => n.id === e.from);
        const toNode = nodes.find(n => n.id === e.to);
        if (!fromNode || !toNode) return;

        const fx = fromNode.x || width * fromNode.xPct;
        const fy = fromNode.y || height * fromNode.yPct;
        const tx = toNode.x || width * toNode.xPct;
        const ty = toNode.y || height * toNode.yPct;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        const cpX = (fx + tx) / 2;
        ctx.bezierCurveTo(cpX, fy, cpX, ty, tx, ty);

        if (e.relationship === 'INVOKES_RACE') {
          ctx.strokeStyle = 'rgba(255, 0, 85, 0.8)';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = '#ff0055';
          ctx.shadowBlur = 10;
        } else {
          ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.shadowBlur = 0;
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Relationship text
        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.fillStyle = e.relationship === 'INVOKES_RACE' ? '#ff0055' : '#8b949e';
        ctx.textAlign = 'center';
        ctx.fillText(e.relationship, (fx + tx) / 2, (fy + ty) / 2 - 4);
      });

      // Draw nodes
      nodes.forEach(n => {
        if (filterType !== 'ALL' && n.type !== filterType) return;

        const x = n.x || width * n.xPct;
        const y = n.y || height * n.yPct;
        const isSelected = selectedNode && selectedNode.id === n.id;

        let nodeColor = '#00f0ff';
        if (n.type === 'COMMIT') nodeColor = '#ffe600';
        if (n.type === 'ISSUE' || n.type === 'LOG') nodeColor = '#ff0055';
        if (n.type === 'TEST') nodeColor = '#00ff66';
        if (n.type === 'REQUIREMENT') nodeColor = '#9d4edd';

        // Selection ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, 24, 0, Math.PI * 2);
          ctx.strokeStyle = nodeColor;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Node main circle
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#080d1a';
        ctx.strokeStyle = nodeColor;
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Inner dot
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.fill();

        // Label
        ctx.font = '600 11px "Rajdhani", sans-serif';
        ctx.fillStyle = '#f0f6fc';
        ctx.textAlign = 'center';
        ctx.fillText(n.label, x, y + 28);

        ctx.font = '500 9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#8b949e';
        ctx.fillText(`[${n.type}]`, x, y + 40);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [nodes, edges, selectedNode, filterType]);

  // Handle canvas mouse interaction
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;

    const clicked = nodes.find(n => {
      const nx = n.x || w * n.xPct;
      const ny = n.y || h * n.yPct;
      const dist = Math.sqrt((mx - nx) ** 2 + (my - ny) ** 2);
      return dist <= 22;
    });

    if (clicked) {
      setSelectedNode(clicked);
      setDraggedNode(clicked);
      const nx = clicked.x || w * clicked.xPct;
      const ny = clicked.y || h * clicked.yPct;
      setDragOffset({ x: mx - nx, y: my - ny });
    }
  };

  const handleMouseMove = (e) => {
    if (!draggedNode || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    setNodes(prev => prev.map(n => {
      if (n.id === draggedNode.id) {
        return {
          ...n,
          x: mx - dragOffset.x,
          y: my - dragOffset.y,
          xPct: (mx - dragOffset.x) / canvas.width,
          yPct: (my - dragOffset.y) / canvas.height
        };
      }
      return n;
    }));
  };

  const handleMouseUp = () => setDraggedNode(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Filter Header Bar */}
      <div className="cyber-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Network size={20} className="text-cyan" />
          <h2 className="font-hud text-cyan" style={{ fontSize: '1.1rem' }}>
            ENGINEERING CONTEXT KNOWLEDGE GRAPH
          </h2>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {nodeTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`cyber-badge ${filterType === type ? 'cyber-badge-cyan' : ''}`}
              style={{
                cursor: 'pointer',
                background: filterType === type ? 'rgba(0,240,255,0.2)' : 'rgba(0,0,0,0.3)',
                border: '1px solid var(--cyber-border)',
                color: filterType === type ? 'var(--neon-cyan)' : 'var(--text-muted)'
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas & Inspector Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', height: '600px' }}>
        
        {/* Canvas Graph View */}
        <div className="cyber-card" style={{ padding: 0, position: 'relative', overflow: 'hidden', height: '100%' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ width: '100%', height: '100%', display: 'block', cursor: 'grab' }}
          />

          <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', pointerEvents: 'none' }}>
            <span className="cyber-badge cyber-badge-cyan">INTERACTIVE GRAPH — DRAG NODES TO INSPECT</span>
          </div>
        </div>

        {/* Node Detail Inspector Sidebar */}
        <div className="cyber-card cyber-card-pink" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--cyber-border)', paddingBottom: '0.75rem' }}>
            <Info size={18} className="text-pink" />
            <h3 className="font-hud text-pink" style={{ fontSize: '1rem' }}>NODE INSPECTOR</h3>
          </div>

          {selectedNode ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <span className="cyber-badge cyber-badge-cyan" style={{ fontSize: '0.68rem' }}>{selectedNode.type}</span>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '0.25rem' }}>{selectedNode.label}</h4>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                {selectedNode.description}
              </div>

              {selectedNode.sourceFile && (
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--cyber-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>SOURCE FILE</span>
                  <div className="font-mono text-cyan" style={{ fontSize: '0.78rem', marginTop: '0.15rem' }}>{selectedNode.sourceFile}</div>
                </div>
              )}

              {selectedNode.gitHistory && (
                <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.6rem', borderRadius: '4px', border: '1px solid var(--cyber-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>GIT REVISION</span>
                  <div className="font-mono text-yellow" style={{ fontSize: '0.78rem', marginTop: '0.15rem' }}>{selectedNode.gitHistory}</div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CONFIDENCE</span>
                  <div className="font-hud text-green" style={{ fontSize: '0.95rem' }}>{selectedNode.confidence || 95}%</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>LAST MODIFIED</span>
                  <div className="font-mono text-muted" style={{ fontSize: '0.78rem' }}>{selectedNode.lastModified || '2026-03-03'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text-dim)', textAlign: 'center', marginTop: '2rem' }}>
              Click any node on the graph to inspect structural relationships and context.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
