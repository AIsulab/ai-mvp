import { useState } from "react";
import { Zap, Copy, Check, AlertCircle, Instagram } from "lucide-react";
import { streamAIResponse } from "@/utils/ai";
import { Button, Card, Input, PillSelector, Badge } from "../../../components/ui";
import { businessTypes, platforms, moods } from "../../../constants/businessTypes";
import { copyToClipboard } from "../../../utils/clipboard";

export default function SnsContentPage() {
  const [businessType, setBusinessType] = useState("");
  const [event, setEvent] = useState("");
  const [platform, setPlatform] = useState(platforms[0]);
  const [mood, setMood] = useState(moods[0]);
  const [streaming, setStreaming] = useState("");
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!businessType || !event) { setError("업종과 오늘의 이벤트/메뉴를 입력해주세요."); return; }
    setError(null);
    setIsGenerating(true);
    setResult(null);
    setStreaming("");

    const systemPrompt = `당신은 소상공인 SNS 마케팅 전문가입니다. 전북 지역 소상공인의 SNS 게시글을 자동 생성합니다.
형식: 📝 본문 (2~4문장), #️⃣ 해시태그 (10~15개), 💡 스토리/릴스 아이디어 (1~2줄)
규칙: 이모지 활용, 전북/지역 특색 해시태그 포함, 플랫폼 특성에 맞는 길이 조절`;

    const userPrompt = `업종: ${businessType}, 이벤트/메뉴: ${event}, 플랫폼: ${platform}, 분위기: ${mood}
위 조건에 맞는 SNS 콘텐츠를 작성해주세요.`;

    try {
      let fullText = "";
      for await (const chunk of streamAIResponse([{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }])) {
        fullText += chunk;
        setStreaming(fullText);
      }
      setResult(fullText);
      setStreaming("");
    } catch (err) {
      setError("생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copy = (text, key) => { copyToClipboard(text).then(() => { setCopied(key); setTimeout(() => setCopied(null), 2000); }); };

  return (
    <div className="px-5 md:px-8 py-4 md:py-6 animate-fade-in">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-[15px] font-semibold text-[#111827] dark:text-white tracking-tight">SNS 콘텐츠 자동 생성</h1>
          <Badge color="purple">AI 자동화</Badge>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">업종과 오늘의 이벤트를 입력하면 AI가 SNS 게시글과 해시태그를 즉시 완성합니다.</p>
      </div>

      <Card className="mb-4">
        <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-3">콘텐츠 정보 입력</h2>
        <div className="space-y-3 md:space-y-4">
          <PillSelector label="업종" options={businessTypes} value={businessType} onChange={setBusinessType} />
          <Input label="오늘의 메뉴 · 이벤트 · 할인" value={event} onChange={(e) => setEvent(e.target.value)} placeholder="예: 아메리카노 2+1 이벤트, 오늘의 신메뉴 갈비탕..." />
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <PillSelector label="플랫폼" options={platforms} value={platform} onChange={setPlatform} />
            <PillSelector label="분위기" options={moods} value={mood} onChange={setMood} />
          </div>
        </div>
        {error && <div className="mt-2.5 md:mt-3 text-xs md:text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</div>}
        <Button variant="primary" className="w-full mt-4 md:mt-5" onClick={generate} disabled={isGenerating || !businessType || !event} loading={isGenerating}>
          <Instagram size={14} /> SNS 콘텐츠 생성하기
        </Button>
      </Card>

      {streaming && (
        <Card className="border-primary/30 mb-3 md:mb-4">
          <div className="flex items-center gap-2 mb-2.5 md:mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-medium text-primary">AI 생성 중...</span>
          </div>
          <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{streaming}</pre>
        </Card>
      )}

      {result && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white">생성된 콘텐츠</h2>
              <Badge color="gray">{platform}</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => copy(result, "main")}>
              {copied === "main" ? <><Check size={10} className="text-green-500" /> 복사됨</> : <><Copy size={10} /> 전체 복사</>}
            </Button>
          </div>
          <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</pre>
        </Card>
      )}
    </div>
  );
}
