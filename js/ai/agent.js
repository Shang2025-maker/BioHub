// AI Agent - simulated intelligent recommendations
export class AIAgent {
    constructor() {
        this.recommendations = [];
    }

    // Match labs to an order based on specialties
    matchLabs(order, labs) {
        const scored = labs.map(lab => {
            let score = 0;
            // Check specialty match
            lab.specialties.forEach(s => {
                if (order.type && s.includes(order.type)) score += 30;
                if (order.description && order.description.includes(s)) score += 10;
            });
            // Factor in rating and success rate
            score += lab.rating * 5;
            score += lab.successRate * 0.3;
            // Capacity factor
            if (lab.capacity < 50) score += 10;
            if (lab.status === 'online') score += 15;
            return { lab, score: Math.min(100, Math.round(score)) };
        });
        return scored.sort((a, b) => b.score - a.score);
    }

    // Generate AI insight for dashboard
    generateInsights() {
        return [
            {
                type: 'recommendation',
                icon: '🎯',
                title: '智能匹配推荐',
                text: '检测到1个新需求与浙大化生实验室高度匹配(92分)，建议优先推送。',
                action: '查看详情',
                route: '/orders',
            },
            {
                type: 'warning',
                icon: '⚠️',
                title: '库存预警',
                text: '胎牛血清(FBS)库存仅剩1瓶，已低于安全库存线，建议立即补货。',
                action: '去补货',
                route: '/reagents',
            },
            {
                type: 'insight',
                icon: '📊',
                title: '效率分析',
                text: '本月订单完成率较上月提升12%，平均交付周期缩短至18天。',
                action: '查看报告',
                route: '/analytics',
            },
            {
                type: 'schedule',
                icon: '🔬',
                title: '设备调度',
                text: '冷冻电镜明天14:00-18:00有空闲窗口，可安排ORD-003数据采集。',
                action: '安排使用',
                route: '/digital-twin',
            },
        ];
    }

    // Generate chat response
    generateResponse(message) {
        const responses = [
            '根据历史数据分析，建议将实验温度设置在37°C ± 0.5°C以获得最佳结果。',
            '基于类似项目的经验，预计实验周期为15-20天。建议预留3天缓冲时间。',
            '已为您分析了3家候选实验室的报价，推荐性价比最高的方案A。',
            '检测到该试剂即将过期，建议在2周内使用完毕或联系供应商更换。',
            '根据当前进度，项目有望提前3天完成。建议提前准备数据验收材料。',
        ];
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

export const aiAgent = new AIAgent();
