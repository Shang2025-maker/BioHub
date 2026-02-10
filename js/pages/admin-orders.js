import { platformOrders, orderStatusColors } from '../mock/admin-data.js';

let searchTerm = '';
let statusFilter = 'all';
let flagFilter = 'all';

function getFiltered() {
    return platformOrders.filter(o => {
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        if (flagFilter === 'dispute' && o.flag !== 'dispute') return false;
        if (flagFilter === 'large' && o.flag !== 'large_amount') return false;
        if (searchTerm && !o.id.includes(searchTerm) && !o.title.includes(searchTerm) && !o.requester.includes(searchTerm) && !o.lab.includes(searchTerm)) return false;
        return true;
    });
}

export function renderAdminOrders() {
    const el = document.getElementById('page-content');
    const orders = getFiltered();
    const totalAmount = platformOrders.reduce((s, o) => s + o.amount, 0);
    const disputes = platformOrders.filter(o => o.flag === 'dispute');
    const largeOrders = platformOrders.filter(o => o.flag === 'large_amount');

    el.innerHTML = `
  <div class="adm-orders animate-fade-in">
    <div class="adm-page-header">
      <h2>📋 订单监控</h2>
      <span class="adm-page-subtitle">全平台订单管理与纠纷处理</span>
    </div>

    <!-- Stats -->
    <div class="adm-mini-stats">
      <div class="adm-ms-item card"><span class="adm-ms-val">${platformOrders.length}</span><span class="adm-ms-label">总订单</span></div>
      <div class="adm-ms-item card"><span class="adm-ms-val">¥${(totalAmount / 10000).toFixed(1)}万</span><span class="adm-ms-label">总金额</span></div>
      <div class="adm-ms-item card" style="${disputes.length > 0 ? 'border-color:var(--danger)' : ''}"><span class="adm-ms-val" style="color:var(--danger)">${disputes.length}</span><span class="adm-ms-label">纠纷</span></div>
      <div class="adm-ms-item card"><span class="adm-ms-val" style="color:var(--warning)">${largeOrders.length}</span><span class="adm-ms-label">大额标记</span></div>
    </div>

    <!-- Filters -->
    <div class="adm-filter-bar card">
      <input type="text" class="form-input" id="adm-order-search" placeholder="🔍 搜索订单号、标题、用户..." value="${searchTerm}" style="flex:1;min-width:200px">
      <select class="form-input" id="adm-order-status" style="width:130px">
        <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>全部状态</option>
        <option value="pending" ${statusFilter === 'pending' ? 'selected' : ''}>待确认</option>
        <option value="in_progress" ${statusFilter === 'in_progress' ? 'selected' : ''}>进行中</option>
        <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>已完成</option>
        <option value="dispute" ${statusFilter === 'dispute' ? 'selected' : ''}>纠纷中</option>
      </select>
      <select class="form-input" id="adm-order-flag" style="width:130px">
        <option value="all" ${flagFilter === 'all' ? 'selected' : ''}>全部标记</option>
        <option value="dispute" ${flagFilter === 'dispute' ? 'selected' : ''}>纠纷</option>
        <option value="large" ${flagFilter === 'large' ? 'selected' : ''}>大额</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card" style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr><th>订单号</th><th>标题</th><th>需求方</th><th>实验室</th><th>金额</th><th>佣金</th><th>状态</th><th>标记</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${orders.map(o => {
        const st = orderStatusColors[o.status] || { label: o.status, color: '' };
        return `
          <tr class="${o.flag === 'dispute' ? 'adm-row-danger' : o.flag === 'large_amount' ? 'adm-row-warning' : ''}">
            <td style="font-family:var(--font-mono);font-size:12px">${o.id}</td>
            <td><strong>${o.title}</strong></td>
            <td>${o.requester}</td>
            <td style="font-size:12px">${o.lab}</td>
            <td>¥${o.amount.toLocaleString()}</td>
            <td style="color:var(--accent)">¥${o.commission.toLocaleString()}</td>
            <td><span class="tag ${st.color}">${st.label}</span></td>
            <td>
              ${o.flag === 'dispute' ? '<span class="tag tag-red">⚠ 纠纷</span>' : ''}
              ${o.flag === 'large_amount' ? '<span class="tag tag-yellow">💰 大额</span>' : ''}
              ${!o.flag ? '<span style="color:var(--text-tertiary)">-</span>' : ''}
            </td>
            <td>
              ${o.flag === 'dispute' ? `
                <div style="display:flex;gap:6px">
                  <button class="btn btn-primary btn-sm adm-order-resolve" data-id="${o.id}">仲裁</button>
                  <button class="btn btn-ghost btn-sm adm-order-refund" data-id="${o.id}" style="color:var(--warning)">退款</button>
                </div>
              ` : `<button class="btn btn-ghost btn-sm">查看</button>`}
            </td>
          </tr>`;
    }).join('')}
        </tbody>
      </table>
    </div>

    ${disputes.length > 0 ? `
    <!-- Dispute Panel -->
    <div class="card" style="padding:20px;margin-top:16px;border-color:var(--danger)">
      <h3 class="adm-section-title" style="color:var(--danger)">⚠️ 纠纷详情</h3>
      ${disputes.map(d => `
        <div class="adm-dispute-item">
          <div class="adm-dispute-header">
            <strong>${d.id} — ${d.title}</strong>
            <span class="tag tag-red">纠纷中</span>
          </div>
          <p class="adm-dispute-reason">${d.disputeReason}</p>
          <div class="adm-dispute-parties">
            <span>需求方: ${d.requester}</span>
            <span>实验室: ${d.lab}</span>
            <span>金额: ¥${d.amount.toLocaleString()}</span>
          </div>
        </div>
      `).join('')}
    </div>` : ''}
  </div>`;

    bindEvents();
}

function bindEvents() {
    const el = document.getElementById('page-content');
    el.querySelector('#adm-order-search')?.addEventListener('input', e => { searchTerm = e.target.value; renderAdminOrders(); });
    el.querySelector('#adm-order-status')?.addEventListener('change', e => { statusFilter = e.target.value; renderAdminOrders(); });
    el.querySelector('#adm-order-flag')?.addEventListener('change', e => { flagFilter = e.target.value; renderAdminOrders(); });
    el.querySelectorAll('.adm-order-resolve').forEach(btn => {
        btn.addEventListener('click', () => {
            const o = platformOrders.find(o => o.id === btn.dataset.id);
            if (o) { o.status = 'completed'; o.flag = null; o.disputeReason = undefined; renderAdminOrders(); }
        });
    });
    el.querySelectorAll('.adm-order-refund').forEach(btn => {
        btn.addEventListener('click', () => {
            const o = platformOrders.find(o => o.id === btn.dataset.id);
            if (o) { o.status = 'cancelled'; o.flag = null; o.disputeReason = undefined; renderAdminOrders(); }
        });
    });
}
