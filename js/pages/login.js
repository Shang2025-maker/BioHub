import { store } from '../store.js';
import { router } from '../router.js';

function createParticles() {
  const colors = ['var(--primary)', 'var(--accent)', 'var(--warning)', 'var(--info)'];
  let html = '';
  for (let i = 0; i < 30; i++) {
    const size = 2 + Math.random() * 6;
    const left = Math.random() * 100;
    const delay = Math.random() * 15;
    const duration = 10 + Math.random() * 20;
    const color = colors[Math.floor(Math.random() * colors.length)];
    html += `<div class="login-particle" style="width:${size}px;height:${size}px;left:${left}%;background:${color};animation-delay:${delay}s;animation-duration:${duration}s"></div>`;
  }
  return html;
}

export function renderLogin() {
  // Hide app, show login
  document.getElementById('app').style.display = 'none';

  let loginPage = document.getElementById('login-page');
  if (!loginPage) {
    loginPage = document.createElement('div');
    loginPage.id = 'login-page';
    document.body.prepend(loginPage);
  }
  loginPage.style.display = 'block';

  let mode = 'login'; // 'login' | 'register'

  function render() {
    loginPage.innerHTML = `
      <div class="login-page">
        <div class="login-bg">
          <div class="login-orb login-orb-1"></div>
          <div class="login-orb login-orb-2"></div>
          <div class="login-orb login-orb-3"></div>
          ${createParticles()}
        </div>
        <div class="login-card">
          <div class="login-brand">
            <div class="login-logo">🧬</div>
            <h1>BioHub</h1>
            <p>你的虚拟概念验证中心</p>
          </div>

          <div class="login-tabs">
            <div class="login-tab ${mode === 'login' ? 'active' : ''}" data-mode="login">登录</div>
            <div class="login-tab ${mode === 'register' ? 'active' : ''}" data-mode="register">注册</div>
          </div>

          ${mode === 'login' ? renderLoginForm() : renderRegisterForm()}

          <div class="login-demo" id="demo-login">
            <span>💡</span> 快速体验：点击使用演示账号登录
          </div>
        </div>
      </div>`;

    bindEvents();
  }

  function renderLoginForm() {
    return `
      <form class="login-form" id="login-form">
        <div class="login-field">
          <label>邮箱 / 手机号</label>
          <span class="field-icon">📧</span>
          <input type="text" id="login-email" placeholder="请输入邮箱或手机号" value="" autocomplete="username">
        </div>
        <div class="login-field">
          <label>密码</label>
          <span class="field-icon">🔒</span>
          <input type="password" id="login-password" placeholder="请输入密码" value="" autocomplete="current-password">
        </div>
        <button type="submit" class="login-submit" id="login-btn">登 录</button>
        <div class="login-footer">
          忘记密码? <a id="forgot-link">点击重置</a>
        </div>
      </form>`;
  }

  function renderRegisterForm() {
    return `
      <form class="login-form" id="register-form">
        <div class="login-field">
          <label>用户名</label>
          <span class="field-icon">👤</span>
          <input type="text" id="reg-name" placeholder="请输入用户名" autocomplete="name">
        </div>
        <div class="login-field">
          <label>邮箱</label>
          <span class="field-icon">📧</span>
          <input type="email" id="reg-email" placeholder="请输入邮箱" autocomplete="email">
        </div>
        <div class="login-field">
          <label>密码</label>
          <span class="field-icon">🔒</span>
          <input type="password" id="reg-password" placeholder="请输入密码 (至少6位)" autocomplete="new-password">
        </div>
        <div class="login-field">
          <label>角色</label>
          <span class="field-icon">🏷️</span>
          <select id="reg-role">
            <option value="requester">需求方 — 我需要实验室服务</option>
            <option value="lab">实验室 — 我可以提供实验服务</option>
          </select>
        </div>
        <button type="submit" class="login-submit" id="register-btn">注 册</button>
        <div class="login-footer">
          注册即表示同意 <a>服务条款</a> 和 <a>隐私政策</a>
        </div>
      </form>`;
  }

  function doLogin(user) {
    const btn = document.querySelector('.login-submit');
    if (btn) {
      btn.classList.add('loading');
      btn.textContent = '';
    }
    setTimeout(() => {
      store.login(user);
      loginPage.style.display = 'none';
      document.getElementById('app').style.display = 'flex';
      router.navigate('/');
    }, 800);
  }

  function bindEvents() {
    // Tab switch
    loginPage.querySelectorAll('.login-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        mode = tab.dataset.mode;
        render();
      });
    });

    // Login form
    const loginForm = loginPage.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pw = document.getElementById('login-password').value.trim();
        if (!email || !pw) return;
        doLogin({ name: email.split('@')[0] || email, email, role: 'requester' });
      });
    }

    // Register form
    const regForm = loginPage.querySelector('#register-form');
    if (regForm) {
      regForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pw = document.getElementById('reg-password').value.trim();
        const role = document.getElementById('reg-role').value;
        if (!name || !email || pw.length < 6) return;
        doLogin({ name, email, role });
      });
    }

    // Demo login
    const demoBtn = loginPage.querySelector('#demo-login');
    if (demoBtn) {
      demoBtn.addEventListener('click', () => {
        doLogin({ name: '李研究员', email: 'demo@biohub.ai', role: 'requester' });
      });
    }
  }

  render();
}

export function hideLogin() {
  const lp = document.getElementById('login-page');
  if (lp) lp.style.display = 'none';
  document.getElementById('app').style.display = 'flex';
}
