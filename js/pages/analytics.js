export function renderAnalytics() {
    const el = document.getElementById('page-content');

    el.innerHTML = `
    <div class="analytics-page animate-fade-in">
      <!-- Overview Stats -->
      <div class="stats-grid stagger-children">
        <div class="stat-card">
          <div class="stat-card-icon purple"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div>
          <div class="stat-card-content"><div class="stat-card-label">平台总订单</div><div class="stat-card-value">1,247</div><div class="stat-card-change up">↑ 23% 较上月</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon cyan"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6v7l5 8H4l5-8V3z"/></svg></div>
          <div class="stat-card-content"><div class="stat-card-label">注册实验室</div><div class="stat-card-value">86</div><div class="stat-card-change up">↑ 12 本月新增</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3h-8l-2 4h12z"/></svg></div>
          <div class="stat-card-content"><div class="stat-card-label">交易总额</div><div class="stat-card-value">¥18.6M</div><div class="stat-card-change up">↑ 31% 较上季</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon orange"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg></div>
          <div class="stat-card-content"><div class="stat-card-label">平均满意度</div><div class="stat-card-value">4.82</div><div class="stat-card-change up">↑ 0.15 较上月</div></div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-grid">
        <!-- Order Trend Chart -->
        <div class="card chart-card">
          <h3 class="chart-title">订单趋势 (近6个月)</h3>
          <div class="chart-bar-container">
            ${['9月', '10月', '11月', '12月', '1月', '2月'].map((m, i) => {
        const vals = [156, 189, 210, 245, 278, 312];
        const h = (vals[i] / 320) * 100;
        return `<div class="chart-bar-group">
                <div class="chart-bar-wrapper">
                  <div class="chart-bar" style="height:${h}%"><span class="chart-bar-value">${vals[i]}</span></div>
                </div>
                <span class="chart-bar-label">${m}</span>
              </div>`;
    }).join('')}
          </div>
        </div>

        <!-- Category Distribution -->
        <div class="card chart-card">
          <h3 class="chart-title">实验类型分布</h3>
          <div class="donut-chart">
            <svg viewBox="0 0 200 200" width="180" height="180">
              <circle cx="100" cy="100" r="70" fill="none" stroke="var(--primary)" stroke-width="30" stroke-dasharray="110 330" stroke-dashoffset="0" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="70" fill="none" stroke="var(--accent)" stroke-width="30" stroke-dasharray="88 352" stroke-dashoffset="-110" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="70" fill="none" stroke="var(--warning)" stroke-width="30" stroke-dasharray="66 374" stroke-dashoffset="-198" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="70" fill="none" stroke="var(--success)" stroke-width="30" stroke-dasharray="55 385" stroke-dashoffset="-264" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="70" fill="none" stroke="var(--info)" stroke-width="30" stroke-dasharray="44 396" stroke-dashoffset="-319" transform="rotate(-90 100 100)"/>
              <circle cx="100" cy="100" r="70" fill="none" stroke="var(--danger)" stroke-width="30" stroke-dasharray="33 407" stroke-dashoffset="-363" transform="rotate(-90 100 100)"/>
            </svg>
            <div class="donut-legend">
              <span><i style="background:var(--primary)"></i> 基因编辑 25%</span>
              <span><i style="background:var(--accent)"></i> 药物分析 20%</span>
              <span><i style="background:var(--warning)"></i> 结构生物 15%</span>
              <span><i style="background:var(--success)"></i> 化学合成 12.5%</span>
              <span><i style="background:var(--info)"></i> 神经科学 10%</span>
              <span><i style="background:var(--danger)"></i> 其他 17.5%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Lab Rankings -->
      <div class="card" style="margin-top:24px">
        <h3 class="chart-title" style="margin-bottom:16px">🏆 实验室排行榜</h3>
        <table class="data-table">
          <thead><tr><th>排名</th><th>实验室</th><th>完成订单</th><th>成功率</th><th>评分</th><th>总收入</th></tr></thead>
          <tbody>
            <tr><td><span class="rank rank-1">1</span></td><td><strong>中科院生物物理研究所</strong></td><td>134</td><td>99.1%</td><td>⭐ 4.95</td><td>¥3,450,000</td></tr>
            <tr><td><span class="rank rank-2">2</span></td><td><strong>清华大学生物医学工程实验室</strong></td><td>89</td><td>97.8%</td><td>⭐ 4.90</td><td>¥2,340,000</td></tr>
            <tr><td><span class="rank rank-3">3</span></td><td><strong>上海交通大学药物研发中心</strong></td><td>72</td><td>96.5%</td><td>⭐ 4.80</td><td>¥1,890,000</td></tr>
            <tr><td><span class="rank">4</span></td><td><strong>浙江大学化学生物学实验室</strong></td><td>56</td><td>95.2%</td><td>⭐ 4.70</td><td>¥1,120,000</td></tr>
            <tr><td><span class="rank">5</span></td><td><strong>复旦大学脑科学研究院</strong></td><td>42</td><td>96.8%</td><td>⭐ 4.85</td><td>¥980,000</td></tr>
          </tbody>
        </table>
      </div>
    </div>`;
}
