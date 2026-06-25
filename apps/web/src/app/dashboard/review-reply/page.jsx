import { useState } from "react";
import {
  Star,
  Copy,
  Check,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

const replyTypes = [
  {
    key: "grateful",
    label: "감사 답변",
    desc: "긍정 리뷰에 진심 어린 감사 전달",
  },
  {
    key: "apologize",
    label: "사과 답변",
    desc: "부정 리뷰에 진정성 있는 사과와 개선 약속",
  },
  { key: "mixed", label: "중립 답변", desc: "복합적인 리뷰에 균형 잡힌 답변" },
];

const exampleReviews = [
  {
    type: "positive",
    text: "음식이 정말 맛있었어요! 서비스도 친절하고 분위기도 좋아서 다음에 또 올게요 😊 주차도 편하고 대기 시간도 짧았습니다.",
  },
  {
    type: "negative",
    text: "음식이 나오는 데 30분이 넘게 걸렸고, 서빙하시는 분이 불친절했습니다. 가격 대비 양도 너무 적었어요. 두 번은 안 올 것 같네요.",
  },
];

const generateMockReply = (review, replyType) => {
  if (replyType === "grateful") {
    return `[버전 1 - 정중하고 공식적]
고객님, 소중한 리뷰를 남겨주셔서 진심으로 감사드립니다. 
저희 매장을 방문해주시고 만족해주셔서 기쁩니다.
앞으로도 변함없는 맛과 서비스로 보답하겠습니다. 감사합니다.

[버전 2 - 따뜻하고 친근하게]
안녕하세요 고객님! 정성스러운 리뷰 정말 감사합니다 😊
맛있게 드셨다니 저희도 너무 뿌듯하네요! 
다음에도 꼭 다시 찾아주세요. 항상 기다리고 있겠습니다 💕

[버전 3 - 간결하고 임팩트 있게]
소중한 별점 5점 감사합니다! 
항상 최고의 맛으로 보답하는 매장이 되겠습니다. 
또 뵙겠습니다!

---
📊 리뷰 분석:
- 감성: 긍정
- 핵심 키워드: 맛, 친절, 분위기, 주차 편리, 대기 시간 짧음
- 개선 포인트: 없음 (현재 상태 유지)`;
  } else if (replyType === "apologize") {
    return `[버전 1 - 정중하고 공식적]
고객님, 이용에 불편을 드려 대단히 죄송합니다.
말씀해주신 부분은 내부적으로 꼭 확인하고 개선하겠습니다.
다음에 방문해주시면 더 나은 서비스로 모시겠습니다. 죄송합니다.

[버전 2 - 따뜻하고 친근하게]
안녕하세요 고객님. 기대하고 오셨을 텐데 실망을 안겨드려 너무 죄송합니다 😥
알려주신 문제점은 꼭 고치도록 하겠습니다!
너그러운 마음으로 한 번 더 기회를 주시면 좋겠습니다 🙏

[버전 3 - 간결하고 임팩트 있게]
불편을 드려 진심으로 사과드립니다.
지적해주신 사항 즉시 개선하겠습니다. 
더 노력하는 매장이 되겠습니다.

---
📊 리뷰 분석:
- 감성: 부정
- 핵심 키워드: 대기 시간 김, 불친절, 적은 양
- 개선 포인트:
  1. 서빙 속도 및 응대 태도 점검
  2. 제공량 및 가격 대비 만족도 재검토`;
  } else {
    return `[버전 1 - 정중하고 공식적]
고객님, 방문해주셔서 감사드리며 소중한 의견 남겨주셔서 고맙습니다.
칭찬해주신 부분은 유지하고, 아쉬웠던 점은 개선하도록 하겠습니다.
더 나은 모습으로 다시 뵙기를 기대하겠습니다.

[버전 2 - 따뜻하고 친근하게]
안녕하세요 고객님! 리뷰 남겨주셔서 정말 감사합니다 😊
좋았던 점도, 아쉬웠던 점도 솔직하게 말씀해주셔서 큰 도움이 됩니다!
부족했던 부분은 바로 고쳐서 다음엔 100% 만족시켜 드릴게요 💕

[버전 3 - 간결하고 임팩트 있게]
솔직한 리뷰 감사합니다!
칭찬은 더 열심히 하라는 의미로, 지적은 더 발전하라는 의미로 새기겠습니다.
다음 방문 시에는 더 나은 서비스로 보답하겠습니다.

---
📊 리뷰 분석:
- 감성: 복합
- 핵심 키워드: 솔직한 평가, 개선점 제시
- 개선 포인트: 고객이 언급한 아쉬운 점 파악 및 대응`;
  }
};

export default function ReviewReplyPage() {
  const [review, setReview] = useState("");
  const [replyType, setReplyType] = useState("grateful");
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

    await new Promise((resolve) => setTimeout(resolve, 1500));
    const text = generateMockReply(review, replyType);
    setResult(text);
    setIsGenerating(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const starCount = (review) => {
    const negative = [
      "불친절",
      "별로",
      "실망",
      "최악",
      "안 올",
      "느린",
      "비싼",
      "작은",
      "없는",
      "불만",
    ];
    const positiveCount = negative.filter((w) => review.includes(w)).length;
    if (positiveCount >= 2) return 1;
    if (positiveCount === 1) return 3;
    return 5;
  };

  const stars = review ? starCount(review) : null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
            리뷰 답변 자동화
          </h1>
          <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full font-medium">
            감성 분석
          </span>
        </div>
        <p className="text-sm text-gray-500">
          고객 리뷰를 붙여넣으면 상황에 맞는 답변 3가지 버전과 개선점 분석을
          즉시 제공합니다.
        </p>
      </div>

      {/* Reply type selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {replyTypes.map((rt) => (
          <button
            key={rt.key}
            onClick={() => setReplyType(rt.key)}
            className={`border rounded-xl p-4 text-left transition-colors ${replyType === rt.key ? "border-[#2563EB] bg-[#EFF6FF]" : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"}`}
          >
            <div
              className={`text-sm font-semibold mb-1 ${replyType === rt.key ? "text-[#2563EB]" : "text-gray-900"}`}
            >
              {rt.label}
            </div>
            <div className="text-xs text-gray-500">{rt.desc}</div>
          </button>
        ))}
      </div>

      {/* Review input */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">
            고객 리뷰 입력
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setReview(exampleReviews[0].text)}
              className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium hover:bg-blue-100 transition-colors inline-flex items-center gap-1"
            >
              <ThumbsUp size={10} /> 긍정 예시
            </button>
            <button
              onClick={() => setReview(exampleReviews[1].text)}
              className="text-xs bg-red-50 text-red-500 px-2.5 py-1 rounded-full font-medium hover:bg-red-100 transition-colors inline-flex items-center gap-1"
            >
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
                <Star
                  key={i}
                  size={12}
                  className={
                    i < stars
                      ? "text-orange-400 fill-orange-400"
                      : "text-gray-200 fill-gray-200"
                  }
                />
              ))}
            </span>
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-red-500 flex items-center gap-1.5">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        <button
          onClick={generate}
          disabled={isGenerating || !review.trim()}
          className="mt-4 w-full bg-[#2563EB] text-white py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>{" "}
              분석 및 답변 생성 중...
            </>
          ) : (
            <>
              <Star size={15} /> 답변 자동 생성하기
            </>
          )}
        </button>
      </div>

      {/* Output */}
      {result && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              생성된 답변 및 분석
            </h2>
            <button
              onClick={copy}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1 border border-gray-200 px-2.5 py-1 rounded-full hover:border-gray-300"
            >
              {copied ? (
                <>
                  <Check size={11} className="text-green-500" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy size={11} />
                  전체 복사
                </>
              )}
            </button>
          </div>
          <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
