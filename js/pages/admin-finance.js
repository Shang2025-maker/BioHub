import { transactions, platformOrders, platformConfig } from '../mock/admin-data.js';

export function renderAdminFinance() {
    const el = document.getElementById('page-content');

    const totalRevenue = platformOrders.reduce((s, o) => s + o.amount, 0);
    const totalCommission = platformOrders.reduce((s, o) => s + o.commission, 0);
    const settledCommission = transactions.filter(t => t.type === 'commission' && t.status === 'settled').reduce((s, t) => s + t.amount, 0);
    const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
    const pendingAmount = Math.abs(pendingWithdrawals.reduce((s, t) => s + t.amount, 0));
    const subRevenue = transactions.filter(t => t.type === 'subscription').reduce((s, t) => s + t.amount, 0);

    const typeLabels = { commission: '佣金', withdrawal: '提现', subscription: '订阅' };
    const typeColors = { commission: 'tag-green', withdrawal: 'tag-yellow', subscription: 'tag-purple' };
    const statusLabels = { settled: '已结算', pending: '待审批', approved: '已审批' };
    const statusColors = { settled: 'tag-green', pending: 'tag-yellow', approved: 'tag-cyan' };

    el.innerHTML = `
  <div class="adm-finance animate-fade-in">
    <div class="adm-page-header">
      <h2>💰 财务管理</h2>
      <span class="adm-page-subtitle">平台收入与资金流水管理</span>
    </div>

    <!-- KPI -->
    <div class="stats-grid stagger-children">
      <div class="stat-card">
        <div class="stat-card-icon green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">平台 GMV</div>
          <div class="stat-card-value">¥${(totalRevenue / 10000).toFixed(1)}万</div>
          <div class="stat-card-change up">↑ 25% 较上月</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12z"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">佣金收入</div>
          <div class="stat-card-value">¥${totalCommission.toLocaleString()}</div>
          <div class="stat-card-change up">费率 ${platformConfig.commissionRate}%</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">订阅收入</div>
          <div class="stat-card-value">¥${subRevenue.toLocaleString()}</div>
          <div class="stat-card-change up">本月</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">待审提现</div>
          <div class="stat-card-value">¥${pendingAmount.toLocaleString()}</div>
          <div class="stat-card-change">${pendingWithdrawals.length} 笔</div>
        </div>
      </div>
    </div>

    <!-- Commission Rate -->
    <div class="card" style="padding:20px;margin-bottom:16px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <h3 class="adm-section-title" style="margin-bottom:4px">⚙️ 佣金比例设置</h3>
          <p style="font-size:12px;color:var(--text-tertiary);margin:0">当前佣金比例：每笔订单收取 ${platformConfig.commissionRate}% 平台服务费</p>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <input type="number" class="form-input" id="adm-commission-rate" value="${platformConfig.commissionRate}" min="1" max="20" style="width:80px;text-align:center">
          <span style="color:var(--text-tertiary)">%</span>
          <button class="btn btn-primary btn-sm" id="adm-save-rate">保存</button>
        </div>
      </div>
    </div>

    <div class="adm-grid-2">
      <!-- Withdrawal Approvals -->
      <div class="card" style="padding:20px">
        <h3 class="adm-section-title">📤 提现审批</h3>
        ${pendingWithdrawals.length === 0 ?
            '<div class="empty-state" style="padding:30px"><div class="empty-state-icon">✅</div><div class="empty-state-text">暂无待审批提现</div></div>' :
            pendingWithdrawals.map(t => `
          <div class="adm-withdrawal-item">
            <div class="adm-wd-info">
              <strong>${t.description}</strong>
              <span style="font-size:12px;color:var(--text-tertiary)">${t.date}</span>
            </div>
            <div class="adm-wd-amount">¥${Math.abs(t.amount).toLocaleString()}</div>
            <div class="adm-wd-actions">
              <button class="btn btn-primary btn-sm adm-wd-approve" data-id="${t.id}">批准</button>
              <button class="btn btn-ghost btn-sm adm-wd-reject" data-id="${t.id}" style="color:var(--danger)">拒绝</button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Revenue Chart Placeholder -->
      <div class="card" style="padding:20px">
        <h3 class="adm-section-title">📈 收入趋势</h3>
        <div class="adm-chart-placeholder">
          <div class="adm-bar-chart">
            ${['一月', '二月', '三月', '四月', '五月', '六月'].map((m, i) => {
                const heights = [45, 62, 55, 78, 85, 92];
                return `<div class="adm-bar-col"><div class="adm-bar" style="height:${heights[i]}%"></div><span>${m}</span></div>`;
            }).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Log -->
    <div class="card" style="overflow-x:auto;margin-top:16px">
      <div style="padding:16px 20px;border-bottom:1px solid var(--border-subtle)">
        <h3 class="adm-section-title" style="margin:0">📜 交易流水</h3>
      </div>
      <table class="data-table">
        <thead>
          <tr><th>编号</th><th>类型</th><th>描述</th><th>关联订单</th><th>金额</th><th>状态</th><th>日期</th></tr>
        </thead>
        <tbody>
          ${transactions.map(t => `
          <tr>
            <td style="font-family:var(--font-mono);font-size:12px">${t.id}</td>
            <td><span class="tag ${typeColors[t.type]}">${typeLabels[t.type]}</span></td>
            <td>${t.description}</td>
            <td style="font-size:12px">${t.orderId || '-'}</td>
            <td style="color:${t.amount >= 0 ? 'var(--success)' : 'var(--danger)'}; font-weight:600">${t.amount >= 0 ? '+' : ''}¥${Math.abs(t.amount).toLocaleString()}</td>
            <td><span class="tag ${statusColors[t.status]}">${statusLabels[t.status]}</span></td>
            <td style="font-size:12px">${t.date}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;

    bindEvents();
}

function bindEvents() {
    const el = document.getElementById('page-content');
    el.querySelector('#adm-save-rate')?.addEventListener('click', () => {
        const input = el.querySelector('#adm-commission-rate');
        const rate = parseFloat(input.value);
        if (rate >= 1 && rate <= 20) { platformConfig.commissionRate = rate; renderAdminFinance(); }
    });
    el.querySelectorAll('.adm-wd-approve').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = transactions.find(t => t.id === btn.dataset.id);
            if (t) { t.status = 'approved'; renderAdminFinance(); }
        });
    });
    el.querySelectorAll('.adm-wd-reject').forEach(btn => {
        btn.addEventListener('click', () => {
            const t = transactions.find(t => t.id === btn.dataset.id);
            if (t) { t.status = 'settled'; renderAdminFinance(); }
        });
    });
}
