import { labs } from '../mock/labs.js';

export function renderDigitalTwin() {
    const el = document.getElementById('page-content');
    const lab = labs[0];

    const eqHTML = lab.equipment.map((eq, i) => {
        const x = 80 + (i % 3) * 250;
        const y = 80 + Math.floor(i / 3) * 180;
        const color = eq.status === 'idle' ? 'var(--success)' : eq.status === 'running' ? 'var(--warning)' : 'var(--text-tertiary)';
        return `<g class="equipment-node">
      <rect x="${x}" y="${y}" width="200" height="120" rx="8" fill="var(--bg-card)" stroke="${color}" stroke-width="2"/>
      <circle cx="${x + 180}" cy="${y + 15}" r="5" fill="${color}">${eq.status === 'running' ? '<animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>' : ''}</circle>
      <text x="${x + 15}" y="${y + 40}" fill="var(--text-primary)" font-size="13" font-weight="600">${eq.name}</text>
      <text x="${x + 15}" y="${y + 62}" fill="var(--text-tertiary)" font-size="11">${eq.model}</text>
      <text x="${x + 15}" y="${y + 90}" fill="${color}" font-size="12">${eq.status === 'idle' ? '● 空闲' : eq.status === 'running' ? '◉ 运行中' : '○ 维护中'}</text>
    </g>`;
    }).join('');

    const panelHTML = lab.equipment.map(eq => `
    <div class="twin-eq-card">
      <div class="twin-eq-header">
        <span class="status-dot ${eq.status === 'idle' ? 'online' : eq.status === 'running' ? 'busy' : 'offline'}"></span>
        <span class="twin-eq-name">${eq.name}</span>
      </div>
      <div class="twin-eq-model">${eq.model}</div>
      <span class="tag ${eq.status === 'idle' ? 'tag-green' : eq.status === 'running' ? 'tag-orange' : 'tag-blue'}">${eq.status === 'idle' ? '空闲可用' : eq.status === 'running' ? '运行中' : '维护中'}</span>
      ${eq.status === 'idle' ? '<button class="btn btn-accent btn-sm" style="width:100%;margin-top:8px">预约使用</button>' : ''}
    </div>
  `).join('');

    el.innerHTML = `
    <div class="digital-twin-page animate-fade-in">
      <div class="twin-toolbar">
        <select class="form-input form-select" id="twin-lab-select" style="width:300px">
          ${labs.map(l => `<option value="${l.id}" ${l.id === lab.id ? 'selected' : ''}>${l.name}</option>`).join('')}
        </select>
        <div class="twin-legend">
          <span class="legend-item"><span class="status-dot online"></span> 空闲</span>
          <span class="legend-item"><span class="status-dot busy"></span> 运行中</span>
          <span class="legend-item"><span class="status-dot offline"></span> 维护中</span>
        </div>
      </div>
      <div class="twin-layout">
        <div class="twin-scene card">
          <svg viewBox="0 0 800 500" class="lab-floor-svg">
            <rect x="20" y="20" width="760" height="460" rx="8" fill="none" stroke="var(--border-default)" stroke-width="2"/>
            <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border-subtle)" stroke-width="0.5"/></pattern></defs>
            <rect x="20" y="20" width="760" height="460" fill="url(#grid)"/>
            ${eqHTML}
            <text x="400" y="470" fill="var(--text-tertiary)" font-size="12" text-anchor="middle">${lab.name} — 数字孪生平面图</text>
          </svg>
        </div>
        <div class="twin-panel">
          <h3 class="twin-panel-title">设备概览</h3>
          <div class="twin-equipment-list">${panelHTML}</div>
          <div class="twin-capacity-card">
            <h4>产能利用率</h4>
            <div class="capacity-ring">
              <svg viewBox="0 0 120 120" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-input)" stroke-width="10"/>
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" stroke-width="10" stroke-dasharray="${lab.capacity * 3.14} ${(100 - lab.capacity) * 3.14}" stroke-linecap="round" transform="rotate(-90 60 60)"/>
                <text x="60" y="55" text-anchor="middle" fill="var(--text-primary)" font-size="24" font-weight="700">${lab.capacity}%</text>
                <text x="60" y="75" text-anchor="middle" fill="var(--text-tertiary)" font-size="11">利用率</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>`;
}
