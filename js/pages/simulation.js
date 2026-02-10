import { store } from '../store.js';
import { showToast } from '../components/utils.js';

const protocolTemplates = [
    { id: 'crispr', name: 'CRISPR-Cas9 基因敲除', desc: '使用CRISPR-Cas9系统对目标基因进行敲除', category: '基因编辑' },
    { id: 'wb', name: 'Western Blot 蛋白检测', desc: '通过免疫印迹法检测目标蛋白表达水平', category: '蛋白质' },
    { id: 'pcr', name: 'RT-qPCR 定量分析', desc: '实时荧光定量PCR检测基因表达水平', category: '分子生物学' },
    { id: 'cellculture', name: '细胞增殖实验 (MTT/CCK-8)', desc: '检测细胞增殖活性与药物毒性', category: '细胞生物学' },
    { id: 'custom', name: '自定义 Protocol', desc: '手动输入完整实验方案', category: '自定义' },
];

const aiModels = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', badge: '推荐', desc: '最强综合能力，生物实验推断准确度最高' },
    { id: 'claude-3.5', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: '', desc: '长文本理解能力强，适合复杂Protocol分析' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'DeepSeek', badge: '高性价比', desc: '性价比极高，中文科研理解优秀' },
    { id: 'gemini-2', name: 'Gemini 2.0 Pro', provider: 'Google', badge: '', desc: '多模态支持好，可结合图表分析' },
];

const simulationResults = {
    crispr: {
        success_rate: '78-85%',
        risk_level: '中等',
        duration: '4-6 周',
        steps: [
            { name: 'sgRNA设计与合成', status: 'success', note: '基于off-target评分选择Top3位点，预计切割效率82%' },
            { name: '载体构建与验证', status: 'success', note: 'pX459质粒系统，T7E1/Sanger测序验证' },
            { name: '细胞转染', status: 'warning', note: '⚠️ HEK293T建议脂质体法(效率>80%)，原代细胞建议电转' },
            { name: '筛选与鉴定', status: 'success', note: '嘌呤霉素2μg/ml筛选48h，单克隆扩增' },
            { name: '功能验证', status: 'info', note: 'WB/qPCR/表型分析多维验证' },
        ],
        suggestions: [
            '建议同时设计3条sgRNA以提高成功率',
            '推荐使用RNP递送方式降低off-target效应',
            '对于困难靶点，可考虑CRISPRi/CRISPRa替代策略',
            '建议预先进行T7E1实验验证切割效率',
        ],
        cost_estimate: '¥8,000 - ¥15,000',
    },
    wb: {
        success_rate: '90-95%',
        risk_level: '低',
        duration: '2-3 天',
        steps: [
            { name: '样品制备与蛋白提取', status: 'success', note: 'RIPA裂解液，BCA法定量，建议上样量30μg' },
            { name: 'SDS-PAGE电泳', status: 'success', note: '根据目标蛋白分子量选择凝胶浓度(10-12%)' },
            { name: '转膜', status: 'success', note: 'PVDF膜，湿转300mA 90min (>100kDa蛋白延长至120min)' },
            { name: '抗体孵育与显影', status: 'warning', note: '⚠️ 一抗稀释比需优化，建议1:500-1:2000梯度' },
        ],
        suggestions: ['内参选择β-actin或GAPDH', '建议先做预实验优化抗体浓度', '注意蛋白酶抑制剂的添加'],
        cost_estimate: '¥500 - ¥2,000',
    },
};

export function renderSimulation() {
    const el = document.getElementById('page-content');
    const config = store.get('aiConfig') || { model: 'gpt-4o', useOwnKey: false, apiKey: '' };
    let selectedProtocol = null;
    let isRunning = false;

    function render() {
        el.innerHTML = `
    <div class="sim-page animate-fade-in">
      <!-- AI Config Panel -->
      <div class="sim-config-bar card">
        <div class="sim-config-left">
          <span class="sim-config-label">🤖 AI 模型</span>
          <select class="form-input form-select sim-model-select" id="sim-model">
            ${aiModels.map(m => `<option value="${m.id}" ${config.model === m.id ? 'selected' : ''}>${m.name} (${m.provider}) ${m.badge ? '⭐' + m.badge : ''}</option>`).join('')}
          </select>
        </div>
        <div class="sim-config-right">
          <label class="sim-key-toggle">
            <input type="checkbox" id="use-own-key" ${config.useOwnKey ? 'checked' : ''}>
            <span>使用自有 API Key</span>
          </label>
          <input type="password" class="form-input sim-key-input ${config.useOwnKey ? '' : 'hidden'}" id="api-key-input" placeholder="输入你的 API Key..." value="${config.apiKey}">
          <span class="sim-key-badge ${config.useOwnKey ? 'own' : 'platform'}">${config.useOwnKey ? '🔑 自有Key' : '🏢 平台Key'}</span>
        </div>
      </div>

      <div class="sim-layout">
        <!-- Left: Protocol Selection -->
        <div class="sim-left">
          <h3 class="sim-section-title">📋 选择实验方案</h3>
          <div class="sim-protocol-list">
            ${protocolTemplates.map(p => `
              <div class="sim-protocol-card card ${selectedProtocol === p.id ? 'selected' : ''}" data-id="${p.id}">
                <div class="sim-protocol-header">
                  <span class="tag tag-purple">${p.category}</span>
                  ${p.id === 'custom' ? '<span class="tag tag-cyan">自定义</span>' : ''}
                </div>
                <h4>${p.name}</h4>
                <p>${p.desc}</p>
              </div>
            `).join('')}
          </div>

          ${selectedProtocol === 'custom' ? `
          <div class="sim-custom-input" style="margin-top:16px">
            <label class="form-label">自定义 Protocol 描述</label>
            <textarea class="form-input form-textarea" id="custom-protocol" rows="6" placeholder="请详细描述你的实验方案，包括目标、方法、步骤等..."></textarea>
          </div>` : ''}

          <button class="btn btn-primary btn-lg sim-run-btn" id="run-sim" ${!selectedProtocol || isRunning ? 'disabled' : ''} style="width:100%;margin-top:16px">
            ${isRunning ? '<span class="matching-animation"><span class="matching-dot"></span><span class="matching-dot"></span><span class="matching-dot"></span></span> AI 分析中...' : '🚀 运行 AI 模拟'}
          </button>
        </div>

        <!-- Right: Results -->
        <div class="sim-right">
          <h3 class="sim-section-title">📊 模拟结果</h3>
          <div id="sim-results" class="sim-results-area">
            <div class="sim-empty-state">
              <div class="sim-empty-icon">🧪</div>
              <p>选择实验方案并点击"运行AI模拟"</p>
              <p style="font-size:12px;color:var(--text-tertiary)">AI将分析实验可行性、预测成功率并给出优化建议</p>
            </div>
          </div>
        </div>
      </div>
    </div>`;
        bindEvents();
    }

    function bindEvents() {
        el.querySelectorAll('.sim-protocol-card').forEach(card => {
            card.addEventListener('click', () => {
                selectedProtocol = card.dataset.id;
                render();
            });
        });

        const modelSelect = el.querySelector('#sim-model');
        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                config.model = modelSelect.value;
                store.set('aiConfig', { ...config });
            });
        }

        const ownKeyCheck = el.querySelector('#use-own-key');
        if (ownKeyCheck) {
            ownKeyCheck.addEventListener('change', () => {
                config.useOwnKey = ownKeyCheck.checked;
                store.set('aiConfig', { ...config });
                render();
            });
        }

        const keyInput = el.querySelector('#api-key-input');
        if (keyInput) {
            keyInput.addEventListener('input', () => {
                config.apiKey = keyInput.value;
                store.set('aiConfig', { ...config });
            });
        }

        const runBtn = el.querySelector('#run-sim');
        if (runBtn) {
            runBtn.addEventListener('click', () => runSimulation());
        }
    }

    function runSimulation() {
        if (!selectedProtocol || isRunning) return;
        isRunning = true;
        render();

        const resultsEl = document.getElementById('sim-results');
        const result = simulationResults[selectedProtocol] || simulationResults['crispr'];
        const modelName = aiModels.find(m => m.id === config.model)?.name || config.model;

        // Simulate typewriter effect
        setTimeout(() => {
            isRunning = false;
            resultsEl.innerHTML = `
        <div class="sim-result-card animate-fade-in">
          <div class="sim-result-header">
            <span class="tag tag-green">✅ 分析完成</span>
            <span style="font-size:12px;color:var(--text-tertiary)">模型: ${modelName}</span>
          </div>

          <div class="sim-result-stats">
            <div class="sim-result-stat">
              <div class="sim-stat-value" style="color:var(--success)">${result.success_rate}</div>
              <div class="sim-stat-label">预测成功率</div>
            </div>
            <div class="sim-result-stat">
              <div class="sim-stat-value" style="color:var(--warning)">${result.risk_level}</div>
              <div class="sim-stat-label">风险等级</div>
            </div>
            <div class="sim-result-stat">
              <div class="sim-stat-value" style="color:var(--accent)">${result.duration}</div>
              <div class="sim-stat-label">预计耗时</div>
            </div>
            <div class="sim-result-stat">
              <div class="sim-stat-value" style="color:var(--primary-light)">${result.cost_estimate}</div>
              <div class="sim-stat-label">预估费用</div>
            </div>
          </div>

          <h4 style="margin: 16px 0 8px; font-size:14px">🔬 步骤分析</h4>
          <div class="sim-steps-list">
            ${result.steps.map((s, i) => `
              <div class="sim-step-item ${s.status}" style="animation-delay:${i * 0.1}s">
                <span class="sim-step-icon">${s.status === 'success' ? '✅' : s.status === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <div class="sim-step-content">
                  <strong>${s.name}</strong>
                  <p>${s.note}</p>
                </div>
              </div>
            `).join('')}
          </div>

          <h4 style="margin: 20px 0 8px; font-size:14px">💡 AI 优化建议</h4>
          <ul class="sim-suggestions">
            ${result.suggestions.map(s => `<li>${s}</li>`).join('')}
          </ul>

          <div class="sim-result-actions">
            <button class="btn btn-primary btn-sm" onclick="document.dispatchEvent(new CustomEvent('sim-apply'))">📋 应用到订单</button>
            <button class="btn btn-ghost btn-sm" onclick="document.dispatchEvent(new CustomEvent('sim-export'))">📥 导出报告</button>
            <button class="btn btn-ghost btn-sm" onclick="document.dispatchEvent(new CustomEvent('sim-save'))">💾 保存记录</button>
          </div>
        </div>`;

            // Bind result action events
            document.addEventListener('sim-apply', () => showToast('已将方案应用到新订单', 'success'), { once: true });
            document.addEventListener('sim-export', () => showToast('报告已导出为PDF', 'success'), { once: true });
            document.addEventListener('sim-save', () => showToast('模拟记录已保存', 'success'), { once: true });

            const btn = el.querySelector('#run-sim');
            if (btn) { btn.disabled = false; btn.innerHTML = '🚀 运行 AI 模拟'; }
        }, 2000);
    }

    render();
}
