import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, MessageSquare, Info, BarChart2, Mic, Settings } from "lucide-react";
import ReactMarkdown from 'react-markdown';

export default function ChatbotPage() {
  const [activeTab, setActiveTab] = useState("정책정보"); // 정책정보, 상권정보, 통계정보
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
    "너의 사용법이 궁금해!",
    "우리 동네 상권정보 볼 수 있는게 있나요?",
    "현재 지원받을 수 있는 혜택이 있나요?",
    "소상공인을 위한 미소금융 대출이 있나요?",
    "요즘 뜨는 배달 메뉴 좀 추천해줘.",
    "작업하기 좋은 무료 와이파이존 찾아줘!"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = input) => {
    if (!text.trim() || isLoading) return;
    
    const userMessage = text.trim();
    setInput("");
    
    // Add user message to UI
    const newMessages = [...messages, { id: Date.now(), role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // 1. 네이버 검색 필요 여부 판단
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
        } catch(e) {
          console.error("Naver Search Error:", e);
        }
        // 상태 메시지 제거
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      // 2. SGIS 상권 공공데이터 필요 여부 판단
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
            const total = items.length;
            // 간단하게 상권업소명과 업종소분류명을 추출
            const summary = items.slice(0, 10).map(item => `- ${item.bizesNm} (${item.indsSclsNm})`).join('\n');
            sgisContext = `검색 반경(500m) 내 주요 상가업소 리스트 (총 ${total}개 이상 중 일부):\n${summary}`;
          }
        } catch(e) {
          console.error("SGIS Search Error:", e);
        }
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      // 3. 전주시 무료 와이파이 공공데이터 필요 여부 판단
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
        } catch(e) {
          console.error("WiFi Search Error:", e);
        }
        setMessages(prev => prev.filter(m => !m.isStatus));
      }

      // Format history for OpenAI
      const chatHistory = messages
        .filter(m => m.id !== 1) // 첫인사 제외
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          action: "chat", 
          chatMessage: userMessage,
          chatHistory: chatHistory.slice(-5), // 최근 5개만 전송 (비용 절약)
          naverContext: naverContext,
          sgisContext: sgisContext,
          wifiContext: wifiContext
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API Error");

      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: data.result }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), role: "assistant", content: "❌ 죄송합니다. 응답 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." }]);
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
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
      
      {/* Header & Tabs */}
      <div className="pt-8 pb-4 px-6 border-b border-gray-100 flex flex-col items-center shrink-0">
        <h1 className="text-2xl font-bold text-[#0B1B3D] mb-6 flex items-center gap-2 tracking-tight">
          소상공인 AI 챗봇 에게 물어보세요.
        </h1>
        
        <div className="flex bg-[#EBF3FF] p-1 rounded-full w-full max-w-2xl text-sm font-semibold">
          <button 
            onClick={() => setActiveTab("정책정보")}
            className={`flex-1 py-2.5 rounded-full flex justify-center items-center gap-1.5 transition-all ${activeTab === "정책정보" ? "bg-[#0B3B8E] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Info size={16} /> 소상공인 정책정보
          </button>
          <button 
            onClick={() => setActiveTab("상권정보")}
            className={`flex-1 py-2.5 rounded-full flex justify-center items-center gap-1.5 transition-all ${activeTab === "상권정보" ? "bg-[#0B3B8E] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
          >
            <MessageSquare size={16} /> 우리동네 상권정보
          </button>
          <button 
            onClick={() => setActiveTab("통계정보")}
            className={`flex-1 py-2.5 rounded-full flex justify-center items-center gap-1.5 transition-all ${activeTab === "통계정보" ? "bg-[#0B3B8E] text-white shadow-md" : "text-gray-600 hover:text-gray-900"}`}
          >
            <BarChart2 size={16} /> 데이터로 보는 통계정보
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC] space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#2563EB] text-white' : 'bg-white border border-gray-200 text-[#0B3B8E] shadow-sm'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={18} />}
            </div>
            <div className={`p-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-[#2563EB] text-white rounded-tr-none' 
                : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none prose prose-sm max-w-none'
            }`}>
              {msg.role === 'user' ? (
                msg.content
              ) : (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-[#0B3B8E] shadow-sm flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-6 shrink-0">
        <div className="max-w-2xl mx-auto flex flex-col gap-3">
          
          <div className="relative flex items-center bg-white border-2 border-gray-200 hover:border-gray-300 focus-within:border-[#2563EB] transition-colors rounded-full shadow-sm pr-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="궁금한 점을 입력하시면 바로 답변드릴게요."
              className="flex-1 py-4 pl-6 pr-4 bg-transparent outline-none text-[15px] text-gray-800 placeholder-gray-400"
              disabled={isLoading}
            />
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                <Mic size={20} />
              </button>
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-500 text-white hover:bg-[#2563EB] disabled:opacity-50 disabled:hover:bg-gray-500 transition-colors"
              >
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="text-left px-4 py-3 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors flex items-center gap-2"
              >
                <span className="text-gray-400">📄</span> {q}
              </button>
            ))}
          </div>
          
          <div className="text-center text-[11px] text-gray-400 mt-4">
            인공지능은 틀린 정보를 제공할 수 있습니다. 중요한 결정 전에는 반드시 교차 검증을 해주세요.
          </div>
        </div>
      </div>
      
    </div>
  );
}
