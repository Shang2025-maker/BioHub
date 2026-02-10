import { store } from '../store.js';
import { orders, orderStatusMap } from '../mock/orders.js';
import { labs } from '../mock/labs.js';
import { aiAgent } from '../ai/agent.js';
import { router } from '../router.js';

export function renderDashboard() {
    const el = document.getElementById('page-content');
    const role = store.get('currentRole');
    const insights = aiAgent.generateInsights();

    const activeOrders = orders.filter(o => ['in_progress', 'confirmed', 'review'].includes(o.status));
    const completedOrders = orders.filter(o => o.status === 'completed');
    const onlineLabs = labs.filter(l => l.status === 'online');

    el.innerHTML = `
    <div class="dashboard animate-fade-in">
      <!-- Stats Row -->
      <div class="stats-grid stagger-children">
        <div class="stat-card">
          <div class="stat-card-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6v7l5 8H4l5-8V3z"/><path d="M8 3h8"/></svg>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">活跃实验室</div>
            <div class="stat-card-value">${onlineLabs.length}</div>
            <div class="stat-card-change up">↑ 12% 较上月</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon cyan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">进行中订单</div>
            <div class="stat-card-value">${activeOrders.length}</div>
            <div class="stat-card-change up">↑ 5 本周新增</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">完成率</div>
            <div class="stat-card-value">96.8%</div>
            <div class="stat-card-change up">↑ 2.3% 较上月</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12z"/></svg>
          </div>
          <div class="stat-card-content">
            <div class="stat-card-label">${role === 'requester' ? '总支出' : '总收入'}</div>
            <div class="stat-card-value">${role === 'requester' ? '¥456K' : '¥2.34M'}</div>
            <div class="stat-card-change up">↑ 18% 较上季度</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="dashboard-main">
        <!-- AI Insights -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">
              <span class="ai-badge">AI</span> 智能洞察
            </h2>
          </div>
          <div class="insights-grid stagger-children">
            ${insights.map(insight => `
              <div class="insight-card card" data-route="${insight.route}">
                <div class="insight-icon">${insight.icon}</div>
                <div class="insight-content">
                  <h4>${insight.title}</h4>
                  <p>${insight.text}</p>
                </div>
                <button class="btn btn-ghost btn-sm">${insight.action}</button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Recent Orders -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">最近订单</h2>
            <button class="btn btn-ghost btn-sm" id="view-all-orders">查看全部</button>
          </div>
          <div class="orders-list stagger-children">
            ${orders.slice(0, 4).map(order => `
              <div class="order-row card">
                <div class="order-row-id">${order.id}</div>
                <div class="order-row-info">
                  <h4>${order.title}</h4>
                  <span class="order-row-meta">${order.type} · ${order.lab ? order.lab.name : '待匹配'}</span>
                </div>
                <div class="order-row-progress">
                  <div class="progress-bar" style="width:100px;">
                    <div class="progress-bar-fill" style="width:${order.progress}%"></div>
                  </div>
                  <span class="progress-text">${order.progress}%</span>
                </div>
                <span class="tag ${orderStatusMap[order.status].color}">${orderStatusMap[order.status].label}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Active Labs -->
        <div class="dashboard-section">
          <div class="section-header">
            <h2 class="section-title">推荐实验室</h2>
            <button class="btn btn-ghost btn-sm" id="view-all-labs">浏览市场</button>
          </div>
          <div class="labs-grid stagger-children">
            ${labs.slice(0, 3).map(lab => `
              <div class="lab-mini-card card">
                <div class="lab-mini-header">
                  <div class="avatar" style="background:${lab.avatarColor}">${lab.avatar}</div>
                  <div>
                    <h4>${lab.shortName}</h4>
                    <span class="lab-mini-location">${lab.location}</span>
                  </div>
                  <span class="status-dot ${lab.status}"></span>
                </div>
                <div class="lab-mini-tags">
                  ${lab.specialties.slice(0, 3).map(s => `<span class="tag tag-purple">${s}</span>`).join('')}
                </div>
                <div class="lab-mini-stats">
                  <span>⭐ ${lab.rating}</span>
                  <span>📋 ${lab.completedOrders}单</span>
                  <span>✅ ${lab.successRate}%</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

    // Event listeners
    el.querySelectorAll('.insight-card').forEach(card => {
        card.addEventListener('click', () => router.navigate(card.dataset.route));
    });
    el.querySelector('#view-all-orders')?.addEventListener('click', () => router.navigate('/orders'));
    el.querySelector('#view-all-labs')?.addEventListener('click', () => router.navigate('/marketplace'));
}
