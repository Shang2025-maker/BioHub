import { store } from '../store.js';
import { platformUsers } from '../mock/admin-data.js';

let searchTerm = '';
let roleFilter = 'all';
let statusFilter = 'all';
let detailUser = null;

function getFiltered() {
    return platformUsers.filter(u => {
        if (roleFilter !== 'all' && u.role !== roleFilter) return false;
        if (statusFilter !== 'all' && u.status !== statusFilter) return false;
        if (searchTerm && !u.name.includes(searchTerm) && !u.email.includes(searchTerm) && !u.id.includes(searchTerm)) return false;
        return true;
    });
}

export function renderAdminUsers() {
    const el = document.getElementById('page-content');
    const users = getFiltered();

    const roleLabels = { requester: '需求方', lab: '实验室' };
    const statusLabels = { active: '正常', banned: '已禁用', inactive: '不活跃' };
    const statusColors = { active: 'tag-green', banned: 'tag-red', inactive: 'tag-yellow' };
    const subLabels = { free: '免费版', pro: '专业版', enterprise: '企业版' };
    const subColors = { free: '', pro: 'tag-purple', enterprise: 'tag-cyan' };

    el.innerHTML = `
  <div class="adm-users animate-fade-in">
    <div class="adm-page-header">
      <h2>👥 用户管理</h2>
      <span class="adm-page-subtitle">管理平台所有注册用户</span>
    </div>

    <!-- Stats -->
    <div class="adm-mini-stats">
      <div class="adm-ms-item card"><span class="adm-ms-val">${platformUsers.length}</span><span class="adm-ms-label">总用户</span></div>
      <div class="adm-ms-item card"><span class="adm-ms-val">${platformUsers.filter(u => u.status === 'active').length}</span><span class="adm-ms-label">活跃用户</span></div>
      <div class="adm-ms-item card"><span class="adm-ms-val">${platformUsers.filter(u => u.role === 'requester').length}</span><span class="adm-ms-label">需求方</span></div>
      <div class="adm-ms-item card"><span class="adm-ms-val">${platformUsers.filter(u => u.role === 'lab').length}</span><span class="adm-ms-label">实验室</span></div>
    </div>

    <!-- Filters -->
    <div class="adm-filter-bar card">
      <input type="text" class="form-input" id="adm-user-search" placeholder="🔍 搜索用户名、邮箱..." value="${searchTerm}" style="flex:1;min-width:200px">
      <select class="form-input" id="adm-role-filter" style="width:130px">
        <option value="all" ${roleFilter === 'all' ? 'selected' : ''}>全部角色</option>
        <option value="requester" ${roleFilter === 'requester' ? 'selected' : ''}>需求方</option>
        <option value="lab" ${roleFilter === 'lab' ? 'selected' : ''}>实验室</option>
      </select>
      <select class="form-input" id="adm-status-filter" style="width:130px">
        <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>全部状态</option>
        <option value="active" ${statusFilter === 'active' ? 'selected' : ''}>正常</option>
        <option value="banned" ${statusFilter === 'banned' ? 'selected' : ''}>已禁用</option>
        <option value="inactive" ${statusFilter === 'inactive' ? 'selected' : ''}>不活跃</option>
      </select>
    </div>

    <!-- Table -->
    <div class="card" style="overflow-x:auto">
      <table class="data-table">
        <thead>
          <tr><th>用户</th><th>角色</th><th>邮箱</th><th>订阅</th><th>订单数</th><th>注册时间</th><th>状态</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${users.map(u => `
          <tr>
            <td><div style="display:flex;align-items:center;gap:10px"><div class="avatar" style="background:${u.avatarColor};width:32px;height:32px;font-size:13px">${u.avatar}</div><strong>${u.name}</strong></div></td>
            <td><span class="tag ${u.role === 'lab' ? 'tag-cyan' : 'tag-purple'}">${roleLabels[u.role]}</span></td>
            <td style="font-size:12px;color:var(--text-tertiary)">${u.email}</td>
            <td><span class="tag ${subColors[u.subscription]}">${subLabels[u.subscription]}</span></td>
            <td>${u.orders}</td>
            <td style="font-size:12px">${u.registeredAt}</td>
            <td><span class="tag ${statusColors[u.status]}">${statusLabels[u.status]}</span></td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-ghost btn-sm adm-user-detail" data-id="${u.id}">详情</button>
                <button class="btn btn-ghost btn-sm adm-user-toggle" data-id="${u.id}" style="color:${u.status === 'banned' ? 'var(--success)' : 'var(--danger)'}">${u.status === 'banned' ? '启用' : '禁用'}</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
      ${users.length === 0 ? '<div class="empty-state"><div class="empty-state-icon">🔍</div><div class="empty-state-text">没有匹配的用户</div></div>' : ''}
    </div>

    ${detailUser ? renderUserDetail(detailUser) : ''}
  </div>`;

    bindEvents();
}

function renderUserDetail(u) {
    const roleLabels = { requester: '需求方', lab: '实验室' };
    return `
  <div class="modal-overlay" id="adm-user-modal" style="display:flex">
    <div class="modal card" style="max-width:500px;width:90%;padding:24px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h3>用户详情</h3>
        <button class="btn btn-ghost btn-sm" id="adm-close-detail">✕</button>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px">
        <div class="avatar" style="background:${u.avatarColor};width:56px;height:56px;font-size:24px">${u.avatar}</div>
        <div>
          <h4 style="font-size:18px">${u.name}</h4>
          <span style="color:var(--text-tertiary)">${u.email}</span>
        </div>
      </div>
      <div class="adm-detail-grid">
        <div class="adm-detail-item"><span class="adm-detail-label">ID</span><span>${u.id}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">角色</span><span>${roleLabels[u.role]}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">订阅</span><span>${u.subscription}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">状态</span><span>${u.status}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">注册时间</span><span>${u.registeredAt}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">最后活跃</span><span>${u.lastActive}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">订单数</span><span>${u.orders}</span></div>
        <div class="adm-detail-item"><span class="adm-detail-label">总消费/收入</span><span>¥${u.totalSpent.toLocaleString()}</span></div>
      </div>
    </div>
  </div>`;
}

function bindEvents() {
    const el = document.getElementById('page-content');
    el.querySelector('#adm-user-search')?.addEventListener('input', e => { searchTerm = e.target.value; renderAdminUsers(); });
    el.querySelector('#adm-role-filter')?.addEventListener('change', e => { roleFilter = e.target.value; renderAdminUsers(); });
    el.querySelector('#adm-status-filter')?.addEventListener('change', e => { statusFilter = e.target.value; renderAdminUsers(); });
    el.querySelectorAll('.adm-user-detail').forEach(btn => {
        btn.addEventListener('click', () => { detailUser = platformUsers.find(u => u.id === btn.dataset.id); renderAdminUsers(); });
    });
    el.querySelectorAll('.adm-user-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const u = platformUsers.find(u => u.id === btn.dataset.id);
            if (u) { u.status = u.status === 'banned' ? 'active' : 'banned'; renderAdminUsers(); }
        });
    });
    el.querySelector('#adm-close-detail')?.addEventListener('click', () => { detailUser = null; renderAdminUsers(); });
    el.querySelector('#adm-user-modal')?.addEventListener('click', e => { if (e.target.id === 'adm-user-modal') { detailUser = null; renderAdminUsers(); } });
}
