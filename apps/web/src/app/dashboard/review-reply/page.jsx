import { useState } from "react";
import { Star, Copy, Check, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { streamAIResponse } from "@/utils/ai";
import { Button, Card, Textarea, Badge } from "../../../components/ui";
import { copyToClipboard } from "../../../utils/clipboard";

const replyTypes = [
  { key: "grateful", label: "감사 답변", desc: "긍정 리뷰에 진심 어린 감사 전달" },
  { key: "apologize", label: "사과 답변", desc: "부정 리뷰에 진정성 있는 사과와 개선 약속" },
  { key: "mixed", label: "중립 답변", desc: "복합적인 리뷰에 균형 잡힌 답변" },
];

const exampleReviews = [
  { type: "positive", text: "음식이 정말 맛있었어요! 서비스도 친절하고 분위기도 좋아서 다음에 또 올게요 😊 주차도 편하고 대기 시간도 짧았습니다." },
  { type: "negative", text: "음식이 나오는 데 30분이 넘게 걸렸고, 서빙하시는 분이 불친절했습니다. 가격 대비 양도 너무 적었어요. 두 번은 안 올 것 같네요." },
];

export default function ReviewReplyPage() {
  const [review, setReview] = useState("");
  const [replyType, setReplyType] = useState("grateful");
  const [streaming, setStreaming] = useState("");
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    if (!review.trim()) { setError("리뷰 내용을 입력해주세요."); return; }
    setError(null);
    setIsGenerating(true);
    setResult(null);
    setStreaming("");

    const typeGuide = {
      grateful: "긍정적인 리뷰에 대한 따뜻하고 진심 어린 감사 답변",
      apologize: "부정적인 리뷰에 대한 진정성 있는 사과와 구체적인 개선 약속이 담긴 답변",
      mixed: "긍정과 부정이 섞인 리뷰에 균형 잡힌 감사와 개선 의지를 담은 답변",
    };

    const systemPrompt = `당신은 소상공인을 위한 고객 응대 전문가입니다. 고객 리뷰에 대한 사장님 입장의 진정성 있는 답변을 3가지 버전으로 작성해줍니다.
형식: [버전 1 - 정중하고 공식적], [버전 2 - 따뜻하고 친근하게], [버전 3 - 간결하고 임팩트 있게]
📊 리뷰 분석: 감성, 핵심 키워드, 개선 포인트
규칙: 과도한 경어 사용 금지, 자연스러운 한국어, 각 버전은 3~5문장`;

    const userPrompt = `리뷰 내용: ${review}\n답변 유형: ${typeGuide[replyType]}\n위 리뷰에 대한 사장님 답변 3가지 버전과 리뷰 분석을 작성해주세요.`;

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

  const copy = () => { copyToClipboard(result).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); };

  const starCount = (text) => {
    const negative = ["불친절", "별로", "실망", "최악", "안 올", "느린", "비싼", "작은", "없는", "불만"];
    const count = negative.filter((w) => text.includes(w)).length;
    if (count >= 2) return 1;
    if (count === 1) return 3;
    return 5;
  };

  const stars = review ? starCount(review) : null;

  return (
    <div className="px-5 md:px-8 py-4 md:py-6 animate-fade-in">
      <div className="mb-4 md:mb-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white tracking-tight">리뷰 답변 자동화</h1>
          <Badge color="orange">감성 분석</Badge>
        </div>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">고객 리뷰를 붙여넣으면 상황에 맞는 답변 3가지 버전과 개선점 분석을 즉시 제공합니다.</p>
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5">
        {replyTypes.map((rt) => (
          <button key={rt.key} onClick={() => setReplyType(rt.key)}
            className={`border rounded-xl p-2.5 md:p-4 text-left transition-all ${replyType === rt.key ? "border-primary bg-primary/10 shadow-sm" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 active:scale-[0.98]"}`}>
            <div className={`text-xs md:text-sm font-semibold mb-0.5 md:mb-1 ${replyType === rt.key ? "text-primary" : "text-gray-900 dark:text-white"}`}>{rt.label}</div>
            <div className="text-[9px] md:text-xs text-gray-500 dark:text-gray-400 hidden sm:block">{rt.desc}</div>
          </button>
        ))}
      </div>

      <Card className="mb-4 md:mb-5">
        <div className="flex items-center justify-between mb-2.5 md:mb-3">
          <h2 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">고객 리뷰 입력</h2>
          <div className="flex gap-1 md:gap-2">
            <Button variant="ghost" size="sm" onClick={() => setReview(exampleReviews[0].text)}><ThumbsUp size={9} /> 긍정</Button>
            <Button variant="ghost" size="sm" onClick={() => setReview(exampleReviews[1].text)}><ThumbsDown size={9} /> 부정</Button>
          </div>
        </div>
        <Textarea value={review} onChange={(e) => setReview(e.target.value)} rows={4} placeholder="고객이 남긴 리뷰를 여기에 붙여넣어 주세요..." />
        {stars && (
          <div className="mt-1.5 md:mt-2 flex items-center gap-1">
            <span className="text-[10px] md:text-xs text-gray-400">예상 평점:</span>
            <span className="flex">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={11} className={i < stars ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"} />))}</span>
          </div>
        )}
        {error && <div className="mt-2.5 md:mt-3 text-xs md:text-sm text-red-500 flex items-center gap-1.5"><AlertCircle size={13} /> {error}</div>}
        <Button variant="primary" className="w-full mt-3 md:mt-4" onClick={generate} disabled={isGenerating || !review.trim()} loading={isGenerating}>
          <Star size={14} /> 답변 자동 생성하기
        </Button>
      </Card>

      {streaming && (
        <Card className="border-primary/30 mb-3 md:mb-4">
          <div className="flex items-center gap-2 mb-2.5 md:mb-3">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] md:text-xs font-medium text-primary">분석 중...</span>
          </div>
          <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{streaming}</pre>
        </Card>
      )}

      {result && (
        <Card>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-xs md:text-sm font-semibold text-gray-900 dark:text-white">생성된 답변 및 분석</h2>
            <Button variant="ghost" size="sm" onClick={copy}>
              {copied ? <><Check size={10} className="text-green-500" /> 복사됨</> : <><Copy size={10} /> 전체 복사</>}
            </Button>
          </div>
          <pre className="text-xs md:text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{result}</pre>
        </Card>
      )}
    </div>
  );
}
