import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageSquare, Info, BarChart2, Mic, X } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("정책정보");
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
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage = text.trim();
    setInput("");
    
    const newMessages = [...messages, { id: Date.now(), role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 1. 네이버 검색
      let naverContext = "";
      const searchKeywords = ["맛집", "트렌드", "추천", "리뷰", "블로그", "검색", "요즘"];
      const needsSearch = searchKeywords.some(kw => userMessage.includes(kw));
      
      if (needsSearch) {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: "assistant", content: "🔍 실시간 네이버 데이터를 검색 중입니다...", isStatus: true }]);
        try {
          const naverRes = await fetch(`/api/naver?type=blog&query=${encodeURIComponent(userMessage)}&display=3`);
          const naverData = await naverRes.json();
          if (naverData && naverData.items) {
            naverContext = naverData.items.map((item, idx) => `[${idx+1}] 제목: ${item.title.replace(/<[^>]*>?/gm, '')}\n내용: ${item.description.replace(/<[^>]*>?/gm, '')}`).join('\n\n');
          }
        } catch(e) { console.error("Naver Search Error:", e); }
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      // 2. SGIS 상권
      let sgisContext = "";
      const sgisKeywords = ["상권", "점포", "경쟁", "개수", "밀집", "창업"];
      const needsSgis = sgisKeywords.some(kw => userMessage.includes(kw));
      if (needsSgis) {
        setMessages(prev => [...prev, { id: Date.now() + 2, role: "assistant", content: "📊 공공데이터 상권 통계(SGIS)를 분석 중입니다...", isStatus: true }]);
        try {
          const sgisRes = await fetch(`/api/sgis?radius=500`);
          const sgisData = await sgisRes.json();
          if (sgisData && sgisData.body && sgisData.body.items) {
            const items = sgisData.body.items;
            const summary = items.slice(0, 10).map(item => `- ${item.bizesNm} (${item.indsSclsNm})`).join('\n');
            sgisContext = `검색 반경(500m) 내 주요 상가업소 리스트 (총 ${items.length}개 이상 중 일부):\n${summary}`;
          }
        } catch(e) { console.error("SGIS Search Error:", e); }
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      // 3. 와이파이
      let wifiContext = "";
      const wifiKeywords = ["와이파이", "인터넷", "무료", "wifi", "작업하기"];
      const needsWifi = wifiKeywords.some(kw => userMessage.toLowerCase().includes(kw));
      if (needsWifi) {
        setMessages(prev => [...prev, { id: Date.now() + 3, role: "assistant", content: "📡 전주시 공공 와이파이존 위치를 검색 중입니다...", isStatus: true }]);
        try {
          const wifiRes = await fetch(`/api/wifi`);
          const wifiData = await wifiRes.json();
          if (wifiData && wifiData.data && wifiData.data.items) {
            const items = wifiData.data.items;
            const summary = items.slice(0, 5).map(item => `- 장소: ${item.instlPlace} (주소: ${item.addr})`).join('\n');
            wifiContext = `전주시 무료 공공 와이파이 설치 장소 리스트 (일부):\n${summary}`;
          }
        } catch(e) { console.error("WiFi Search Error:", e); }
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      const chatHistory = messages
        .filter(m => m.id !== 1)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "chat", 
          chatMessage: userMessage,
          chatHistory: chatHistory.slice(-5),
          naverContext,
          sgisContext,
          wifiContext
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");

      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: data.result }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: "❌ 죄송합니다. 응답 생성 중 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* 챗봇 토글 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full shadow-xl flex items-center justify-center z-50 transition-transform hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* 챗봇 위젯 창 */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col z-50 flex-shrink-0 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-[#0B1B3D] text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <h3 className="font-semibold text-[15px]">소상공인 AI 챗봇</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white">
              <X size={18} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC] space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#2563EB] text-white' : 'bg-white border border-gray-200 text-[#0B3B8E] shadow-sm'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={16} />}
                </div>
                <div className={`p-3 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#2563EB] text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none prose prose-sm max-w-none'
                }`}>
                  {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 max-w-[90%] mr-auto">
                <div className="w-7 h-7 rounded-full bg-white border border-gray-200 text-[#0B3B8E] shadow-sm flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-3 shrink-0">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {suggestedQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="text-left px-2.5 py-1.5 text-[12px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors whitespace-nowrap"
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="relative flex items-center bg-gray-50 border border-gray-200 rounded-full focus-within:border-[#2563EB] transition-colors pr-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="질문을 입력하세요..."
                className="flex-1 py-2.5 pl-4 pr-2 bg-transparent outline-none text-[13px] text-gray-800"
                disabled={isLoading}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[#2563EB] text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
