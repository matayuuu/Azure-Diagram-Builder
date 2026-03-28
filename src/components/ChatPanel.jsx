import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Sparkles, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import {
  analyzeRequirements,
  mergeRequirements,
  getFollowUpQuestions,
  selectPattern,
  generateDiagramFromPattern,
  buildWellArchitectedSummary,
  parseEditCommand,
  findServiceByText,
} from '../engine/conversationEngine';

const GREETING = {
  role: 'assistant',
  content: `こんにちは！Azure構成図アシスタントです 🏗️

自然言語でAzure構成図を作成できます。以下のように要件を教えてください：

• **「ECサイトのWebアプリを作りたい」**
• **「マイクロサービスアーキテクチャでAPIを構築したい」**
• **「IoTデバイスのデータを収集・分析したい」**
• **「RAGを使ったAIチャットボットを構築したい」**

Azure Well-Architected Framework に基づいたベストプラクティスの構成を提案します。`,
};

export default function ChatPanel({ onGenerateDiagram, onAddNode, onRemoveNode, existingNodes }) {
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [requirements, setRequirements] = useState({});
  const [diagramGenerated, setDiagramGenerated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addMessage = useCallback((role, content) => {
    setMessages(prev => [...prev, { role, content, timestamp: Date.now() }]);
  }, []);

  const addTypingMessage = useCallback(() => {
    setMessages(prev => [...prev, { role: 'assistant', content: '', isTyping: true }]);
  }, []);

  const removeTypingMessage = useCallback(() => {
    setMessages(prev => prev.filter(m => !m.isTyping));
  }, []);

  // Handle follow-up edit commands
  const handleEditCommand = useCallback((text) => {
    const editCmd = parseEditCommand(text);
    if (!editCmd) return false;

    if (editCmd.action === 'add') {
      const service = editCmd.services[0] || findServiceByText(text);
      if (service) {
        onAddNode?.(service);
        addMessage('assistant',
          `✅ **${service.name}** を構成図に追加しました。\n\n他に変更したい箇所はありますか？`
        );
        return true;
      }
      addMessage('assistant',
        '追加するサービスを特定できませんでした。サービス名を具体的に教えてください（例：「Redis Cacheを追加して」）。'
      );
      return true;
    }

    if (editCmd.action === 'remove') {
      const service = editCmd.services[0] || findServiceByText(text);
      if (service) {
        const removed = onRemoveNode?.(service.id);
        if (removed) {
          addMessage('assistant',
            `✅ **${service.name}** を構成図から削除しました。\n\n他に変更したい箇所はありますか？`
          );
        } else {
          addMessage('assistant',
            `⚠️ **${service.name}** は現在の構成図に存在しません。`
          );
        }
        return true;
      }
      addMessage('assistant',
        '削除するサービスを特定できませんでした。サービス名を具体的に教えてください。'
      );
      return true;
    }

    return false;
  }, [addMessage, onAddNode, onRemoveNode]);

  const generateArchitecture = useCallback(async (reqs) => {
    setIsGenerating(true);

    const { key, pattern } = selectPattern(reqs);

    // Step 1: Announce plan
    addMessage('assistant',
      `🎯 **「${pattern.name}」** パターンを基に構成図を作成します。\n\n` +
      `> ${pattern.description}\n\n` +
      `構成要素を順にキャンバスに配置していきます...`
    );

    await delay(800);

    // Step 2: Generate progressively
    const { nodes, edges } = generateDiagramFromPattern(pattern);

    // Progressive rendering: add nodes one by one
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const progress = Math.round(((i + 1) / nodes.length) * 100);
      onGenerateDiagram?.({
        type: 'addNode',
        node,
        progress,
        isLast: i === nodes.length - 1,
        edges: i === nodes.length - 1 ? edges : [],
      });
      await delay(350);
    }

    await delay(300);

    // Step 3: add Well-Architected summary
    const waSummary = buildWellArchitectedSummary(pattern);
    addMessage('assistant',
      `✅ 構成図の作成が完了しました！${nodes.length}個のリソースを配置しました。\n${waSummary}\n\n---\n💬 構成図を編集したい場合は会話で指示できます：\n• 「Redis Cacheを追加して」\n• 「Firewallを削除して」\n• 「もう一つApp Serviceを追加して」`
    );

    setIsGenerating(false);
    setDiagramGenerated(true);
  }, [addMessage, onGenerateDiagram]);

  const processRequirements = useCallback((reqs) => {
    const questions = getFollowUpQuestions(reqs);

    if (questions.length > 0 && !reqs.workloadType) {
      // Need essential info — ask the first question
      const q = questions[0];
      addMessage('assistant', q.text);
      return;
    }

    // We have enough to generate
    generateArchitecture(reqs);
  }, [addMessage, generateArchitecture]);

  const handleOptionClick = useCallback((key, value, label) => {
    addMessage('user', label);
    const merged = mergeRequirements(requirements, { [key]: value });
    setRequirements(merged);

    addTypingMessage();
    delay(400).then(() => {
      removeTypingMessage();
      const questions = getFollowUpQuestions(merged);
      if (questions.length > 0 && !merged.workloadType) {
        const q = questions[0];
        addMessage('assistant', q.text);
      } else {
        generateArchitecture(merged);
      }
    });
  }, [requirements, addMessage, addTypingMessage, removeTypingMessage, generateArchitecture]);

  // Main message handler
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isGenerating) return;

    setInput('');
    addMessage('user', text);

    // If diagram already generated, treat as edit command
    if (diagramGenerated) {
      addTypingMessage();
      await delay(500);
      removeTypingMessage();

      // Check for edit commands
      if (handleEditCommand(text)) return;

      // Check if it's a new diagram request
      const newReqs = analyzeRequirements(text);
      if (newReqs.workloadType && newReqs.workloadType !== requirements.workloadType) {
        // New diagram request
        setRequirements(newReqs);
        setDiagramGenerated(false);
        processRequirements(newReqs);
        return;
      }

      addMessage('assistant',
        `構成図に対する変更を会話形式で指示できます：\n\n• **「Redis Cacheを追加して」**\n• **「Load Balancerを削除して」**\n• **「もっとセキュリティを強化して」**\n\nまたは、新しい構成図を作成する場合は要件を教えてください。`
      );
      return;
    }

    // Analyze and merge requirements
    const newReqs = analyzeRequirements(text);
    const merged = mergeRequirements(requirements, newReqs);
    setRequirements(merged);

    addTypingMessage();
    await delay(600);
    removeTypingMessage();

    processRequirements(merged);
  }, [input, isGenerating, diagramGenerated, requirements, addMessage, addTypingMessage, removeTypingMessage, handleEditCommand, processRequirements]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  // Get last assistant message's questions for option buttons
  const lastAssistantMsg = messages.filter(m => m.role === 'assistant' && !m.isTyping).at(-1);
  const pendingQuestions = !diagramGenerated ? getFollowUpQuestions(requirements) : [];
  const currentQuestion = pendingQuestions.find(q => lastAssistantMsg?.content?.includes(q.text));

  return (
    <div className={`chat-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="chat-header" onClick={() => setIsCollapsed(prev => !prev)}>
        <div className="chat-header-left">
          <Sparkles size={16} />
          <span>AI Architecture Assistant</span>
        </div>
        {isCollapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>

      {!isCollapsed && (
        <>
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.role}`}>
                <div className="chat-message-avatar">
                  {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="chat-message-content">
                  {msg.isTyping ? (
                    <div className="typing-indicator">
                      <Loader2 size={14} className="spin" />
                      <span>考え中...</span>
                    </div>
                  ) : (
                    <MessageContent content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {/* Option buttons for current question */}
            {currentQuestion && !isGenerating && (
              <div className="chat-options">
                {currentQuestion.options.map(opt => (
                  <button
                    key={opt.value}
                    className="chat-option-btn"
                    onClick={() => handleOptionClick(currentQuestion.key, opt.value, opt.label)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {isGenerating && (
              <div className="chat-generating">
                <Loader2 size={14} className="spin" />
                <span>構成図を作成中...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <textarea
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={diagramGenerated ? '構成図を編集する指示を入力...' : '要件を入力してください...'}
              rows={1}
              disabled={isGenerating}
            />
            <button
              className="chat-send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isGenerating}
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Simple markdown-like rendering for chat messages
function MessageContent({ content }) {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <div className="message-text">
      {lines.map((line, i) => {
        // Bold
        let rendered = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Blockquote
        if (rendered.startsWith('> ')) {
          return <blockquote key={i} dangerouslySetInnerHTML={{ __html: rendered.slice(2) }} />;
        }
        // Bullet
        if (rendered.startsWith('• ') || rendered.startsWith('- ')) {
          return <div key={i} className="message-bullet" dangerouslySetInnerHTML={{ __html: rendered }} />;
        }
        // Horizontal rule
        if (rendered.trim() === '---') {
          return <hr key={i} />;
        }
        // Empty line
        if (!rendered.trim()) {
          return <div key={i} className="message-spacer" />;
        }
        return <div key={i} dangerouslySetInnerHTML={{ __html: rendered }} />;
      })}
    </div>
  );
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
