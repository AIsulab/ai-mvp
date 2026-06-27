import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageSquare, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "안녕하세요! 소상공인 AI 챗봇입니다.\n\n매출 데이터 분석, 동네 상권 현황, 정부 지원금 정책 등 궁금한 점을 편하게 물어보세요. 사장님의 든든한 비서가 되어드릴게요! 😊"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "우리 동네 상권정보 볼 수 있는게 있나요?",
    "작업하기 좋은 무료 와이파이존 찾아줘!",
    "소상공인을 위한 미소금융 대출이 있나요?",
    "요즘 뜨는 배달 메뉴 좀 추천해줘."
  ];

  const scrollToBottom = () => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;
    const userMessage = text.trim();
    setInput("");
    setMessages(prev => [...prev, { id: Date.now(), role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      let naverContext = "";
      const searchKeywords = ["맛집", "트렌드", "추천", "리뷰", "블로그", "검색", "요즘"];
      if (searchKeywords.some(kw => userMessage.includes(kw))) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: "🔍 실시간 네이버 데이터를 검색 중입니다...", isStatus: true }]);
        try {
          const res = await fetch(`/api/naver?type=blog&query=${encodeURIComponent(userMessage)}&display=3`);
          const data = await res.json();
          if (data?.items) naverContext = data.items.map((item, i) => `[${i+1}] ${item.title.replace(/<[^>]*>?/gm, '')}: ${item.description.replace(/<[^>]*>?/gm, '')}`).join('\n\n');
        } catch(e) {}
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      let sgisContext = "";
      const sgisKeywords = ["상권", "점포", "경쟁", "개수", "밀집", "창업"];
      if (sgisKeywords.some(kw => userMessage.includes(kw))) {
        setMessages(prev => [...prev, { id: Date.now() + 2, role: "assistant", content: "📊 공공데이터 상권 통계(SGIS)를 분석 중입니다...", isStatus: true }]);
        try {
          const res = await fetch(`/api/sgis?radius=500`);
          const data = await res.json();
          if (data?.body?.items) sgisContext = `검색 반경 내 주요 상가업소:\n${data.body.items.slice(0, 10).map(i => `- ${i.bizesNm} (${i.indsSclsNm})`).join('\n')}`;
        } catch(e) {}
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      let wifiContext = "";
      if (["와이파이", "internet", "무료", "wifi", "작업하기"].some(kw => userMessage.toLowerCase().includes(kw))) {
        setMessages(prev => [...prev, { id: Date.now() + 3, role: "assistant", content: "📡 전주시 공공 와이파이존 위치를 검색 중입니다...", isStatus: true }]);
        try {
          const res = await fetch(`/api/wifi`);
          const data = await res.json();
          if (data?.data?.items) wifiContext = `전주시 무료 와이파이:\n${data.data.items.slice(0, 8).map(i => `- ${i.instlPlace}: ${i.addr}`).join('\n')}`;
        } catch(e) {}
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      const chatHistory = messages.filter(m => m.id !== 1).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "chat", chatMessage: userMessage, chatHistory: chatHistory.slice(-5), naverContext, sgisContext, wifiContext }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: data.result }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: "❌ 응답 생성 중 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-6 right-6 w-12 h-12 md:w-14 md:h-14 bg-primary hover:bg-primary-dark text-white rounded-full shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-110 active:scale-95">
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 md:bottom-24 md:right-6 w-[calc(100vw-2rem)] max-w-[400px] h-[calc(100vh-10rem)] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col z-50 animate-slide-up">
          <div className="bg-[#0B1B3D] text-white p-3.5 md:p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <h3 className="font-semibold text-sm md:text-[15px]">소상공인 AI 챗봇</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white p-1"><X size={16} /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 dark:bg-gray-900 space-y-3 md:space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                <div className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-primary shadow-sm'}`}>
                  {msg.role === 'user' ? <User size={13} /> : <Bot size={14} />}
                </div>
                <div className={`p-2.5 md:p-3 rounded-2xl text-[13px] md:text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-tr-none'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-tl-none'
                }`}>
                  {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 max-w-[90%] mr-auto">
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-primary shadow-sm flex items-center justify-center shrink-0"><Bot size={14} /></div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2.5 md:p-3 shrink-0">
            <div className="flex flex-wrap gap-1 md:gap-1.5 mb-2 md:mb-3">
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => handleSend(q)} disabled={isLoading}
                  className="text-left px-2 md:px-2.5 py-1 md:py-1.5 text-[10px] md:text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors whitespace-nowrap disabled:opacity-50">
                  {q}
                </button>
              ))}
            </div>
            <div className="relative flex items-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus-within:border-primary transition-colors">
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요..." disabled={isLoading}
                className="flex-1 py-2 md:py-2.5 pl-3 md:pl-4 pr-2 bg-transparent outline-none text-xs md:text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500" />
              <button onClick={() => handleSend()} disabled={!input.trim() || isLoading}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition-colors mr-0.5">
                <Send size={13} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
