/**
 * AetherFlow AI - Interactive DAG & Multi-Agent Simulator Engine
 */

export class WorkflowEngine {
  constructor(canvasId, consoleId, artifactId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.consoleEl = document.getElementById(consoleId);
    this.artifactId = artifactId;
    
    this.isRunning = false;
    this.currentPreset = 'report-synthesis';
    this.nodes = [];
    this.edges = [];
    this.particles = [];
    this.selectedNode = null;
    this.draggedNode = null;
    this.dragOffset = { x: 0, y: 0 };
    
    this.initCanvas();
    this.attachMouseEvents();
  }

  initCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    
    // Set actual render resolution to match container dimensions
    const width = parent.clientWidth || 700;
    const height = parent.clientHeight || 480;
    
    this.canvas.width = width;
    this.canvas.height = height;

    this.setupNodes(this.currentPreset);

    window.addEventListener('resize', () => {
      if (!this.canvas || !this.canvas.parentElement) return;
      const w = this.canvas.parentElement.clientWidth || 700;
      const h = this.canvas.parentElement.clientHeight || 480;
      this.canvas.width = w;
      this.canvas.height = h;
      this.repositionNodes();
      this.draw();
    });

    this.startAnimationLoop();
  }

  setupNodes(presetKey) {
    this.currentPreset = presetKey;
    const w = this.canvas.width || 700;
    const h = this.canvas.height || 480;

    let rawNodes = [];
    if (presetKey === 'report-synthesis') {
      rawNodes = [
        { id: 'n1', label: 'Goal Ingestion', role: 'Planner Agent', status: 'idle', xPct: 0.15, yPct: 0.5, desc: 'Ingests human objective, parses constraints, and builds runtime execution plan.' },
        { id: 'n2', label: 'API & DB Harvester', role: 'Data Harvester', status: 'idle', xPct: 0.4, yPct: 0.28, desc: 'Fetches external payloads, queries vector database, and gathers raw context.' },
        { id: 'n3', label: 'Schema Validator', role: 'Validator Agent', status: 'idle', xPct: 0.4, yPct: 0.72, desc: 'Inspects data format integrity and triggers self-healing on schema mismatch.' },
        { id: 'n4', label: 'Report Synthesizer', role: 'Synthesizer Agent', status: 'idle', xPct: 0.7, yPct: 0.5, desc: 'Combines multi-source insights into executive markdown and JSON artifacts.' },
        { id: 'n5', label: 'Artifact Sandbox', role: 'Export System', status: 'idle', xPct: 0.9, yPct: 0.5, desc: 'Persists generated artifact into sandbox storage and dispatches webhooks.' }
      ];
      this.edges = [
        { from: 'n1', to: 'n2' },
        { from: 'n1', to: 'n3' },
        { from: 'n2', to: 'n4' },
        { from: 'n3', to: 'n4' },
        { from: 'n4', to: 'n5' }
      ];
    } else if (presetKey === 'market-audit') {
      rawNodes = [
        { id: 'n1', label: 'Competitor Scraper', role: 'Harvester Agent', status: 'idle', xPct: 0.18, yPct: 0.35, desc: 'Scrapes competitor landing pages and product feature matrices.' },
        { id: 'n2', label: 'Sentiment Classifier', role: 'NLP Agent', status: 'idle', xPct: 0.18, yPct: 0.65, desc: 'Analyzes user reviews and social sentiment signals.' },
        { id: 'n3', label: 'Anomaly Detector', role: 'Validator Agent', status: 'idle', xPct: 0.52, yPct: 0.5, desc: 'Validates statistical outliers and filters out noise.' },
        { id: 'n4', label: 'Executive Brief', role: 'Synthesizer Agent', status: 'idle', xPct: 0.85, yPct: 0.5, desc: 'Generates strategic market recommendations for leadership.' }
      ];
      this.edges = [
        { from: 'n1', to: 'n3' },
        { from: 'n2', to: 'n3' },
        { from: 'n3', to: 'n4' }
      ];
    } else {
      // code-refactor
      rawNodes = [
        { id: 'n1', label: 'AST Parser', role: 'Code Inspector', status: 'idle', xPct: 0.18, yPct: 0.5, desc: 'Parses codebase abstract syntax tree to identify refactoring targets.' },
        { id: 'n2', label: 'Vulnerability Audit', role: 'Security Agent', status: 'idle', xPct: 0.48, yPct: 0.3, desc: 'Scans for OWASP vulnerabilities and hardcoded credentials.' },
        { id: 'n3', label: 'Auto-Patcher', role: 'Refactor Agent', status: 'idle', xPct: 0.48, yPct: 0.7, desc: 'Generates type-safe patches and code edits.' },
        { id: 'n4', label: 'Unit Test Runner', role: 'Validator Agent', status: 'idle', xPct: 0.82, yPct: 0.5, desc: 'Executes automated test suite to guarantee zero regression.' }
      ];
      this.edges = [
        { from: 'n1', to: 'n2' },
        { from: 'n1', to: 'n3' },
        { from: 'n2', to: 'n4' },
        { from: 'n3', to: 'n4' }
      ];
    }

    this.nodes = rawNodes.map(n => ({
      ...n,
      x: w * n.xPct,
      y: h * n.yPct,
      radius: 18
    }));

    this.selectedNode = this.nodes[0];
    this.updateOverlayInfo(this.selectedNode);
  }

  repositionNodes() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    this.nodes.forEach(n => {
      n.x = w * n.xPct;
      n.y = h * n.yPct;
    });
  }

  attachMouseEvents() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const clicked = this.nodes.find(n => {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
      });

      if (clicked) {
        this.selectedNode = clicked;
        this.draggedNode = clicked;
        this.dragOffset = { x: mouseX - clicked.x, y: mouseY - clicked.y };
        this.updateOverlayInfo(clicked);
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Handle dragging
      if (this.draggedNode) {
        this.draggedNode.x = mouseX - this.dragOffset.x;
        this.draggedNode.y = mouseY - this.dragOffset.y;
        this.draggedNode.xPct = this.draggedNode.x / this.canvas.width;
        this.draggedNode.yPct = this.draggedNode.y / this.canvas.height;
        return;
      }

      // Handle hover cursor
      const hovered = this.nodes.some(n => {
        const dx = mouseX - n.x;
        const dy = mouseY - n.y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 6;
      });
      this.canvas.style.cursor = hovered ? 'pointer' : 'default';
    });

    window.addEventListener('mouseup', () => {
      this.draggedNode = null;
    });
  }

  updateOverlayInfo(node) {
    const titleEl = document.getElementById('node-detail-title');
    const descEl = document.getElementById('node-detail-desc');
    if (!titleEl || !descEl) return;

    if (node) {
      titleEl.innerHTML = `🤖 Node: <span style="color:#fff">${node.label}</span> <span style="font-size:0.75rem; color: var(--accent-cyan);">[${node.role}]</span>`;
      descEl.innerText = `${node.desc} (Status: ${node.status.toUpperCase()})`;
    }
  }

  startAnimationLoop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    const loop = () => {
      this.updateParticles();
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  updateParticles() {
    if (this.isRunning) {
      this.edges.forEach(e => {
        const fromNode = this.nodes.find(n => n.id === e.from);
        const toNode = this.nodes.find(n => n.id === e.to);
        if (fromNode && toNode && fromNode.status === 'completed' && (toNode.status === 'active' || toNode.status === 'completed')) {
          if (Math.random() < 0.18) {
            this.particles.push({
              x: fromNode.x,
              y: fromNode.y,
              targetX: toNode.x,
              targetY: toNode.y,
              progress: 0,
              speed: 0.035 + Math.random() * 0.02
            });
          }
        }
      });
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.progress += p.speed;
      p.x = p.x + (p.targetX - p.x) * p.speed;
      p.y = p.y + (p.targetY - p.y) * p.speed;
      if (p.progress >= 1) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Draw grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 28;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw edges
    this.edges.forEach(e => {
      const fromNode = this.nodes.find(n => n.id === e.from);
      const toNode = this.nodes.find(n => n.id === e.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      const cpX = (fromNode.x + toNode.x) / 2;
      ctx.bezierCurveTo(cpX, fromNode.y, cpX, toNode.y, toNode.x, toNode.y);

      if (fromNode.status === 'completed' && toNode.status === 'active') {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
      } else if (fromNode.status === 'completed' && toNode.status === 'completed') {
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      } else {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 0;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    });

    // Draw particles
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw nodes
    this.nodes.forEach(n => {
      ctx.save();
      ctx.translate(n.x, n.y);

      let nodeColor = '#64748b';
      let glowColor = 'transparent';

      if (n.status === 'active') {
        nodeColor = '#38bdf8';
        glowColor = 'rgba(56, 189, 248, 0.5)';
      } else if (n.status === 'completed') {
        nodeColor = '#34d399';
        glowColor = 'rgba(52, 211, 153, 0.35)';
      } else if (n.status === 'healing') {
        nodeColor = '#fb923c';
        glowColor = 'rgba(251, 146, 60, 0.5)';
      }

      const isSelected = this.selectedNode && this.selectedNode.id === n.id;

      // Selection Ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(0, 0, n.radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Outer glow circle
      if (n.status === 'active' || n.status === 'healing') {
        ctx.beginPath();
        ctx.arc(0, 0, n.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = glowColor;
        ctx.fill();
      }

      // Main node circle
      ctx.beginPath();
      ctx.arc(0, 0, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();

      // Node text labels
      ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, 0, 32);

      ctx.font = '500 10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`[${n.role}]`, 0, 45);

      ctx.restore();
    });
  }

  log(msg, type = 'info') {
    if (!this.consoleEl) return;
    const timeStr = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="time">[${timeStr}]</span> ${msg}`;
    this.consoleEl.appendChild(entry);
    this.consoleEl.scrollTop = this.consoleEl.scrollHeight;
  }

  async runPreset(presetKey) {
    if (this.isRunning) return;
    this.isRunning = true;

    this.setupNodes(presetKey);
    this.consoleEl.innerHTML = '';
    this.log(`🚀 Starting execution sequence for workflow: <strong>${presetKey}</strong>`, 'info');

    const statusEl = document.getElementById('workflow-status');
    if (statusEl) {
      statusEl.innerText = 'RUNNING';
      statusEl.className = 'metric-value text-cyan';
    }

    const updateStepCounter = (current, total) => {
      const el = document.getElementById('workflow-step-count');
      if (el) el.innerText = `${current} / ${total}`;
    };

    const totalSteps = this.nodes.length;
    updateStepCounter(0, totalSteps);

    // Step through nodes
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      node.status = 'active';
      this.selectedNode = node;
      this.updateOverlayInfo(node);
      updateStepCounter(i + 1, totalSteps);

      this.log(`📍 <strong>${node.role}</strong> initialized: <em>"${node.label}"</em>`, 'action');
      await this.sleep(800);

      if (i === 0) {
        this.log(`🧠 [Planner Thought] Synthesizing objective into Directed Acyclic Graph topology...`, 'thought');
        this.log(`✅ [Planner] Validated schema. Model cascading routed step 2 to Flash-Lite (Saved 3,400 tokens).`, 'success');
        const tokenEl = document.getElementById('token-saved-val');
        if (tokenEl) tokenEl.innerText = '3,400 tokens';
      } else if (i === 1) {
        this.log(`🧠 [Data Harvester Thought] Fetching unstructured JSON payloads & query vectors...`, 'thought');
        this.log(`⚡ [Tool Exec] API GET request status 200 OK (142ms latency).`, 'info');
      } else if (i === 2) {
        this.log(`⚠️ [Validator Warning] Detected missing property 'schema_ver' in incoming payload.`, 'warning');
        node.status = 'healing';
        this.log(`🛡️ [Self-Healing Engine] Triggering automatic parameter fallback & schema repair...`, 'action');
        const retryEl = document.getElementById('retries-val');
        if (retryEl) retryEl.innerText = '1';
        await this.sleep(1000);
        this.log(`✅ [Self-Healing Engine] Anomaly resolved cleanly. Re-integrating output graph.`, 'success');
      } else if (i === 3) {
        this.log(`🧠 [Synthesizer Thought] Compiling multi-modal decision intelligence artifact...`, 'thought');
        const tokenEl = document.getElementById('token-saved-val');
        if (tokenEl) tokenEl.innerText = '5,800 tokens';
      }

      await this.sleep(900);
      node.status = 'completed';
    }

    this.isRunning = false;
    if (statusEl) {
      statusEl.innerText = 'COMPLETED';
      statusEl.className = 'metric-value text-green';
    }

    this.log(`🎉 Workflow completed successfully! Artifact generated in Sandbox.`, 'success');
    this.renderArtifactOutput(presetKey);
  }

  renderArtifactOutput(presetKey) {
    const box = document.getElementById(this.artifactId);
    if (!box) return;

    if (presetKey === 'report-synthesis') {
      box.innerHTML = `
        <div style="font-family: var(--font-sans);">
          <h4 style="color: var(--accent-cyan); font-size: 1rem; margin-bottom: 0.5rem;">📊 Executive Decision Intelligence Artifact</h4>
          <p style="margin-bottom: 0.75rem; color: var(--text-muted);">Generated by <strong>AetherFlow AI Multi-Agent Engine</strong> in 3.4 seconds.</p>
          <hr style="border-color: var(--border-color); margin-bottom: 0.75rem;" />
          <div style="background: rgba(255,255,255,0.03); padding: 0.75rem; border-radius: 6px; font-family: var(--font-mono); font-size: 0.78rem;">
            <pre style="color: #a5b4fc;">{
  "workflow_id": "wf_synth_9921",
  "status": "SUCCESS",
  "agents_involved": ["Planner", "Harvester", "Validator", "Synthesizer"],
  "self_healing_events": 1,
  "confidence_score": 0.994,
  "token_savings_pct": 62.4,
  "insights": [
    "Enterprise pipeline efficiency improved by 10x",
    "Self-healing successfully resolved schema anomaly on Node 3",
    "Ready for zero-downtime deployment"
  ]
}</pre>
          </div>
        </div>
      `;
    } else {
      box.innerHTML = `
        <div>
          <h4 style="color: var(--accent-purple); font-size: 1rem; margin-bottom: 0.5rem;">⚡ Task Execution Artifact (${presetKey})</h4>
          <p style="color: var(--accent-green); font-weight: 600;">Status: 100% Verified & Validated</p>
        </div>
      `;
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
