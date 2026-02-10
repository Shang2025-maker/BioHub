import { showToast } from '../components/utils.js';

const sopTemplates = [
    { id: 1, name: 'CRISPR基因编辑标准流程', category: '基因编辑', steps: 8, duration: '4-6周', downloads: 234 },
    { id: 2, name: 'Western Blot实验方案', category: '蛋白质', steps: 12, duration: '2-3天', downloads: 567 },
    { id: 3, name: '细胞培养与传代标准操作', category: '细胞培养', steps: 6, duration: '持续', downloads: 891 },
    { id: 4, name: 'RNA提取与RT-qPCR流程', category: '分子生物学', steps: 10, duration: '1-2天', downloads: 445 },
    { id: 5, name: '免疫荧光染色方案', category: '染色', steps: 9, duration: '2天', downloads: 312 },
    { id: 6, name: '动物模型构建SOP', category: '动物实验', steps: 15, duration: '8-12周', downloads: 178 },
];

const sampleTracking = [
    { id: 'SP-001', name: 'CRISPR质粒样品', from: '北京大学', to: '清华生医', status: 'transit', eta: '2026-02-12' },
    { id: 'SP-002', name: '蛋白质样品 (冷链)', from: '药明康德', to: '中科生物', status: 'delivered', eta: '2026-02-08' },
    { id: 'SP-003', name: '化合物库 (96孔板)', from: '恒瑞医药', to: '上交药研', status: 'preparing', eta: '2026-02-15' },
];

const trackingStatusMap = {
    preparing: { label: '准备中', color: 'tag-blue' },
    transit: { label: '运输中', color: 'tag-orange' },
    delivered: { label: '已送达', color: 'tag-green' },
};

export function renderWetLab() {
    const el = document.getElementById('page-content');

    el.innerHTML = `
    <div class="wetlab-page animate-fade-in">
      <div class="tabs" id="wetlab-tabs">
        <div class="tab active" data-tab="sop">SOP模板库</div>
        <div class="tab" data-tab="tracking">样品物流</div>
        <div class="tab" data-tab="data">数据回传</div>
      </div>

      <div id="wetlab-content">
        <!-- SOP Templates -->
        <div class="sop-section">
          <div class="sop-grid stagger-children">
            ${sopTemplates.map(sop => `
              <div class="card sop-card">
                <div class="sop-card-header">
                  <span class="tag tag-purple">${sop.category}</span>
                  <span class="sop-downloads">📥 ${sop.downloads}</span>
                </div>
                <h3 class="sop-card-title">${sop.name}</h3>
                <div class="sop-card-meta">
                  <span>📋 ${sop.steps} 步骤</span>
                  <span>⏱️ ${sop.duration}</span>
                </div>
                <div class="sop-card-actions">
                  <button class="btn btn-ghost btn-sm">预览</button>
                  <button class="btn btn-primary btn-sm btn-use-sop">使用模板</button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Sample Tracking -->
        <div class="tracking-section" style="margin-top:32px">
          <h3 style="margin-bottom:16px;color:var(--text-primary)">📦 样品物流跟踪</h3>
          <div class="card" style="padding:0;overflow:hidden">
            <table class="data-table">
              <thead><tr><th>编号</th><th>样品名称</th><th>发出方</th><th>接收方</th><th>状态</th><th>预计到达</th></tr></thead>
              <tbody>
                ${sampleTracking.map(s => `
                  <tr>
                    <td style="font-family:var(--font-mono);font-size:12px">${s.id}</td>
                    <td><strong style="color:var(--text-primary)">${s.name}</strong></td>
                    <td>${s.from}</td>
                    <td>${s.to}</td>
                    <td><span class="tag ${trackingStatusMap[s.status].color}">${trackingStatusMap[s.status].label}</span></td>
                    <td>${s.eta}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Data Return -->
        <div class="data-return-section" style="margin-top:32px">
          <h3 style="margin-bottom:16px;color:var(--text-primary)">📊 实验数据回传</h3>
          <div class="data-cards stagger-children" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px">
            <div class="card">
              <h4 style="margin-bottom:8px">ORD-2026-001 测序数据</h4>
              <p style="font-size:13px;color:var(--text-tertiary);margin-bottom:12px">Sanger测序验证结果 · 6个文件 · 12.5MB</p>
              <div class="progress-bar"><div class="progress-bar-fill" style="width:100%"></div></div>
              <div style="display:flex;justify-content:space-between;margin-top:8px">
                <span class="tag tag-green">已接收</span>
                <button class="btn btn-ghost btn-sm">下载</button>
              </div>
            </div>
            <div class="card">
              <h4 style="margin-bottom:8px">ORD-2026-002 HPLC图谱</h4>
              <p style="font-size:13px;color:var(--text-tertiary);margin-bottom:12px">10个化合物HPLC结果 · 22个文件 · 87MB</p>
              <div class="progress-bar"><div class="progress-bar-fill" style="width:68%"></div></div>
              <div style="display:flex;justify-content:space-between;margin-top:8px">
                <span class="tag tag-orange">传输中 68%</span>
                <button class="btn btn-ghost btn-sm" disabled>下载</button>
              </div>
            </div>
            <div class="card">
              <h4 style="margin-bottom:8px">ORD-2026-003 电镜数据</h4>
              <p style="font-size:13px;color:var(--text-tertiary);margin-bottom:12px">冷冻电镜采集数据集 · 待上传</p>
              <div class="progress-bar"><div class="progress-bar-fill" style="width:0%"></div></div>
              <div style="display:flex;justify-content:space-between;margin-top:8px">
                <span class="tag tag-blue">等待上传</span>
                <button class="btn btn-ghost btn-sm" disabled>下载</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    el.querySelectorAll('.btn-use-sop').forEach(btn => {
        btn.addEventListener('click', () => showToast('已将模板添加到当前订单', 'success'));
    });
}
