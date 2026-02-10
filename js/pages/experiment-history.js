import { showToast } from '../components/utils.js';

const experiments = [
    { id: 'EXP-2025-001', name: 'CRISPR敲除小鼠p53基因', lab: '清华生医实验室', status: 'completed', date: '2025-01-15', endDate: '2025-02-10', score: 4.8, cost: '¥32,000', type: '基因编辑', successRate: '92%' },
    { id: 'EXP-2025-002', name: '新型抗肿瘤化合物HPLC纯度检测', lab: '上交药研中心', status: 'completed', date: '2025-01-20', endDate: '2025-01-25', score: 4.9, cost: '¥8,500', type: '药物分析', successRate: '98%' },
    { id: 'EXP-2025-003', name: '蛋白质冷冻电镜结构解析', lab: '中科院生物物理所', status: 'completed', date: '2024-12-01', endDate: '2025-01-30', score: 5.0, cost: '¥120,000', type: '结构生物学', successRate: '100%' },
    { id: 'EXP-2025-004', name: '天然产物NMR波谱鉴定', lab: '浙大化学生物学实验室', status: 'completed', date: '2025-01-10', endDate: '2025-01-18', score: 4.5, cost: '¥6,200', type: '化学合成', successRate: '88%' },
    { id: 'EXP-2025-005', name: '小鼠脑区光遗传操控实验', lab: '复旦脑科学院', status: 'failed', date: '2024-11-20', endDate: '2025-01-05', score: 3.2, cost: '¥45,000', type: '神经科学', successRate: '35%' },
    { id: 'EXP-2025-006', name: 'RNA-seq转录组测序分析', lab: '清华生医实验室', status: 'completed', date: '2025-02-01', endDate: '2025-02-05', score: 4.7, cost: '¥15,000', type: '基因组学', successRate: '95%' },
    { id: 'EXP-2024-007', name: 'CAR-T细胞体外杀伤实验', lab: '上交药研中心', status: 'completed', date: '2024-10-15', endDate: '2024-11-20', score: 4.6, cost: '¥58,000', type: '细胞治疗', successRate: '90%' },
    { id: 'EXP-2024-008', name: '药物代谢动力学体内研究', lab: '上交药研中心', status: 'completed', date: '2024-09-01', endDate: '2024-10-10', score: 4.4, cost: '¥35,000', type: '药物分析', successRate: '85%' },
];

export function renderExperimentHistory() {
    const el = document.getElementById('page-content');
    let filterType = 'all';
    let searchQuery = '';
    let sortBy = 'date-desc';

    function getFiltered() {
        let list = [...experiments];
        if (filterType !== 'all') list = list.filter(e => e.type === filterType);
        if (searchQuery) list = list.filter(e => e.name.includes(searchQuery) || e.id.includes(searchQuery) || e.lab.includes(searchQuery));
        if (sortBy === 'date-desc') list.sort((a, b) => new Date(b.date) - new Date(a.date));
        else if (sortBy === 'date-asc') list.sort((a, b) => new Date(a.date) - new Date(b.date));
        else if (sortBy === 'score') list.sort((a, b) => b.score - a.score);
        else if (sortBy === 'cost') list.sort((a, b) => parseInt(b.cost.replace(/[¥,]/g, '')) - parseInt(a.cost.replace(/[¥,]/g, '')));
        return list;
    }

    const types = [...new Set(experiments.map(e => e.type))];
    const totalCost = experiments.reduce((s, e) => s + parseInt(e.cost.replace(/[¥,]/g, '')), 0);
    const avgScore = (experiments.reduce((s, e) => s + e.score, 0) / experiments.length).toFixed(1);
    const successCount = experiments.filter(e => e.status === 'completed').length;

    function render() {
        const filtered = getFiltered();
        el.innerHTML = `
    <div class="hist-page animate-fade-in">
      <!-- Stats -->
      <div class="hist-stats-row">
        <div class="stat-card">
          <div class="stat-card-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg></div>
          <div class="stat-card-content">
            <div class="stat-card-label">总实验数</div>
            <div class="stat-card-value">${experiments.length}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg></div>
          <div class="stat-card-content">
            <div class="stat-card-label">成功率</div>
            <div class="stat-card-value">${Math.round(successCount / experiments.length * 100)}%</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon cyan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg></div>
          <div class="stat-card-content">
            <div class="stat-card-label">总费用</div>
            <div class="stat-card-value">¥${(totalCost / 10000).toFixed(1)}万</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="stat-card-content">
            <div class="stat-card-label">平均评分</div>
            <div class="stat-card-value">${avgScore}</div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="hist-filter-bar card">
        <input class="form-input" id="hist-search" placeholder="🔍 搜索实验编号、名称或实验室..." value="${searchQuery}" style="flex:1;max-width:360px">
        <select class="form-input form-select" id="hist-type" style="width:160px">
          <option value="all" ${filterType === 'all' ? 'selected' : ''}>全部类型</option>
          ${types.map(t => `<option value="${t}" ${filterType === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <select class="form-input form-select" id="hist-sort" style="width:160px">
          <option value="date-desc" ${sortBy === 'date-desc' ? 'selected' : ''}>最新优先</option>
          <option value="date-asc" ${sortBy === 'date-asc' ? 'selected' : ''}>最早优先</option>
          <option value="score" ${sortBy === 'score' ? 'selected' : ''}>评分最高</option>
          <option value="cost" ${sortBy === 'cost' ? 'selected' : ''}>费用最高</option>
        </select>
        <button class="btn btn-ghost btn-sm" id="hist-export">📥 导出 CSV</button>
      </div>

      <!-- Table -->
      <div class="card" style="overflow-x:auto">
        <table class="data-table">
          <thead>
            <tr>
              <th>编号</th>
              <th>实验名称</th>
              <th>实验室</th>
              <th>类型</th>
              <th>状态</th>
              <th>日期</th>
              <th>成功率</th>
              <th>评分</th>
              <th>费用</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.length === 0 ? `<tr><td colspan="10" style="text-align:center;padding:40px;color:var(--text-tertiary)">暂无匹配的实验记录</td></tr>` :
                filtered.map(exp => `
                <tr>
                  <td style="color:var(--primary-light);font-family:var(--font-mono);font-size:12px">${exp.id}</td>
                  <td style="font-weight:600;color:var(--text-primary)">${exp.name}</td>
                  <td>${exp.lab}</td>
                  <td><span class="tag tag-purple">${exp.type}</span></td>
                  <td><span class="tag ${exp.status === 'completed' ? 'tag-green' : 'tag-red'}">${exp.status === 'completed' ? '✅ 完成' : '❌ 失败'}</span></td>
                  <td style="font-size:12px">${exp.date}<br><span style="color:var(--text-tertiary)">→ ${exp.endDate}</span></td>
                  <td style="color:${parseInt(exp.successRate) >= 80 ? 'var(--success)' : 'var(--danger)'};font-weight:600">${exp.successRate}</td>
                  <td>⭐ ${exp.score}</td>
                  <td style="font-weight:600">${exp.cost}</td>
                  <td><button class="btn btn-ghost btn-sm hist-detail-btn" data-id="${exp.id}">详情</button></td>
                </tr>
              `).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
        bindEvents();
    }

    function bindEvents() {
        el.querySelector('#hist-search')?.addEventListener('input', (e) => { searchQuery = e.target.value; render(); });
        el.querySelector('#hist-type')?.addEventListener('change', (e) => { filterType = e.target.value; render(); });
        el.querySelector('#hist-sort')?.addEventListener('change', (e) => { sortBy = e.target.value; render(); });
        el.querySelector('#hist-export')?.addEventListener('click', () => showToast('CSV 文件已导出到下载目录', 'success'));
        el.querySelectorAll('.hist-detail-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const exp = experiments.find(e => e.id === btn.dataset.id);
                if (exp) showDetail(exp);
            });
        });
    }

    function showDetail(exp) {
        const overlay = document.getElementById('modal-overlay');
        overlay.classList.remove('hidden');
        overlay.innerHTML = `
      <div class="modal" style="max-width:560px">
        <div class="modal-header">
          <h3>实验详情 — ${exp.id}</h3>
          <div class="modal-close" id="close-detail"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>
        </div>
        <div class="modal-body">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px">
            <div><span style="color:var(--text-tertiary);font-size:12px">实验名称</span><br><strong>${exp.name}</strong></div>
            <div><span style="color:var(--text-tertiary);font-size:12px">实验室</span><br><strong>${exp.lab}</strong></div>
            <div><span style="color:var(--text-tertiary);font-size:12px">时间周期</span><br><strong>${exp.date} → ${exp.endDate}</strong></div>
            <div><span style="color:var(--text-tertiary);font-size:12px">实验类型</span><br><span class="tag tag-purple">${exp.type}</span></div>
            <div><span style="color:var(--text-tertiary);font-size:12px">费用</span><br><strong style="color:var(--primary-light)">${exp.cost}</strong></div>
            <div><span style="color:var(--text-tertiary);font-size:12px">成功率 / 评分</span><br><strong style="color:var(--success)">${exp.successRate}</strong> / ⭐ ${exp.score}</div>
          </div>
          <div style="padding:12px;background:var(--bg-input);border-radius:var(--radius-md);font-size:13px;color:var(--text-secondary)">
            📎 附件：实验报告.pdf、原始数据.xlsx、分析图表.png
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="close-detail-btn">关闭</button>
          <button class="btn btn-primary" id="reorder-btn">🔄 重新下单</button>
        </div>
      </div>`;
        overlay.querySelector('#close-detail')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelector('#close-detail-btn')?.addEventListener('click', () => overlay.classList.add('hidden'));
        overlay.querySelector('#reorder-btn')?.addEventListener('click', () => { overlay.classList.add('hidden'); showToast('已基于历史实验创建新订单', 'success'); });
        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
    }

    render();
}
