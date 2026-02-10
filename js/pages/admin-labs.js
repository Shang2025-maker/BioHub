import { labAudits } from '../mock/admin-data.js';

let activeTab = 'pending';

export function renderAdminLabs() {
    const el = document.getElementById('page-content');
    const tabs = [
        { id: 'pending', label: '待审核', icon: '🔔', count: labAudits.filter(l => l.status === 'pending').length },
        { id: 'approved', label: '已通过', icon: '✅', count: labAudits.filter(l => l.status === 'approved').length },
        { id: 'rejected', label: '已驳回', icon: '❌', count: labAudits.filter(l => l.status === 'rejected').length },
    ];
    const filtered = labAudits.filter(l => l.status === activeTab);
    const levelColors = { '基础': 'tag-green', '高级': 'tag-purple', '旗舰': 'tag-cyan' };

    el.innerHTML = `
  <div class="adm-labs animate-fade-in">
    <div class="adm-page-header">
      <h2>🔬 实验室审核</h2>
      <span class="adm-page-subtitle">管理实验室入驻审核与认证</span>
    </div>

    <!-- Tabs -->
    <div class="adm-tabs">
      ${tabs.map(t => `
        <button class="adm-tab ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
          ${t.icon} ${t.label} <span class="adm-tab-count">${t.count}</span>
        </button>
      `).join('')}
    </div>

    <!-- Cards -->
    <div class="adm-lab-cards stagger-children">
      ${filtered.length === 0 ? `
        <div class="empty-state card" style="padding:60px 20px"><div class="empty-state-icon">📭</div><div class="empty-state-text">暂无${tabs.find(t => t.id === activeTab).label}的实验室</div></div>
      ` : filtered.map(lab => `
        <div class="adm-lab-card card">
          <div class="adm-lab-header">
            <div>
              <h3 class="adm-lab-name">${lab.name}</h3>
              <span class="adm-lab-type">${lab.type}</span>
            </div>
            ${lab.level ? `<span class="tag ${levelColors[lab.level] || ''}">${lab.level}认证</span>` : ''}
          </div>

          <div class="adm-lab-info-grid">
            <div class="adm-lab-info"><span class="adm-lab-info-label">联系人</span><span>${lab.contact}</span></div>
            <div class="adm-lab-info"><span class="adm-lab-info-label">邮箱</span><span style="font-size:12px">${lab.email}</span></div>
            <div class="adm-lab-info"><span class="adm-lab-info-label">申请时间</span><span>${lab.appliedAt}</span></div>
            <div class="adm-lab-info"><span class="adm-lab-info-label">资料份数</span><span>${lab.documents} 份</span></div>
          </div>

          <div class="adm-lab-section">
            <span class="adm-lab-sec-title">专业方向</span>
            <div class="adm-lab-tags">${lab.specialties.map(s => `<span class="tag tag-purple">${s}</span>`).join('')}</div>
          </div>

          <div class="adm-lab-section">
            <span class="adm-lab-sec-title">主要设备</span>
            <div class="adm-lab-tags">${lab.equipment.map(e => `<span class="tag">${e}</span>`).join('')}</div>
          </div>

          ${lab.certifications.length > 0 ? `
          <div class="adm-lab-section">
            <span class="adm-lab-sec-title">资质认证</span>
            <div class="adm-lab-tags">${lab.certifications.map(c => `<span class="tag tag-cyan">${c}</span>`).join('')}</div>
          </div>` : ''}

          ${activeTab === 'rejected' && lab.rejectReason ? `
          <div class="adm-lab-reject-reason">
            <strong>驳回原因：</strong>${lab.rejectReason}
          </div>` : ''}

          ${activeTab === 'pending' ? `
          <div class="adm-lab-actions">
            <button class="btn btn-primary btn-sm adm-lab-approve" data-id="${lab.id}">✅ 通过</button>
            <button class="btn btn-ghost btn-sm adm-lab-reject" data-id="${lab.id}" style="color:var(--danger)">❌ 驳回</button>
          </div>` : ''}

          ${activeTab === 'approved' ? `
          <div class="adm-lab-actions">
            <div class="adm-lab-level-select">
              <span style="font-size:12px;color:var(--text-tertiary)">认证等级：</span>
              <select class="form-input adm-lab-level-change" data-id="${lab.id}" style="width:120px;font-size:12px">
                <option ${lab.level === '基础' ? 'selected' : ''}>基础</option>
                <option ${lab.level === '高级' ? 'selected' : ''}>高级</option>
                <option ${lab.level === '旗舰' ? 'selected' : ''}>旗舰</option>
              </select>
            </div>
            <button class="btn btn-ghost btn-sm adm-lab-offline" data-id="${lab.id}" style="color:var(--warning)">⏸ 下线整改</button>
          </div>` : ''}
        </div>
      `).join('')}
    </div>
  </div>`;

    bindEvents();
}

function bindEvents() {
    const el = document.getElementById('page-content');
    el.querySelectorAll('.adm-tab').forEach(btn => {
        btn.addEventListener('click', () => { activeTab = btn.dataset.tab; renderAdminLabs(); });
    });
    el.querySelectorAll('.adm-lab-approve').forEach(btn => {
        btn.addEventListener('click', () => {
            const lab = labAudits.find(l => l.id === btn.dataset.id);
            if (lab) { lab.status = 'approved'; lab.approvedAt = '2025-02-10'; lab.level = '基础'; renderAdminLabs(); }
        });
    });
    el.querySelectorAll('.adm-lab-reject').forEach(btn => {
        btn.addEventListener('click', () => {
            const lab = labAudits.find(l => l.id === btn.dataset.id);
            if (lab) { lab.status = 'rejected'; lab.rejectedAt = '2025-02-10'; lab.rejectReason = '资质审核未通过，请补充材料后重新申请'; activeTab = 'rejected'; renderAdminLabs(); }
        });
    });
    el.querySelectorAll('.adm-lab-level-change').forEach(sel => {
        sel.addEventListener('change', () => {
            const lab = labAudits.find(l => l.id === sel.dataset.id);
            if (lab) lab.level = sel.value;
        });
    });
    el.querySelectorAll('.adm-lab-offline').forEach(btn => {
        btn.addEventListener('click', () => {
            const lab = labAudits.find(l => l.id === btn.dataset.id);
            if (lab) { lab.status = 'rejected'; lab.rejectReason = '运营方下线整改'; activeTab = 'rejected'; renderAdminLabs(); }
        });
    });
}
