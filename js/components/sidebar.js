import { store } from '../store.js';
import { router } from '../router.js';

// Centralized sidebar open/close for mobile
export function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('visible');
}

export function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open');
  document.getElementById('sidebar-overlay')?.classList.toggle('visible');
}

const icons = {
  dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  lab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l5 8H4l5-8V3z"/><path d="M8 3h8"/></svg>',
  orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>',
  messages: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
  reagents: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v8L6 18a2 2 0 002 2h8a2 2 0 002-2l-4-8V2"/><path d="M8 2h8"/><path d="M7 16h10"/></svg>',
  twin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
  wetlab: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',
  analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>',
  brand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  simulation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 014 4c0 1.95-2 3-2 8h-4c0-5-2-6.05-2-8a4 4 0 014-4z"/><path d="M10 14h4"/><path d="M10 18h4"/><path d="M11 22h2"/></svg>',
  subscription: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  history: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  // Admin icons
  admDash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  admUsers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
  admLabs: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v7l5 8H4l5-8V3z"/><path d="M8 3h8"/></svg>',
  admOrders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>',
  admFinance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  admSettings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
};

const navItems = [
  {
    section: '概览', items: [
      { id: '/', label: '仪表盘', icon: 'dashboard' },
    ]
  },
  {
    section: '核心', items: [
      { id: '/marketplace', label: '实验室市场', icon: 'lab' },
      { id: '/orders', label: '订单中心', icon: 'orders' },
      { id: '/messages', label: '消息中心', icon: 'messages', badge: () => store.get('unreadMessages') },
    ]
  },
  {
    section: '资源', items: [
      { id: '/reagents', label: '虚拟试剂库', icon: 'reagents' },
      { id: '/digital-twin', label: '数字孪生', icon: 'twin' },
      { id: '/wet-lab', label: '湿实验对接', icon: 'wetlab' },
      { id: '/simulation', label: 'AI 模拟实验', icon: 'simulation' },
    ]
  },
  {
    section: '分析', items: [
      { id: '/analytics', label: '数据分析', icon: 'analytics' },
      { id: '/history', label: '历史数据', icon: 'history' },
    ]
  },
  {
    section: '账户', items: [
      { id: '/subscription', label: '订阅管理', icon: 'subscription' },
    ]
  },
];

const adminNavItems = [
  {
    section: '运营总览', items: [
      { id: '/admin', label: '运营仪表盘', icon: 'admDash' },
    ]
  },
  {
    section: '管理', items: [
      { id: '/admin/users', label: '用户管理', icon: 'admUsers' },
      { id: '/admin/labs', label: '实验室审核', icon: 'admLabs' },
      { id: '/admin/orders', label: '订单监控', icon: 'admOrders' },
    ]
  },
  {
    section: '财务', items: [
      { id: '/admin/finance', label: '财务管理', icon: 'admFinance' },
    ]
  },
  {
    section: '系统', items: [
      { id: '/admin/settings', label: '系统设置', icon: 'admSettings' },
    ]
  },
];

export function renderSidebar() {
  const el = document.getElementById('sidebar');
  const currentHash = window.location.hash.slice(1) || '/';
  const currentRole = store.get('currentRole');
  const isAdmin = currentRole === 'admin';
  const items = isAdmin ? adminNavItems : navItems;

  el.innerHTML = `
    <div class="sidebar-brand">
      <div class="sidebar-brand-icon">${icons.brand}</div>
      <div class="sidebar-brand-text">
        <span class="sidebar-brand-name">BioHub</span>
        <span class="sidebar-brand-tagline">${isAdmin ? '运营管理后台' : '你的虚拟概念验证中心'}</span>
      </div>
    </div>
    <nav class="sidebar-nav">
      ${items.map(section => `
        <div class="sidebar-section-label">${section.section}</div>
        ${section.items.map(item => {
    const badge = item.badge ? item.badge() : 0;
    return `
            <a class="sidebar-nav-item ${currentHash === item.id ? 'active' : ''}" data-route="${item.id}">
              ${icons[item.icon]}
              <span>${item.label}</span>
              ${badge > 0 ? `<span class="badge">${badge}</span>` : ''}
            </a>
          `;
  }).join('')}
      `).join('')}
    </nav>
    <div class="sidebar-footer">
      ${isAdmin ? `
        <button class="sidebar-switch-btn" id="switch-to-front">
          ${icons.back} <span>返回前台</span>
        </button>
      ` : `
        <div class="sidebar-role-switch">
          <div class="role-option ${currentRole === 'requester' ? 'active' : ''}" data-role="requester">需求方</div>
          <div class="role-option ${currentRole === 'lab' ? 'active' : ''}" data-role="lab">实验室</div>
          <div class="role-option" data-role="admin" style="font-size:11px">管理</div>
        </div>
      `}
    </div>
  `;

  // Nav click handlers
  el.querySelectorAll('.sidebar-nav-item').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // Close sidebar BEFORE navigate (navigate triggers re-render)
      closeSidebar();
      router.navigate(a.dataset.route);
    });
  });

  // Role switch handlers
  el.querySelectorAll('.role-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const role = opt.dataset.role;
      store.set('currentRole', role);
      if (role === 'admin') {
        router.navigate('/admin');
      } else {
        router.navigate('/');
      }
    });
  });

  // Back to frontend
  el.querySelector('#switch-to-front')?.addEventListener('click', () => {
    closeSidebar();
    store.set('currentRole', 'requester');
    router.navigate('/');
  });
}
