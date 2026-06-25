import { useState } from "react";
import { Star, Copy, Check, AlertCircle, ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { streamAIResponse } from "@/utils/ai";

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
    if (!review.trim()) {
      setError("리뷰 내용을 입력해주세요.");
      return;
    }
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

형식:
[버전 1 - 정중하고 공식적]
(답변 내용)

[버전 2 - 따뜻하고 친근하게]
(답변 내용)

[버전 3 - 간결하고 임팩트 있게]
(답변 내용)

---
📊 리뷰 분석:
- 감성: (긍정/부정/복합)
- 핵심 키워드: (리뷰의 주요 키워드)
- 개선 포인트: (있다면 1~2가지)

규칙: 과도한 경어 사용 금지, 자연스러운 한국어, 각 버전은 3~5문장`;

    const userPrompt = `리뷰 내용: ${review}
답변 유형: ${typeGuide[replyType]}

위 리뷰에 대한 사장님 답변 3가지 버전과 리뷰 분석을 작성해주세요.`;

    try {
      let fullText = "";
      for await (const chunk of streamAIResponse([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ])) {
        fullText += chunk;
        setStreaming(fullText);
      }
      setResult(fullText);
      setStreaming("");
    } catch (err) {
      console.error(err);
      setError("생성 중 오류가 발생했습니다.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const starCount = (text) => {
    const negative = ["불친절", "별로", "실망", "최악", "안 올", "느린", "비싼", "작은", "없는", "불만"];
    const count = negative.filter((w) => text.includes(w)).length;
    if (count >= 2) return 1;
    if (count === 1) return 3;
    return 5;
  };

  const stars = review ? starCount(review) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">리뷰 답변 자동화</h1>
          <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">감성 분석</span>
        </div>
        <p className="text-sm text-gray-500">고객 리뷰를 붙여넣으면 상황에 맞는 답변 3가지 버전과 개선점 분석을 즉시 제공합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {replyTypes.map((rt) => (
          <button
            key={rt.key}
            onClick={() => setReplyType(rt.key)}
            className={`border rounded-xl p-4 text-left transition-colors ${replyType === rt.key ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"}`}
          >
            <div className={`text-sm font-semibold mb-1 ${replyType === rt.key ? "text-[#2563EB]" : "text-gray-900"}`}>{rt.label}</div>
            <div className="text-xs text-gray-500">{rt.desc}</div>
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">고객 리뷰 입력</h2>
          <div className="flex gap-2">
            <button onClick={() => setReview(exampleReviews[0].text)} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors inline-flex items-center gap-1">
              <ThumbsUp size={10} /> 긍정 예시
            </button>
            <button onClick={() => setReview(exampleReviews[1].text)} className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-medium hover:bg-red-100 transition-colors inline-flex items-center gap-1">
              <ThumbsDown size={10} /> 부정 예시
            </button>
          </div>
        </div>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={5}
          placeholder="고객이 남긴 리뷰를 여기에 붙여넣어 주세요..."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder-gray-400 resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 hover:border-gray-300 transition-colors"
        />
        {stars && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-xs text-gray-400">예상 평점:</span>
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className={i < stars ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"} />
              ))}
            </span>
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={isGenerating || !review.trim()}
          className="mt-4 w-full bg-[#2563EB] text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {isGenerating ? (
            <><Loader2 size={15} className="animate-spin" /> 분석 및 답변 생성 중...</>
          ) : (
            <><Star size={15} /> 답변 자동 생성하기</>
          )}
        </button>
      </div>

      {streaming && (
        <div className="bg-white border border-blue-200 rounded-xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            <span className="text-xs font-medium text-blue-600">분석 중...</span>
          </div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{streaming}</pre>
        </div>
      )}

      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">생성된 답변 및 분석</h2>
            <button
              onClick={copy}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 rounded-full hover:border-gray-300"
            >
              {copied ? (
                <><Check size={11} className="text-green-500" /> 복사됨</>
              ) : (
                <><Copy size={11} /> 전체 복사</>
              )}
            </button>
          </div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
}
