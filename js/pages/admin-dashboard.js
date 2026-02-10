import { store } from '../store.js';
import { router } from '../router.js';
import { platformUsers, platformOrders, labAudits, transactions } from '../mock/admin-data.js';

export function renderAdminDashboard() {
    const el = document.getElementById('page-content');

    const totalUsers = platformUsers.length;
    const totalOrders = platformOrders.length;
    const gmv = platformOrders.reduce((s, o) => s + o.amount, 0);
    const totalCommission = platformOrders.reduce((s, o) => s + o.commission, 0);
    const pendingAudits = labAudits.filter(l => l.status === 'pending').length;
    const disputes = platformOrders.filter(o => o.flag === 'dispute').length;
    const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');
    const subDist = { free: 0, pro: 0, enterprise: 0 };
    platformUsers.forEach(u => { if (subDist[u.subscription] !== undefined) subDist[u.subscription]++; });

    el.innerHTML = `
  <div class="adm-dashboard animate-fade-in">
    <div class="adm-page-header">
      <h2>🏠 运营总览</h2>
      <span class="adm-page-subtitle">平台核心经营数据一览</span>
    </div>

    <!-- KPI Cards -->
    <div class="stats-grid stagger-children">
      <div class="stat-card">
        <div class="stat-card-icon purple">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">总用户数</div>
          <div class="stat-card-value">${totalUsers}</div>
          <div class="stat-card-change up">↑ 23% 较上月</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon cyan">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">总订单数</div>
          <div class="stat-card-value">${totalOrders}</div>
          <div class="stat-card-change up">↑ 15% 较上月</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon green">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">平台 GMV</div>
          <div class="stat-card-value">¥${(gmv / 10000).toFixed(1)}万</div>
          <div class="stat-card-change up">↑ 32% 较上季度</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-card-icon orange">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12z"/></svg>
        </div>
        <div class="stat-card-content">
          <div class="stat-card-label">佣金收入</div>
          <div class="stat-card-value">¥${totalCommission.toLocaleString()}</div>
          <div class="stat-card-change up">↑ 18% 较上月</div>
        </div>
      </div>
    </div>

    <!-- Alert Section -->
    <div class="adm-alerts card">
      <h3 class="adm-section-title">⚡ 实时警报</h3>
      <div class="adm-alert-list">
        ${pendingAudits > 0 ? `
        <div class="adm-alert-item warning" data-route="/admin/labs">
          <span class="adm-alert-icon">🔔</span>
          <span class="adm-alert-text">${pendingAudits} 个实验室待审核</span>
          <button class="btn btn-ghost btn-sm">去处理</button>
        </div>` : ''}
        ${disputes > 0 ? `
        <div class="adm-alert-item danger" data-route="/admin/orders">
          <span class="adm-alert-icon">⚠️</span>
          <span class="adm-alert-text">${disputes} 个订单纠纷待处理</span>
          <button class="btn btn-ghost btn-sm">去处理</button>
        </div>` : ''}
        ${pendingWithdrawals.length > 0 ? `
        <div class="adm-alert-item info" data-route="/admin/finance">
          <span class="adm-alert-icon">💰</span>
          <span class="adm-alert-text">${pendingWithdrawals.length} 笔提现待审批，共 ¥${Math.abs(pendingWithdrawals.reduce((s, t) => s + t.amount, 0)).toLocaleString()}</span>
          <button class="btn btn-ghost btn-sm">去审批</button>
        </div>` : ''}
      </div>
    </div>

    <div class="adm-grid-2">
      <!-- Subscription Distribution -->
      <div class="card" style="padding:20px">
        <h3 class="adm-section-title">📊 用户订阅分布</h3>
        <div class="adm-sub-dist">
          ${['free', 'pro', 'enterprise'].map(tier => {
        const count = subDist[tier];
        const pct = ((count / totalUsers) * 100).toFixed(0);
        const labels = { free: '免费版', pro: '专业版', enterprise: '企业版' };
        const colors = { free: 'var(--text-secondary)', pro: 'var(--primary)', enterprise: 'var(--accent)' };
        return `
            <div class="adm-dist-row">
              <div class="adm-dist-label">
                <span class="adm-dist-dot" style="background:${colors[tier]}"></span>
                ${labels[tier]}
              </div>
              <div class="adm-dist-bar-wrap">
                <div class="adm-dist-bar" style="width:${pct}%;background:${colors[tier]}"></div>
              </div>
              <span class="adm-dist-val">${count} (${pct}%)</span>
            </div>`;
    }).join('')}
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card" style="padding:20px">
        <h3 class="adm-section-title">🕐 最近动态</h3>
        <div class="adm-activity-list">
          <div class="adm-activity-item"><span class="adm-act-time">10:32</span><span>李雪 提交了新订单 ORD-2025-007</span></div>
          <div class="adm-activity-item"><span class="adm-act-time">09:15</span><span>上海药物研发中心 提交入驻申请</span></div>
          <div class="adm-activity-item"><span class="adm-act-time">08:40</span><span>王强 发起订单 ORD-2025-004 纠纷</span></div>
          <div class="adm-activity-item"><span class="adm-act-time">昨天</span><span>清华实验室 申请提现 ¥5,000</span></div>
          <div class="adm-activity-item"><span class="adm-act-time">昨天</span><span>张明 续费 Pro 订阅</span></div>
          <div class="adm-activity-item"><span class="adm-act-time">前天</span><span>RT-qPCR订单 ORD-2025-008 完成交付</span></div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Bar -->
    <div class="adm-quick-stats card">
      <div class="adm-qs-item"><span class="adm-qs-num" style="color:var(--primary)">${platformUsers.filter(u => u.role === 'requester').length}</span><span class="adm-qs-label">需求方</span></div>
      <div class="adm-qs-item"><span class="adm-qs-num" style="color:var(--accent)">${platformUsers.filter(u => u.role === 'lab').length}</span><span class="adm-qs-label">实验室</span></div>
      <div class="adm-qs-item"><span class="adm-qs-num" style="color:var(--success)">${platformOrders.filter(o => o.status === 'completed').length}</span><span class="adm-qs-label">已完成订单</span></div>
      <div class="adm-qs-item"><span class="adm-qs-num" style="color:var(--warning)">${platformOrders.filter(o => o.status === 'in_progress').length}</span><span class="adm-qs-label">进行中</span></div>
      <div class="adm-qs-item"><span class="adm-qs-num" style="color:var(--danger)">${disputes}</span><span class="adm-qs-label">纠纷</span></div>
      <div class="adm-qs-item"><span class="adm-qs-num" style="color:#FECA57">${labAudits.filter(l => l.status === 'approved').length}</span><span class="adm-qs-label">认证实验室</span></div>
    </div>
  </div>`;

    // Alert click handlers
    el.querySelectorAll('.adm-alert-item').forEach(item => {
        item.addEventListener('click', () => router.navigate(item.dataset.route));
    });
}
