import './style.css';
import { formAnswers, calculateTextMetrics } from './answersData.js';
import { WorkflowEngine } from './workflowEngine.js';

let workflowEngine = null;

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  renderFormAssistantCards();
  initFormReplica();
  initQuickCopyAll();
  
  // Initialize Canvas Workflow Engine
  workflowEngine = new WorkflowEngine('dag-canvas', 'log-console', 'artifact-preview-box');

  // Workflow Config Controls
  const runBtn = document.getElementById('run-workflow-btn');
  const presetSelect = document.getElementById('preset-select');

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      const preset = presetSelect ? presetSelect.value : 'report-synthesis';
      workflowEngine.runPreset(preset);
    });
  }

  if (presetSelect) {
    presetSelect.addEventListener('change', (e) => {
      workflowEngine.setupNodes(e.target.value);
      workflowEngine.draw();
      showToast(`Switched workflow template to: ${e.target.options[e.target.selectedIndex].text}`);
    });
  }

  // Subtab navigation inside log panel
  const subtabs = document.querySelectorAll('.subtab-btn');
  subtabs.forEach(btn => {
    btn.addEventListener('click', () => {
      subtabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-subtab');
      document.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
      const target = document.getElementById(`subtab-${targetId}`);
      if (target) target.classList.add('active');
    });
  });

  // Canvas zoom reset
  const resetBtn = document.getElementById('btn-zoom-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      const preset = presetSelect ? presetSelect.value : 'report-synthesis';
      workflowEngine.setupNodes(preset);
      workflowEngine.draw();
      showToast('Canvas topology view reset');
    });
  }
});

/* ==========================================================================
   NAVIGATION TABS
   ========================================================================== */
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTabId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });

      const targetContent = document.getElementById(`tab-${targetTabId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      if (targetTabId === 'workflow' && workflowEngine) {
        setTimeout(() => {
          workflowEngine.initCanvas();
        }, 60);
      }
    });
  });
}

/* ==========================================================================
   TAB 2: FORM RESPONSE COPY ASSISTANT
   ========================================================================== */
function renderFormAssistantCards() {
  const container = document.getElementById('answers-container');
  if (!container) return;

  container.innerHTML = formAnswers.map(ans => {
    const metrics = calculateTextMetrics(ans.value);
    
    let isMinWordValid = ans.minWords === 0 || metrics.words >= ans.minWords;
    let isMinCharValid = ans.minChars === 0 || metrics.chars >= ans.minChars;
    let isMaxWordValid = ans.maxWords === 0 || metrics.words <= ans.maxWords;
    let isMaxCharValid = ans.maxChars === 0 || metrics.chars <= ans.maxChars;

    const isValid = isMinWordValid && isMinCharValid && isMaxWordValid && isMaxCharValid;

    return `
      <div class="answer-card" id="card-${ans.id}">
        <div class="answer-card-header">
          <div class="answer-title-box">
            <h4>${ans.label}</h4>
            <div class="metrics-badge-group">
              <span class="badge-metric ${isValid ? 'valid' : ''}">
                Words: ${metrics.words} ${ans.minWords > 0 ? `(Min ${ans.minWords})` : ''} ${ans.maxWords > 0 ? `(Max ${ans.maxWords})` : ''}
              </span>
              <span class="badge-metric ${isValid ? 'valid' : ''}">
                Chars: ${metrics.chars} ${ans.minChars > 0 ? `(Min ${ans.minChars})` : ''} ${ans.maxChars > 0 ? `(Max ${ans.maxChars})` : ''}
              </span>
              <span class="badge-metric valid">Rule: ${ans.ruleDesc}</span>
            </div>
          </div>
          <button class="btn-copy" data-copy-target="${ans.id}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Copy Answer</span>
          </button>
        </div>
        <div class="answer-body">${escapeHtml(ans.value)}</div>
      </div>
    `;
  }).join('');

  // Attach copy event listeners
  container.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const item = formAnswers.find(a => a.id === targetId);
      if (item) {
        copyTextToClipboard(item.value, () => {
          btn.classList.add('copied');
          btn.innerHTML = `✓ Copied!`;
          showToast(`Copied field answer to clipboard`);
          setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy Answer</span>`;
          }, 2000);
        });
      }
    });
  });
}

/* ==========================================================================
   TAB 3: INTERACTIVE SUBMISSION FORM REPLICA (STARTS BLANK BY DEFAULT)
   ========================================================================== */
function initFormReplica() {
  const form = document.getElementById('submission-form-replica');
  if (!form) return;

  const textareas = [
    { id: 'input-q2', counterId: 'counter-q2', msgId: 'msg-q2', minW: 100, minC: 600, maxW: 0, maxC: 0 },
    { id: 'input-q4', counterId: 'counter-q4', msgId: 'msg-q4', minW: 500, minC: 3000, maxW: 0, maxC: 0 },
    { id: 'input-q6', counterId: 'counter-q6', msgId: 'msg-q6', minW: 45, minC: 300, maxW: 0, maxC: 0 },
    { id: 'input-q9', counterId: 'counter-q9', msgId: 'msg-q9', minW: 0, minC: 0, maxW: 200, maxC: 1200 }
  ];

  textareas.forEach(item => {
    const el = document.getElementById(item.id);
    if (!el) return;

    el.addEventListener('input', () => {
      updateFieldMetrics(el, item);
    });
  });

  // NOTE: Form is kept BLANK by default so user can fill it out manually.

  // Pre-fill All Button (Only runs when explicitly clicked by the user)
  const prefillBtn = document.getElementById('btn-prefill-all');
  if (prefillBtn) {
    prefillBtn.addEventListener('click', () => {
      prefillReplicaForm();
      showToast('Form populated with pre-validated answers!');
    });
  }

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let allValid = true;

    // Check project title
    const titleInput = document.getElementById('input-project-title');
    if (!titleInput || !titleInput.value.trim()) {
      showToast('⚠️ Please enter a Project Title.', 'warning');
      return;
    }

    textareas.forEach(item => {
      const el = document.getElementById(item.id);
      const metrics = calculateTextMetrics(el.value);
      const isValid = validateRules(metrics, item);
      if (!isValid) allValid = false;
    });

    if (allValid) {
      showToast('🎉 Form submission verified! All word & character constraints satisfied.', 'success');
    } else {
      showToast('⚠️ Please verify word and character count constraints on red fields.', 'warning');
    }
  });
}

function updateFieldMetrics(el, config) {
  const counterEl = document.getElementById(config.counterId);
  const msgEl = document.getElementById(config.msgId);
  if (!counterEl) return;

  const metrics = calculateTextMetrics(el.value);
  counterEl.innerText = `Words: ${metrics.words} | Chars: ${metrics.chars}`;

  if (!el.value.trim()) {
    counterEl.className = 'counter-badge';
    if (msgEl) {
      msgEl.innerText = '';
      msgEl.className = 'validation-msg';
    }
    return;
  }

  const isValid = validateRules(metrics, config);
  if (isValid) {
    counterEl.className = 'counter-badge valid';
    if (msgEl) {
      msgEl.innerText = '✓ Satisfies all word & character count requirements.';
      msgEl.className = 'validation-msg success';
    }
  } else {
    counterEl.className = 'counter-badge invalid';
    if (msgEl) {
      let err = '';
      if (config.minW > 0 && metrics.words < config.minW) err += `Min ${config.minW} words required (currently ${metrics.words}). `;
      if (config.minC > 0 && metrics.chars < config.minC) err += `Min ${config.minC} chars required (currently ${metrics.chars}). `;
      if (config.maxW > 0 && metrics.words > config.maxW) err += `Exceeds max ${config.maxW} words. `;
      if (config.maxC > 0 && metrics.chars > config.maxC) err += `Exceeds max ${config.maxC} chars. `;
      msgEl.innerText = err;
      msgEl.className = 'validation-msg error';
    }
  }
}

function validateRules(metrics, config) {
  if (config.minW > 0 && metrics.words < config.minW) return false;
  if (config.minC > 0 && metrics.chars < config.minC) return false;
  if (config.maxW > 0 && metrics.words > config.maxW) return false;
  if (config.maxC > 0 && metrics.chars > config.maxC) return false;
  return true;
}

function prefillReplicaForm() {
  const map = {
    'input-project-title': 'project-title',
    'input-category': 'category',
    'input-college-tech': 'college-tech',
    'select-q1': 'q1',
    'input-q2': 'q2',
    'select-q3': 'q3',
    'input-q4': 'q4',
    'input-q5': 'q5',
    'input-q6': 'q6',
    'input-q7': 'q7',
    'input-q8': 'q8',
    'input-q9': 'q9'
  };

  Object.keys(map).forEach(inputElemId => {
    const dataId = map[inputElemId];
    const item = formAnswers.find(a => a.id === dataId);
    const el = document.getElementById(inputElemId);
    if (el && item) {
      el.value = item.value;
      el.dispatchEvent(new Event('input'));
    }
  });

  const projectTitleHelp = document.getElementById('help-project-title');
  if (projectTitleHelp) {
    projectTitleHelp.innerText = '✓ Title populated & validated';
  }
}

/* ==========================================================================
   QUICK COPY ALL ANSWERS & CLIPBOARD FALLBACK
   ========================================================================== */
function initQuickCopyAll() {
  const copyAllBtn = document.getElementById('quick-copy-all');
  if (!copyAllBtn) return;

  copyAllBtn.addEventListener('click', () => {
    const fullText = formAnswers.map(a => `=== ${a.label} ===\n${a.value}\n`).join('\n');
    copyTextToClipboard(fullText, () => {
      showToast('Copied ALL form responses to clipboard!');
    });
  });
}

function copyTextToClipboard(text, onSuccess) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(onSuccess).catch(() => {
      fallbackCopyText(text, onSuccess);
    });
  } else {
    fallbackCopyText(text, onSuccess);
  }
}

function fallbackCopyText(text, onSuccess) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    if (onSuccess) onSuccess();
  } catch (err) {
    console.error('Fallback copy failed', err);
  }
  document.body.removeChild(textArea);
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>⚡ ${message}</span>`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
