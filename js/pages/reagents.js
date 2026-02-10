import { reagents, reagentCategories, reagentStatusMap } from '../mock/reagents.js';
import { showModal, closeModal, showToast } from '../components/utils.js';

export function renderReagents() {
    const el = document.getElementById('page-content');
    let activeCategory = 'all';
    let searchTerm = '';

    function render() {
        let display = [...reagents];
        if (activeCategory !== 'all') {
            display = display.filter(r => r.category === activeCategory);
        }
        if (searchTerm) {
            display = display.filter(r =>
                r.name.includes(searchTerm) || r.brand.includes(searchTerm) || r.cas.includes(searchTerm)
            );
        }

        const lowStockCount = reagents.filter(r => r.status === 'low' || r.status === 'critical' || r.status === 'out_of_stock').length;

        el.innerHTML = `
      <div class="reagents-page animate-fade-in">
        <!-- Stats -->
        <div class="reagent-stats-row">
          <div class="stat-card">
            <div class="stat-card-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v8L6 18a2 2 0 002 2h8a2 2 0 002-2l-4-8V2"/><path d="M8 2h8"/></svg></div>
            <div class="stat-card-content">
              <div class="stat-card-label">试剂总数</div>
              <div class="stat-card-value">${reagents.length}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg></div>
            <div class="stat-card-content">
              <div class="stat-card-label">库存预警</div>
              <div class="stat-card-value">${lowStockCount}</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg></div>
            <div class="stat-card-content">
              <div class="stat-card-label">库存正常</div>
              <div class="stat-card-value">${reagents.filter(r => r.status === 'normal').length}</div>
            </div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="reagent-toolbar">
          <div class="reagent-categories">
            ${reagentCategories.map(cat => `
              <button class="btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-ghost'} btn-sm" data-cat="${cat.id}">${cat.label}</button>
            `).join('')}
          </div>
          <div class="reagent-search">
            <input type="text" class="form-input" placeholder="搜索试剂名称/品牌/CAS号..." value="${searchTerm}" id="reagent-search-input">
            <button class="btn btn-accent btn-sm" id="add-reagent-btn">+ 入库</button>
          </div>
        </div>

        <!-- Table -->
        <div class="card" style="padding:0;overflow:hidden">
          <table class="data-table">
            <thead>
              <tr>
                <th>编号</th>
                <th>名称</th>
                <th>品牌/规格</th>
                <th>分类</th>
                <th>库存</th>
                <th>存储条件</th>
                <th>有效期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              ${display.map(r => `
                <tr>
                  <td><span style="font-family:var(--font-mono);font-size:12px;color:var(--text-tertiary)">${r.id}</span></td>
                  <td><strong style="color:var(--text-primary)">${r.name}</strong>${r.cas !== '—' ? `<br><span style="font-size:11px;color:var(--text-tertiary)">CAS: ${r.cas}</span>` : ''}</td>
                  <td>${r.brand} · ${r.spec}</td>
                  <td><span class="tag tag-purple">${r.category}</span></td>
                  <td>
                    <span style="color:${r.stock <= r.minStock ? 'var(--danger)' : 'var(--text-primary)'};font-weight:600">${r.stock}</span>
                    <span style="color:var(--text-tertiary)">/ ${r.minStock} ${r.unit}</span>
                  </td>
                  <td>${r.storage}</td>
                  <td>${r.expiry}</td>
                  <td><span class="tag ${reagentStatusMap[r.status].color}">${reagentStatusMap[r.status].label}</span></td>
                  <td>
                    <div style="display:flex;gap:4px">
                      <button class="btn btn-ghost btn-sm btn-restock" data-id="${r.id}" ${r.status === 'normal' ? 'disabled style="opacity:0.3"' : ''}>补货</button>
                      <button class="btn btn-ghost btn-sm btn-reagent-detail" data-id="${r.id}">详情</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

        // Bind events
        el.querySelectorAll('[data-cat]').forEach(btn => {
            btn.addEventListener('click', () => { activeCategory = btn.dataset.cat; render(); });
        });
        el.querySelector('#reagent-search-input')?.addEventListener('input', (e) => { searchTerm = e.target.value; render(); });
        el.querySelectorAll('.btn-restock').forEach(btn => {
            btn.addEventListener('click', () => { showToast(`已为 ${btn.dataset.id} 创建补货订单`, 'success'); });
        });
        el.querySelector('#add-reagent-btn')?.addEventListener('click', () => {
            showModal('试剂入库', `
        <div class="form-group"><label class="form-label">试剂名称</label><input class="form-input" placeholder="输入试剂名称"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label class="form-label">品牌</label><input class="form-input" placeholder="品牌"></div>
          <div class="form-group"><label class="form-label">规格</label><input class="form-input" placeholder="规格"></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="form-group"><label class="form-label">数量</label><input class="form-input" type="number" placeholder="数量"></div>
          <div class="form-group"><label class="form-label">存储条件</label>
            <select class="form-input form-select"><option>室温</option><option>2-8°C</option><option>-20°C</option><option>-80°C</option></select>
          </div>
        </div>
        <div class="form-group"><label class="form-label">CAS号</label><input class="form-input" placeholder="选填"></div>
      `, `
        <button class="btn btn-ghost" onclick="document.getElementById('modal-overlay').classList.add('hidden')">取消</button>
        <button class="btn btn-primary" onclick="document.getElementById('modal-overlay').classList.add('hidden')">确认入库</button>
      `);
        });
    }

    render();
}
