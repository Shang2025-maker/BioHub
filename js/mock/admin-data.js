// Admin backend mock data
export const platformUsers = [
    { id: 'U001', name: '张明', email: 'zhangming@biotech.cn', role: 'requester', avatar: '张', avatarColor: '#6C5CE7', subscription: 'pro', status: 'active', registeredAt: '2024-08-15', lastActive: '2025-02-09', orders: 12, totalSpent: 156000 },
    { id: 'U002', name: '李雪', email: 'lixue@pharma.cn', role: 'requester', avatar: '李', avatarColor: '#00D2D3', subscription: 'enterprise', status: 'active', registeredAt: '2024-06-20', lastActive: '2025-02-10', orders: 28, totalSpent: 890000 },
    { id: 'U003', name: '王强', email: 'wangqiang@chem.edu.cn', role: 'requester', avatar: '王', avatarColor: '#FF6B6B', subscription: 'free', status: 'active', registeredAt: '2025-01-05', lastActive: '2025-02-08', orders: 3, totalSpent: 24000 },
    { id: 'U004', name: '陈思远', email: 'chensiyuan@lab.cn', role: 'lab', avatar: '陈', avatarColor: '#FECA57', subscription: 'pro', status: 'active', registeredAt: '2024-03-10', lastActive: '2025-02-10', orders: 45, totalSpent: 0 },
    { id: 'U005', name: '赵婷', email: 'zhaoting@uni.edu.cn', role: 'requester', avatar: '赵', avatarColor: '#48DBFB', subscription: 'free', status: 'banned', registeredAt: '2024-11-22', lastActive: '2025-01-15', orders: 1, totalSpent: 5000 },
    { id: 'U006', name: '周磊', email: 'zhoulei@genomics.cn', role: 'lab', avatar: '周', avatarColor: '#FF9FF3', subscription: 'enterprise', status: 'active', registeredAt: '2024-01-08', lastActive: '2025-02-10', orders: 67, totalSpent: 0 },
    { id: 'U007', name: '吴芳', email: 'wufang@med.cn', role: 'requester', avatar: '吴', avatarColor: '#54A0FF', subscription: 'pro', status: 'active', registeredAt: '2024-09-18', lastActive: '2025-02-07', orders: 8, totalSpent: 112000 },
    { id: 'U008', name: '郑浩', email: 'zhenghao@cro.cn', role: 'lab', avatar: '郑', avatarColor: '#5F27CD', subscription: 'pro', status: 'inactive', registeredAt: '2024-07-01', lastActive: '2024-12-20', orders: 15, totalSpent: 0 },
];

export const labAudits = [
    { id: 'LA001', name: '清华大学生物工程实验室', contact: '刘教授', email: 'liu@tsinghua.edu.cn', type: '高校实验室', specialties: ['基因编辑', 'CRISPR', '分子克隆'], equipment: ['PCR仪', '测序仪', '超净工作台', '冻干机'], certifications: ['CMA', 'CNAS'], status: 'pending', appliedAt: '2025-02-08', documents: 3 },
    { id: 'LA002', name: '上海药物研发中心', contact: '陈主任', email: 'chen@shpharma.cn', type: 'CRO机构', specialties: ['药物分析', 'HPLC', '质谱'], equipment: ['HPLC系统', '质谱仪', '旋转蒸发仪'], certifications: ['GLP', 'ISO17025'], status: 'pending', appliedAt: '2025-02-06', documents: 5 },
    { id: 'LA003', name: '浙大化学生物学实验室', contact: '王院士', email: 'wang@zju.edu.cn', type: '高校实验室', specialties: ['化学合成', 'NMR', '有机化学'], equipment: ['NMR波谱仪', '红外光谱仪', '元素分析仪'], certifications: ['CNAS'], status: 'approved', appliedAt: '2025-01-20', approvedAt: '2025-01-25', level: '高级', documents: 4 },
    { id: 'LA004', name: '北京基因科技有限公司', contact: '孙总', email: 'sun@bjgene.cn', type: '企业实验室', specialties: ['基因测序', 'RNA-seq', '生物信息学'], equipment: ['二代测序仪', '三代测序仪', '计算集群'], certifications: ['ISO9001'], status: 'approved', appliedAt: '2025-01-10', approvedAt: '2025-01-15', level: '旗舰', documents: 6 },
    { id: 'LA005', name: '某生物技术公司', contact: '李某', email: 'li@unknown.cn', type: '企业实验室', specialties: ['细胞培养'], equipment: ['培养箱'], certifications: [], status: 'rejected', appliedAt: '2025-01-28', rejectedAt: '2025-02-01', rejectReason: '资质文件不完整，设备清单不满足基本要求', documents: 1 },
];

export const platformOrders = [
    { id: 'ORD-2025-001', title: 'CRISPR基因编辑小鼠模型', requester: '张明', lab: '清华大学生物工程实验室', amount: 32000, commission: 1600, status: 'in_progress', type: '基因编辑', createdAt: '2025-01-15', flag: null },
    { id: 'ORD-2025-002', title: 'RNA-seq转录组测序分析', requester: '李雪', lab: '北京基因科技有限公司', amount: 15000, commission: 750, status: 'completed', type: '基因组学', createdAt: '2025-01-20', flag: null },
    { id: 'ORD-2025-003', title: '新型化合物HPLC纯度检测', requester: '李雪', lab: '上海药物研发中心', amount: 8500, commission: 425, status: 'completed', type: '药物分析', createdAt: '2025-01-22', flag: null },
    { id: 'ORD-2025-004', title: '蛋白质Western Blot检测', requester: '王强', lab: '浙大化学生物学实验室', amount: 4200, commission: 210, status: 'dispute', type: '蛋白质', createdAt: '2025-02-01', flag: 'dispute', disputeReason: '实验结果与预期差异过大，需求方要求重新实验' },
    { id: 'ORD-2025-005', title: '细胞增殖MTT实验', requester: '吴芳', lab: '清华大学生物工程实验室', amount: 6800, commission: 340, status: 'in_progress', type: '细胞生物学', createdAt: '2025-02-03', flag: null },
    { id: 'ORD-2025-006', title: 'NMR波谱结构鉴定', requester: '张明', lab: '浙大化学生物学实验室', amount: 12000, commission: 600, status: 'pending', type: '化学分析', createdAt: '2025-02-05', flag: 'large_amount' },
    { id: 'ORD-2025-007', title: '全基因组测序项目', requester: '李雪', lab: '北京基因科技有限公司', amount: 68000, commission: 3400, status: 'in_progress', type: '基因组学', createdAt: '2025-02-06', flag: 'large_amount' },
    { id: 'ORD-2025-008', title: 'RT-qPCR基因表达分析', requester: '吴芳', lab: '清华大学生物工程实验室', amount: 3500, commission: 175, status: 'completed', type: '分子生物学', createdAt: '2025-02-07', flag: null },
];

export const transactions = [
    { id: 'TXN-001', orderId: 'ORD-2025-002', type: 'commission', amount: 750, description: 'RNA-seq订单佣金', status: 'settled', date: '2025-01-28' },
    { id: 'TXN-002', orderId: 'ORD-2025-003', type: 'commission', amount: 425, description: 'HPLC订单佣金', status: 'settled', date: '2025-02-02' },
    { id: 'TXN-003', orderId: null, type: 'withdrawal', amount: -5000, description: '清华实验室提现', status: 'pending', date: '2025-02-08', lab: '清华大学生物工程实验室' },
    { id: 'TXN-004', orderId: null, type: 'withdrawal', amount: -12000, description: '北京基因科技提现', status: 'pending', date: '2025-02-09', lab: '北京基因科技有限公司' },
    { id: 'TXN-005', orderId: 'ORD-2025-008', type: 'commission', amount: 175, description: 'RT-qPCR订单佣金', status: 'settled', date: '2025-02-09' },
    { id: 'TXN-006', orderId: null, type: 'subscription', amount: 299, description: '张明 Pro订阅续费', status: 'settled', date: '2025-02-01' },
    { id: 'TXN-007', orderId: null, type: 'subscription', amount: 999, description: '李雪 Enterprise订阅续费', status: 'settled', date: '2025-02-01' },
    { id: 'TXN-008', orderId: null, type: 'withdrawal', amount: -8200, description: '浙大实验室提现', status: 'approved', date: '2025-02-05', lab: '浙大化学生物学实验室' },
];

export const announcements = [
    { id: 'ANN-001', title: '平台春节期间服务调整通知', content: '2025年春节期间（1月28日-2月4日），平台客服响应时间延长至48小时。', status: 'published', createdAt: '2025-01-20', publishedAt: '2025-01-20' },
    { id: 'ANN-002', title: '新功能上线：AI模拟实验', content: '平台已上线AI模拟实验功能，支持GPT-4o、Claude 3.5等模型。', status: 'published', createdAt: '2025-02-05', publishedAt: '2025-02-05' },
    { id: 'ANN-003', title: '实验室入驻优惠活动', content: '即日起至3月底，新入驻实验室享首月免佣金优惠。', status: 'draft', createdAt: '2025-02-09', publishedAt: null },
];

export const platformConfig = {
    commissionRate: 5,
    maxOrderAmount: 500000,
    autoMatch: true,
    defaultAIModel: 'gpt-4o',
    subscriptionPrices: { free: 0, pro: 299, enterprise: 999 },
};

export const orderStatusColors = {
    pending: { label: '待确认', color: 'tag-yellow' },
    in_progress: { label: '进行中', color: 'tag-cyan' },
    completed: { label: '已完成', color: 'tag-green' },
    dispute: { label: '纠纷中', color: 'tag-red' },
    cancelled: { label: '已取消', color: 'tag-gray' },
};
