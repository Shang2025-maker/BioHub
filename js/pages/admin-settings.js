import { announcements, platformConfig } from '../mock/admin-data.js';

let showNewAnnouncement = false;

export function renderAdminSettings() {
    const el = document.getElementById('page-content');

    const statusLabels = { published: '已发布', draft: '草稿' };
    const statusColors = { published: 'tag-green', draft: 'tag-yellow' };

    el.innerHTML = `
  <div class="adm-settings animate-fade-in">
    <div class="adm-page-header">
      <h2>⚙️ 系统设置</h2>
      <span class="adm-page-subtitle">平台参数配置与公告管理</span>
    </div>

    <!-- Platform Config -->
    <div class="card" style="padding:24px;margin-bottom:16px">
      <h3 class="adm-section-title">🔧 平台参数</h3>
      <div class="adm-config-grid">
        <div class="adm-config-item">
          <label class="adm-config-label">佣金比例</label>
          <div class="adm-config-control">
            <input type="number" class="form-input" id="cfg-commission" value="${platformConfig.commissionRate}" min="1" max="20" style="width:80px">
            <span>%</span>
          </div>
        </div>
        <div class="adm-config-item">
          <label class="adm-config-label">最大订单金额</label>
          <div class="adm-config-control">
            <span>¥</span>
            <input type="number" class="form-input" id="cfg-max-order" value="${platformConfig.maxOrderAmount}" style="width:130px">
          </div>
        </div>
        <div class="adm-config-item">
          <label class="adm-config-label">智能匹配</label>
          <div class="adm-config-control">
            <label class="adm-toggle">
              <input type="checkbox" id="cfg-auto-match" ${platformConfig.autoMatch ? 'checked' : ''}>
              <span class="adm-toggle-slider"></span>
            </label>
            <span style="font-size:12px;color:var(--text-tertiary)">${platformConfig.autoMatch ? '已开启' : '已关闭'}</span>
          </div>
        </div>
        <div class="adm-config-item">
          <label class="adm-config-label">默认 AI 模型</label>
          <div class="adm-config-control">
            <select class="form-input" id="cfg-ai-model" style="width:200px">
              <option ${platformConfig.defaultAIModel === 'gpt-4o' ? 'selected' : ''}>gpt-4o</option>
              <option ${platformConfig.defaultAIModel === 'claude-3.5-sonnet' ? 'selected' : ''}>claude-3.5-sonnet</option>
              <option ${platformConfig.defaultAIModel === 'deepseek-v3' ? 'selected' : ''}>deepseek-v3</option>
              <option ${platformConfig.defaultAIModel === 'gemini-2.0-pro' ? 'selected' : ''}>gemini-2.0-pro</option>
            </select>
          </div>
        </div>
      </div>

      <div class="adm-config-sub" style="margin-top:20px">
        <h4 style="font-size:14px;margin-bottom:12px">💳 订阅价格</h4>
        <div class="adm-config-grid">
          <div class="adm-config-item">
            <label class="adm-config-label">免费版</label>
            <div class="adm-config-control"><span>¥</span><input type="number" class="form-input" id="cfg-price-free" value="${platformConfig.subscriptionPrices.free}" style="width:100px" disabled><span>/月</span></div>
          </div>
          <div class="adm-config-item">
            <label class="adm-config-label">专业版</label>
            <div class="adm-config-control"><span>¥</span><input type="number" class="form-input" id="cfg-price-pro" value="${platformConfig.subscriptionPrices.pro}" style="width:100px"><span>/月</span></div>
          </div>
          <div class="adm-config-item">
            <label class="adm-config-label">企业版</label>
            <div class="adm-config-control"><span>¥</span><input type="number" class="form-input" id="cfg-price-ent" value="${platformConfig.subscriptionPrices.enterprise}" style="width:100px"><span>/月</span></div>
          </div>
        </div>
      </div>

      <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--border-subtle)">
        <button class="btn btn-primary" id="adm-save-config">💾 保存配置</button>
      </div>
    </div>

    <!-- Announcements -->
    <div class="card" style="padding:24px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <h3 class="adm-section-title" style="margin:0">📢 公告管理</h3>
        <button class="btn btn-primary btn-sm" id="adm-new-announcement">+ 新建公告</button>
      </div>

      ${showNewAnnouncement ? `
      <div class="adm-new-ann card" style="padding:16px;margin-bottom:16px;border-color:var(--primary)">
        <input type="text" class="form-input" id="ann-title" placeholder="公告标题" style="margin-bottom:8px">
        <textarea class="form-input" id="ann-content" placeholder="公告内容..." rows="3" style="margin-bottom:12px;resize:vertical"></textarea>
        <div style="display:flex;gap:8px">
          <button class="btn btn-primary btn-sm" id="ann-publish">发布</button>
          <button class="btn btn-ghost btn-sm" id="ann-draft">存为草稿</button>
          <button class="btn btn-ghost btn-sm" id="ann-cancel">取消</button>
        </div>
      </div>` : ''}

      <div class="adm-ann-list">
        ${announcements.map(a => `
        <div class="adm-ann-item">
          <div class="adm-ann-header">
            <h4>${a.title}</h4>
            <span class="tag ${statusColors[a.status]}">${statusLabels[a.status]}</span>
          </div>
          <p class="adm-ann-content">${a.content}</p>
          <div class="adm-ann-footer">
            <span style="font-size:11px;color:var(--text-tertiary)">创建于 ${a.createdAt}${a.publishedAt ? ` · 发布于 ${a.publishedAt}` : ''}</span>
            <div style="display:flex;gap:6px">
              ${a.status === 'draft' ? `<button class="btn btn-primary btn-sm adm-ann-pub" data-id="${a.id}">发布</button>` : ''}
              <button class="btn btn-ghost btn-sm adm-ann-del" data-id="${a.id}" style="color:var(--danger)">删除</button>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>

    <!-- Operation Log -->
    <div class="card" style="padding:24px">
      <h3 class="adm-section-title">📝 操作日志</h3>
      <div class="adm-log-list">
        <div class="adm-log-item"><span class="adm-log-time">2025-02-10 10:32</span><span class="adm-log-user">管理员</span><span>审核通过实验室「上海药物研发中心」</span></div>
        <div class="adm-log-item"><span class="adm-log-time">2025-02-09 16:20</span><span class="adm-log-user">管理员</span><span>修改佣金比例 3% → 5%</span></div>
        <div class="adm-log-item"><span class="adm-log-time">2025-02-09 14:05</span><span class="adm-log-user">管理员</span><span>批准「浙大实验室」提现 ¥8,200</span></div>
        <div class="adm-log-item"><span class="adm-log-time">2025-02-08 11:30</span><span class="adm-log-user">管理员</span><span>禁用用户「赵婷」(U005)</span></div>
        <div class="adm-log-item"><span class="adm-log-time">2025-02-07 09:15</span><span class="adm-log-user">管理员</span><span>发布公告「新功能上线：AI模拟实验」</span></div>
        <div class="adm-log-item"><span class="adm-log-time">2025-02-05 17:40</span><span class="adm-log-user">管理员</span><span>驳回实验室「某生物技术公司」入驻申请</span></div>
      </div>
    </div>
  </div>`;

    bindEvents();
}

function bindEvents() {
    const el = document.getElementById('page-content');

    el.querySelector('#adm-save-config')?.addEventListener('click', () => {
        platformConfig.commissionRate = parseFloat(el.querySelector('#cfg-commission').value) || 5;
        platformConfig.maxOrderAmount = parseInt(el.querySelector('#cfg-max-order').value) || 500000;
        platformConfig.autoMatch = el.querySelector('#cfg-auto-match').checked;
        platformConfig.defaultAIModel = el.querySelector('#cfg-ai-model').value;
        platformConfig.subscriptionPrices.pro = parseInt(el.querySelector('#cfg-price-pro').value) || 299;
        platformConfig.subscriptionPrices.enterprise = parseInt(el.querySelector('#cfg-price-ent').value) || 999;
        renderAdminSettings();
    });

    el.querySelector('#adm-new-announcement')?.addEventListener('click', () => { showNewAnnouncement = true; renderAdminSettings(); });
    el.querySelector('#ann-cancel')?.addEventListener('click', () => { showNewAnnouncement = false; renderAdminSettings(); });

    el.querySelector('#ann-publish')?.addEventListener('click', () => {
        const title = el.querySelector('#ann-title').value.trim();
        const content = el.querySelector('#ann-content').value.trim();
        if (title && content) {
            announcements.unshift({ id: `ANN-${Date.now()}`, title, content, status: 'published', createdAt: '2025-02-10', publishedAt: '2025-02-10' });
            showNewAnnouncement = false; renderAdminSettings();
        }
    });

    el.querySelector('#ann-draft')?.addEventListener('click', () => {
        const title = el.querySelector('#ann-title').value.trim();
        const content = el.querySelector('#ann-content').value.trim();
        if (title) {
            announcements.unshift({ id: `ANN-${Date.now()}`, title, content: content || '', status: 'draft', createdAt: '2025-02-10', publishedAt: null });
            showNewAnnouncement = false; renderAdminSettings();
        }
    });

    el.querySelectorAll('.adm-ann-pub').forEach(btn => {
        btn.addEventListener('click', () => {
            const a = announcements.find(a => a.id === btn.dataset.id);
            if (a) { a.status = 'published'; a.publishedAt = '2025-02-10'; renderAdminSettings(); }
        });
    });

    el.querySelectorAll('.adm-ann-del').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = announcements.findIndex(a => a.id === btn.dataset.id);
            if (idx > -1) { announcements.splice(idx, 1); renderAdminSettings(); }
        });
    });
}
