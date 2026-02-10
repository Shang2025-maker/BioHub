import { labs } from '../mock/labs.js';
import { renderStars, showModal, closeModal, showToast } from '../components/utils.js';
import { router } from '../router.js';

export function renderMarketplace() {
    const el = document.getElementById('page-content');
    let filteredLabs = [...labs];
    let searchTerm = '';
    let filterSpecialty = 'all';

    function render() {
        let display = filteredLabs;
        if (searchTerm) {
            display = display.filter(l =>
                l.name.includes(searchTerm) || l.specialties.some(s => s.includes(searchTerm)) || l.location.includes(searchTerm)
            );
        }
        if (filterSpecialty !== 'all') {
            display = display.filter(l => l.specialties.some(s => s.includes(filterSpecialty)));
        }

        el.innerHTML = `
      <div class="marketplace animate-fade-in">
        <!-- Search and Filter Bar -->
        <div class="marketplace-toolbar">
          <div class="marketplace-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="搜索实验室名称、能力、地区..." value="${searchTerm}" id="lab-search">
          </div>
          <div class="marketplace-filters">
            <select class="form-input form-select filter-select" id="specialty-filter">
              <option value="all">全部能力</option>
              <option value="基因编辑" ${filterSpecialty === '基因编辑' ? 'selected' : ''}>基因编辑</option>
              <option value="药物" ${filterSpecialty === '药物' ? 'selected' : ''}>药物研发</option>
              <option value="结构" ${filterSpecialty === '结构' ? 'selected' : ''}>结构生物学</option>
              <option value="化学" ${filterSpecialty === '化学' ? 'selected' : ''}>化学合成</option>
              <option value="神经" ${filterSpecialty === '神经' ? 'selected' : ''}>神经科学</option>
              <option value="纳米" ${filterSpecialty === '纳米' ? 'selected' : ''}>纳米医学</option>
            </select>
            <select class="form-input form-select filter-select" id="status-filter">
              <option value="all">全部状态</option>
              <option value="online">在线</option>
              <option value="busy">忙碌</option>
            </select>
          </div>
        </div>

        <div class="marketplace-results">
          <span class="result-count">共 ${display.length} 家实验室</span>
        </div>

        <!-- Lab Cards Grid -->
        <div class="lab-cards-grid stagger-children">
          ${display.map(lab => `
            <div class="lab-card card" data-lab-id="${lab.id}">
              <div class="lab-card-header">
                <div class="lab-card-avatar">
                  <div class="avatar avatar-lg" style="background:${lab.avatarColor}">${lab.avatar}</div>
                  <span class="status-dot ${lab.status}"></span>
                </div>
                <div class="lab-card-title">
                  <h3>${lab.name}</h3>
                  <span class="lab-card-location">📍 ${lab.location}</span>
                </div>
              </div>
              <p class="lab-card-desc">${lab.description}</p>
              <div class="lab-card-tags">
                ${lab.specialties.map(s => `<span class="tag tag-purple">${s}</span>`).join('')}
              </div>
              <div class="lab-card-stats">
                <div class="lab-stat">
                  ${renderStars(lab.rating)}
                  <span>${lab.rating} (${lab.reviewCount})</span>
                </div>
                <div class="lab-stat">
                  <span class="lab-stat-value">${lab.completedOrders}</span>
                  <span class="lab-stat-label">已完成</span>
                </div>
                <div class="lab-stat">
                  <span class="lab-stat-value">${lab.successRate}%</span>
                  <span class="lab-stat-label">成功率</span>
                </div>
              </div>
              <div class="lab-card-footer">
                <span class="lab-card-price">${lab.priceRange}</span>
                <div class="lab-card-actions">
                  <button class="btn btn-ghost btn-sm btn-detail" data-id="${lab.id}">详情</button>
                  <button class="btn btn-primary btn-sm btn-contact" data-id="${lab.id}">联系</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

        // Bind events
        el.querySelector('#lab-search').addEventListener('input', (e) => {
            searchTerm = e.target.value;
            render();
        });
        el.querySelector('#specialty-filter').addEventListener('change', (e) => {
            filterSpecialty = e.target.value;
            render();
        });

        el.querySelectorAll('.btn-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const lab = labs.find(l => l.id === btn.dataset.id);
                showLabDetail(lab);
            });
        });

        el.querySelectorAll('.btn-contact').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                showToast('已发送联系请求，等待实验室回复', 'success');
            });
        });
    }

    render();
}

function showLabDetail(lab) {
    showModal(lab.name, `
    <div class="lab-detail">
      <div class="lab-detail-header">
        <div class="avatar avatar-lg" style="background:${lab.avatarColor}">${lab.avatar}</div>
        <div>
          <h3>${lab.name}</h3>
          <p>📍 ${lab.location} · ⏱️ 平均响应 ${lab.avgResponseTime}</p>
          <div style="margin-top:8px">${lab.certifications.map(c => `<span class="tag tag-cyan">${c}</span>`).join(' ')}</div>
        </div>
      </div>
      <div class="lab-detail-section">
        <h4>📋 实验室简介</h4>
        <p>${lab.description}</p>
      </div>
      <div class="lab-detail-section">
        <h4>🔬 设备清单</h4>
        <table class="data-table">
          <thead><tr><th>设备名称</th><th>型号</th><th>状态</th></tr></thead>
          <tbody>
            ${lab.equipment.map(eq => `
              <tr>
                <td>${eq.name}</td>
                <td style="font-family:var(--font-mono);font-size:12px">${eq.model}</td>
                <td><span class="tag ${eq.status === 'idle' ? 'tag-green' : eq.status === 'running' ? 'tag-blue' : 'tag-orange'}">${eq.status === 'idle' ? '空闲' : eq.status === 'running' ? '运行中' : '维护中'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div class="lab-detail-section">
        <h4>🏷️ 能力标签</h4>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${lab.specialties.map(s => `<span class="tag tag-purple">${s}</span>`).join('')}
        </div>
      </div>
      <div class="lab-detail-stats-row">
        <div class="lab-detail-stat">
          <span class="stat-number">${lab.completedOrders}</span>
          <span class="stat-label">完成订单</span>
        </div>
        <div class="lab-detail-stat">
          <span class="stat-number">${lab.successRate}%</span>
          <span class="stat-label">成功率</span>
        </div>
        <div class="lab-detail-stat">
          <span class="stat-number">${lab.rating}</span>
          <span class="stat-label">评分</span>
        </div>
        <div class="lab-detail-stat">
          <span class="stat-number">${lab.capacity}%</span>
          <span class="stat-label">产能利用</span>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="document.getElementById('modal-overlay').classList.add('hidden')">关闭</button>
    <button class="btn btn-primary" id="modal-contact-btn">发起合作</button>
  `);

    document.getElementById('modal-contact-btn')?.addEventListener('click', () => {
        showToast('合作请求已发送！', 'success');
        closeModal();
    });
}
