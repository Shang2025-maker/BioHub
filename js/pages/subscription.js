import { store } from '../store.js';
import { showToast } from '../components/utils.js';

const plans = [
    {
        id: 'free', name: '免费版', price: '¥0', period: '/月',
        badge: '', color: 'var(--text-secondary)',
        features: [
            { text: '每月 3 次 AI 模拟', included: true },
            { text: '基础实验室搜索', included: true },
            { text: '标准订单管理', included: true },
            { text: '社区支持', included: true },
            { text: 'AI 模型选择', included: false },
            { text: '自有 API Key', included: false },
            { text: '历史数据导出', included: false },
            { text: '优先客服', included: false },
        ]
    },
    {
        id: 'pro', name: '专业版', price: '¥299', period: '/月',
        badge: '🔥 最受欢迎', color: 'var(--primary-light)',
        features: [
            { text: '每月 50 次 AI 模拟', included: true },
            { text: '高级实验室筛选 + AI 推荐', included: true },
            { text: '完整订单与进度管理', included: true },
            { text: '全部 AI 模型选择', included: true },
            { text: '自有 API Key 支持', included: true },
            { text: '历史数据导出 (CSV/PDF)', included: true },
            { text: '优先客服响应', included: true },
            { text: '专属客户经理', included: false },
        ]
    },
    {
        id: 'enterprise', name: '企业版', price: '¥999', period: '/月',
        badge: '⚡ 旗舰', color: 'var(--accent)',
        features: [
            { text: '无限次 AI 模拟', included: true },
            { text: '全功能无限制使用', included: true },
            { text: '定制化数字孪生', included: true },
            { text: '全部 AI 模型 + 私有部署', included: true },
            { text: '批量 API Key 管理', included: true },
            { text: '完整数据分析与导出', included: true },
            { text: '7×24h 专属客服', included: true },
            { text: '专属客户经理 + SLA保障', included: true },
        ]
    }
];

export function renderSubscription() {
    const el = document.getElementById('page-content');
    const currentPlan = store.get('subscription') || 'free';
    let showAdmin = false;
    let editPrices = { free: '¥0', pro: '¥299', enterprise: '¥999' };

    function render() {
        el.innerHTML = `
    <div class="sub-page animate-fade-in">
      <div class="sub-header">
        <h2>订阅管理</h2>
        <p style="color:var(--text-tertiary);margin-top:4px">选择适合你的方案，解锁更多 AI 实验室功能</p>
        <button class="btn btn-ghost btn-sm" id="toggle-admin" style="margin-top:8px">⚙️ 管理员设置</button>
      </div>

      ${showAdmin ? renderAdminPanel() : ''}

      <div class="sub-current-plan card" style="margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:12px">
          <span style="font-size:24px">📦</span>
          <div>
            <div style="font-size:13px;color:var(--text-tertiary)">当前方案</div>
            <div style="font-size:18px;font-weight:700;color:var(--primary-light)">${plans.find(p => p.id === currentPlan)?.name || '免费版'}</div>
          </div>
          <span class="tag tag-green" style="margin-left:auto">生效中</span>
        </div>
      </div>

      <div class="sub-plans-grid">
        ${plans.map(plan => `
          <div class="sub-plan-card card ${currentPlan === plan.id ? 'current' : ''}" data-plan="${plan.id}">
            ${plan.badge ? `<div class="sub-plan-badge">${plan.badge}</div>` : ''}
            <h3 style="color:${plan.color}">${plan.name}</h3>
            <div class="sub-plan-price">
              <span class="sub-price-value">${editPrices[plan.id] || plan.price}</span>
              <span class="sub-price-period">${plan.period}</span>
            </div>
            <ul class="sub-features">
              ${plan.features.map(f => `
                <li class="${f.included ? 'included' : 'excluded'}">
                  <span>${f.included ? '✅' : '❌'}</span>
                  ${f.text}
                </li>
              `).join('')}
            </ul>
            <button class="btn ${currentPlan === plan.id ? 'btn-ghost' : plan.id === 'pro' ? 'btn-primary' : 'btn-ghost'} btn-lg sub-select-btn" data-plan="${plan.id}" style="width:100%" ${currentPlan === plan.id ? 'disabled' : ''}>
              ${currentPlan === plan.id ? '当前方案' : plan.id === 'free' ? '降级' : '升级'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>`;
        bindEvents();
    }

    function renderAdminPanel() {
        return `
      <div class="sub-admin-panel card" style="margin-bottom:24px;border:1px solid var(--warning);border-left:3px solid var(--warning)">
        <h4 style="margin-bottom:12px;color:var(--warning)">⚙️ 管理员 — 费用设定</h4>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          ${plans.map(p => `
            <div class="form-group" style="margin:0">
              <label class="form-label">${p.name} 月费</label>
              <input class="form-input admin-price-input" data-plan="${p.id}" value="${editPrices[p.id] || p.price}" placeholder="¥0">
            </div>
          `).join('')}
        </div>
        <button class="btn btn-primary btn-sm" id="save-prices" style="margin-top:12px">保存价格设定</button>
      </div>`;
    }

    function bindEvents() {
        el.querySelector('#toggle-admin')?.addEventListener('click', () => {
            showAdmin = !showAdmin;
            render();
        });

        el.querySelector('#save-prices')?.addEventListener('click', () => {
            el.querySelectorAll('.admin-price-input').forEach(input => {
                editPrices[input.dataset.plan] = input.value;
            });
            showToast('价格已更新', 'success');
            render();
        });

        el.querySelectorAll('.sub-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const plan = btn.dataset.plan;
                if (plan === currentPlan) return;
                store.set('subscription', plan);
                showToast(`已切换至 ${plans.find(p => p.id === plan)?.name}`, 'success');
                renderSubscription(); // re-render fully
            });
        });
    }

    render();
}
