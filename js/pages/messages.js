import { conversations } from '../mock/messages.js';
import { aiAgent } from '../ai/agent.js';
import { showToast } from '../components/utils.js';

export function renderMessages() {
    const el = document.getElementById('page-content');
    let activeConv = conversations[0];

    function render() {
        el.innerHTML = `
      <div class="messages-page animate-fade-in">
        <!-- Conversation List -->
        <div class="conv-list">
          <div class="conv-list-header">
            <h3>对话</h3>
            <span class="conv-count">${conversations.length}</span>
          </div>
          <div class="conv-list-items">
            ${conversations.map(conv => `
              <div class="conv-item ${conv.id === activeConv.id ? 'active' : ''}" data-conv-id="${conv.id}">
                <div class="conv-item-avatar">
                  <div class="avatar" style="background:${conv.with.avatarColor}">${conv.with.avatar}</div>
                  ${conv.online ? '<span class="status-dot online conv-status-dot"></span>' : ''}
                </div>
                <div class="conv-item-info">
                  <div class="conv-item-top">
                    <span class="conv-item-name">${conv.with.name}</span>
                    <span class="conv-item-time">${conv.lastTime}</span>
                  </div>
                  <p class="conv-item-last truncate">${conv.lastMessage}</p>
                  <span class="conv-item-order truncate">${conv.orderTitle}</span>
                </div>
                ${conv.unread > 0 ? `<span class="conv-unread">${conv.unread}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Chat Area -->
        <div class="chat-area">
          <div class="chat-header">
            <div class="chat-header-info">
              <div class="avatar" style="background:${activeConv.with.avatarColor}">${activeConv.with.avatar}</div>
              <div>
                <h3>${activeConv.with.name}</h3>
                <span class="chat-header-order">📋 ${activeConv.orderTitle}</span>
              </div>
            </div>
            <div class="chat-header-actions">
              <button class="btn btn-ghost btn-sm">📎 文件</button>
              <button class="btn btn-ghost btn-sm">📋 方案</button>
            </div>
          </div>

          <div class="chat-messages" id="chat-messages">
            ${activeConv.messages.map(msg => `
              <div class="chat-msg ${msg.sender === 'me' ? 'sent' : msg.sender === 'ai' ? 'ai-msg' : 'received'}">
                ${msg.sender === 'ai' ? `
                  <div class="chat-msg-ai-badge">AI 助手</div>
                ` : ''}
                <div class="chat-msg-bubble">
                  ${msg.text}
                </div>
                <span class="chat-msg-time">${msg.time}</span>
              </div>
            `).join('')}
          </div>

          <div class="chat-input-area">
            <div class="chat-input-toolbar">
              <button class="chat-tool-btn" title="AI 助手建议">🤖</button>
              <button class="chat-tool-btn" title="发送文件">📎</button>
              <button class="chat-tool-btn" title="发送方案">📋</button>
            </div>
            <div class="chat-input-row">
              <input type="text" class="chat-input" placeholder="输入消息..." id="chat-input">
              <button class="btn btn-primary chat-send-btn" id="send-msg-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // Scroll to bottom
        const chatArea = el.querySelector('#chat-messages');
        if (chatArea) chatArea.scrollTop = chatArea.scrollHeight;

        // Bind events
        el.querySelectorAll('.conv-item').forEach(item => {
            item.addEventListener('click', () => {
                activeConv = conversations.find(c => c.id === item.dataset.convId);
                render();
            });
        });

        // Send message
        const input = el.querySelector('#chat-input');
        const sendBtn = el.querySelector('#send-msg-btn');

        function sendMessage() {
            const text = input.value.trim();
            if (!text) return;

            // Add user message
            activeConv.messages.push({
                id: activeConv.messages.length + 1,
                sender: 'me',
                text,
                time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                type: 'text',
            });

            input.value = '';
            render();

            // Simulate AI response after short delay
            setTimeout(() => {
                const aiResponse = aiAgent.generateResponse(text);
                activeConv.messages.push({
                    id: activeConv.messages.length + 1,
                    sender: 'ai',
                    text: `💡 AI建议：${aiResponse}`,
                    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                    type: 'ai',
                });
                render();
            }, 1200);
        }

        sendBtn?.addEventListener('click', sendMessage);
        input?.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

        // AI suggest button
        el.querySelector('.chat-tool-btn')?.addEventListener('click', () => {
            const suggestion = aiAgent.generateResponse('');
            input.value = suggestion;
        });
    }

    render();
}
