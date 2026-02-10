import { store } from '../store.js';
import { orders, orderStatusMap } from '../mock/orders.js';
import { labs } from '../mock/labs.js';
import { aiAgent } from '../ai/agent.js';
import { showModal, closeModal, showToast } from '../components/utils.js';

export function renderOrders() {
    const el = document.getElementById('page-content');
    const role = store.get('currentRole');
    let activeTab = 'all';

    function render() {
        let filtered = [...orders];
        if (activeTab === 'active') filtered = filtered.filter(o => ['in_progress', 'confirmed', 'review', 'matching', 'quoting'].includes(o.status));
        else if (activeTab === 'completed') filtered = filtered.filter(o => o.status === 'completed');

        el.innerHTML = `
      <div class="orders-page animate-fade-in">
        <div class="orders-header">
          <div class="tabs">
            <div class="tab ${activeTab === 'all' ? 'active' : ''}" data-tab="all">全部订单 (${orders.length})</div>
            <div class="tab ${activeTab === 'active' ? 'active' : ''}" data-tab="active">进行中</div>
            <div class="tab ${activeTab === 'completed' ? 'active' : ''}" data-tab="completed">已完成</div>
          </div>
          ${role === 'requester' ? '<button class="btn btn-primary" id="create-order-btn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14M5 12h14"/></svg> 发布需求</button>' : ''}
        </div>

        <div class="orders-list stagger-children">
          ${filtered.map(order => `
            <div class="order-card card" data-order-id="${order.id}">
              <div class="order-card-header">
                <div class="order-card-left">
                  <span class="order-card-id">${order.id}</span>
                  <span class="tag ${order.priority === 'high' ? 'tag-red' : order.priority === 'medium' ? 'tag-orange' : 'tag-green'}">${order.priority === 'high' ? '高优先级' : order.priority === 'medium' ? '中优先级' : '低优先级'}</span>
                </div>
                <span class="tag ${orderStatusMap[order.status].color}">${orderStatusMap[order.status].label}</span>
              </div>
              <h3 class="order-card-title">${order.title}</h3>
              <p class="order-card-desc">${order.description}</p>
              <div class="order-card-meta">
                <span>🧪 ${order.type}</span>
                <span>💰 ${order.budget}</span>
                <span>📅 截止 ${order.deadline}</span>
                <span>🏫 ${order.lab ? order.lab.name : '待匹配'}</span>
              </div>
              ${order.milestones.length > 0 ? `
                <div class="order-card-progress">
                  <div class="progress-header">
                    <span>实验进度</span>
                    <span class="progress-pct">${order.progress}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-bar-fill" style="width:${order.progress}%"></div>
                  </div>
                  <div class="milestones-mini">
                    ${order.milestones.map(m => `
                      <span class="milestone-dot ${m.status === 'completed' ? 'done' : m.status === 'in_progress' ? 'active' : 'pending'}" title="${m.name}"></span>
                    `).join('')}
                  </div>
                </div>
              ` : order.status === 'matching' ? `
                <div class="order-card-matching">
                  <div class="matching-animation">
                    <span class="matching-dot"></span>
                    <span class="matching-dot"></span>
                    <span class="matching-dot"></span>
                  </div>
                  <span>AI 正在为您匹配最优实验室...</span>
                </div>
              ` : ''}
              <div class="order-card-footer">
                <span class="order-card-time">创建于 ${order.createdAt}</span>
                <button class="btn btn-ghost btn-sm btn-order-detail" data-id="${order.id}">查看详情</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

        // Tab switching
        el.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => { activeTab = tab.dataset.tab; render(); });
        });

        // Create order
        el.querySelector('#create-order-btn')?.addEventListener('click', showCreateOrderModal);

        // Order detail
        el.querySelectorAll('.btn-order-detail').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const order = orders.find(o => o.id === btn.dataset.id);
                showOrderDetail(order);
            });
        });
    }

    render();
}

function showCreateOrderModal() {
    showModal('发布实验需求', `
    <form id="create-order-form">
      <div class="form-group">
        <label class="form-label">实验名称</label>
        <input class="form-input" placeholder="例：CRISPR基因编辑实验" required>
      </div>
      <div class="form-group">
        <label class="form-label">实验类型</label>
        <select class="form-input form-select">
          <option>基因编辑</option>
          <option>药物分析</option>
          <option>结构生物学</option>
          <option>天然产物化学</option>
          <option>神经科学</option>
          <option>纳米医学</option>
          <option>其他</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">实验描述</label>
        <textarea class="form-input form-textarea" placeholder="详细描述实验需求、技术要求、样品信息等"></textarea>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
        <div class="form-group">
          <label class="form-label">预算范围</label>
          <input class="form-input" placeholder="例：¥30,000 - ¥50,000">
        </div>
        <div class="form-group">
          <label class="form-label">截止日期</label>
          <input class="form-input" type="date">
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">优先级</label>
        <select class="form-input form-select">
          <option value="high">高 - 紧急</option>
          <option value="medium" selected>中 - 正常</option>
          <option value="low">低 - 不急</option>
        </select>
      </div>
    </form>
  `, `
    <button class="btn btn-ghost" onclick="document.getElementById('modal-overlay').classList.add('hidden')">取消</button>
    <button class="btn btn-accent" id="submit-order-btn">🤖 AI智能匹配并发布</button>
  `);

    document.getElementById('submit-order-btn')?.addEventListener('click', () => {
        showToast('需求已发布！AI 正在为您智能匹配实验室...', 'success');
        closeModal();
    });
}

function showOrderDetail(order) {
    showModal(`订单 ${order.id}`, `
    <div class="order-detail">
      <h3 style="margin-bottom:12px">${order.title}</h3>
      <div class="order-detail-meta">
        <span class="tag ${orderStatusMap[order.status].color}">${orderStatusMap[order.status].label}</span>
        <span>🧪 ${order.type}</span>
        <span>💰 ${order.budget}</span>
        <span>📅 ${order.deadline}</span>
      </div>
      <p style="color:var(--text-secondary);margin:16px 0;font-size:14px">${order.description}</p>
      ${order.lab ? `<div style="color:var(--text-secondary);font-size:14px">🏫 执行实验室: <strong style="color:var(--text-primary)">${order.lab.name}</strong></div>` : ''}

      ${order.milestones.length > 0 ? `
        <h4 style="margin:20px 0 12px;color:var(--text-primary)">📋 实验里程碑</h4>
        <div class="milestone-timeline">
          ${order.milestones.map((m, i) => `
            <div class="milestone-item ${m.status}">
              <div class="milestone-marker">
                ${m.status === 'completed' ? '✓' : m.status === 'in_progress' ? '◉' : '○'}
              </div>
              <div class="milestone-info">
                <span class="milestone-name">${m.name}</span>
                <span class="milestone-date">${m.date}</span>
              </div>
              <span class="tag ${m.status === 'completed' ? 'tag-green' : m.status === 'in_progress' ? 'tag-blue' : 'tag-purple'}">${m.status === 'completed' ? '已完成' : m.status === 'in_progress' ? '进行中' : '待开始'}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div class="order-detail-progress" style="margin-top:20px">
        <div class="progress-header">
          <span>总体进度</span>
          <span style="color:var(--accent);font-weight:700">${order.progress}%</span>
        </div>
        <div class="progress-bar" style="height:8px">
          <div class="progress-bar-fill" style="width:${order.progress}%"></div>
        </div>
      </div>
    </div>
  `, `
    <button class="btn btn-ghost" onclick="document.getElementById('modal-overlay').classList.add('hidden')">关闭</button>
    ${order.status === 'in_progress' ? '<button class="btn btn-primary">💬 联系实验室</button>' : ''}
  `);
}
