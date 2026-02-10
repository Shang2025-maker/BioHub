import { store } from '../store.js';

const pageNames = {
  '/': '仪表盘',
  '/marketplace': '实验室市场',
  '/orders': '订单中心',
  '/messages': '消息中心',
  '/reagents': '虚拟试剂库',
  '/digital-twin': '数字孪生',
  '/wet-lab': '湿实验对接',
  '/analytics': '数据分析',
};

export function renderHeader() {
  const el = document.getElementById('header');
  const hash = window.location.hash.slice(1) || '/';
  const pageName = pageNames[hash] || '页面';
  const role = store.get('currentRole');
  const user = role === 'requester'
    ? { name: '李明', initials: '李' }
    : { name: '张教授', initials: '张' };

  el.innerHTML = `
    <div class="header-left">
      <h1 class="header-page-title">${pageName}</h1>
      <div class="header-breadcrumb">
        <span>BioHub</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
        <span>${pageName}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="header-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" placeholder="搜索实验室、订单、试剂..." id="global-search">
      </div>
      <button class="header-icon-btn" title="通知">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        ${store.get('notifications') > 0 ? '<span class="notification-dot"></span>' : ''}
      </button>
      <button class="header-icon-btn" title="AI助手">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a8 8 0 018 8v4a8 8 0 01-16 0V10a8 8 0 018-8z"/><path d="M9 12h0"/><path d="M15 12h0"/><path d="M9 16c.5 1 1.5 2 3 2s2.5-1 3-2"/></svg>
      </button>
      <div class="header-avatar" title="${user.name}">${user.initials}</div>
    </div>
  `;
}
