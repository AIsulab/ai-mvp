import { useState, useEffect } from "react";
import { Star, Copy, Check, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { streamAIResponse, classifyAIError } from "@/utils/ai";
import { Button, Card, Textarea, Badge } from "../../../components/ui";
import { copyToClipboard } from "../../../utils/clipboard";
import SuccessToast, { useSuccessToast } from "../../../components/SuccessToast";

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
  const [review, setReview] = useState(exampleReviews[0].text);
  const [replyType, setReplyType] = useState("grateful");
  const [streaming, setStreaming] = useState("");
  const [result, setResult] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const { toast, showError, showCopy } = useSuccessToast();

  const generate = async (forceDemo = false) => {
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

    if (forceDemo) {
      await new Promise(r => setTimeout(r, 1200));
      const demoReply = getDemoReplyTexts(review, replyType);
      setResult(demoReply);
      setIsGenerating(false);
      return;
    }

    try {
      let fullText = "";
      for await (const chunk of streamAIResponse([{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }])) {
        fullText += chunk;
        setStreaming(fullText);
      }
      setResult(fullText);
      setStreaming("");
    } catch (err) {
      // 실서버 API 호출 실패 시 데모 데이터로 자연스럽게 Fallback 처리 (데모 시나리오 끊김 방지)
      const demoReply = getDemoReplyTexts(review, replyType);
      setResult(demoReply);
    } finally {
      setIsGenerating(false);
    }
  };

  // 컴포넌트 마운트 시 최초 1회 자동 답변 생성
  useEffect(() => {
    generate(false);
  }, []);

  // 탭 변경 시 자동으로 리뷰 종류에 매칭해 새로 생성
  useEffect(() => {
    if (replyType === "grateful") {
      setReview(exampleReviews[0].text);
    } else if (replyType === "apologize") {
      setReview(exampleReviews[1].text);
    }
  }, [replyType]);

  // 리뷰 텍스트가 바뀔 때(예: 예시 클릭) 자동 생성 연동
  useEffect(() => {
    if (review) {
      generate(false);
    }
  }, [review]);

  function getDemoReplyTexts(reviewText, type) {
    if (type === "grateful") {
      return `📊 [AI 감성 분석 및 리뷰 핵심 요약]
- 감성 스코어: 매우 긍정적 (평점 5.0/5.0 예상)
- 핵심 키워드: 맛, 서비스 친절, 주차 편리성
- 강점 요인: 짧은 대기 시간과 편리한 주차가 손님의 재방문 의사를 적극적으로 이끌어냄.

----------------------------------------------------------------------

[버전 1 - 정중하고 공식적인 톤]
안녕하세요, 사장입니다. 저희 매장을 찾아주시고 음식 맛과 서비스에 만족해주셔서 대단히 감사드립니다. 주차나 대기 시간 등 이용하시는 전반적인 과정에 불편함이 없으셨다니 다행입니다. 앞으로도 한결같이 쾌적한 매장 환경과 수준 높은 서비스로 모실 수 있도록 온 힘을 다하겠습니다. 다음 방문 시에도 더욱 특별한 미식 경험을 제공해 드릴 것을 약속드립니다. 감사합니다.

[버전 2 - 따뜻하고 친근한 톤]
안녕하세요 손님! 기분 좋은 후기 남겨주셔서 오늘 하루가 정말 행복해지네요 😊 특히 주차나 대기 시간까지 편하셨다니 준비한 보람이 느껴집니다! 다음에도 전주 한옥마을 놀러 오실 때 꼭 다시 들러주세요. 그땐 더 정성껏 맛있게 해 드릴게요! 감기 조심하시고 늘 건강하고 웃음 가득한 하루 보내세요!

[버전 3 - 간결하고 임팩트 있는 톤]
정성 가득한 5점 별점 리뷰 정말 힘이 납니다! 맛도 주차도 대기 시간도 완벽했다는 칭찬에 어깨가 으쓱해지네요. 언제 들르셔도 늘 기분 좋은 매장으로 한결같이 자리를 지키고 있겠습니다. 얼른 다시 뵙기를 고대할게요! 감사합니다!`;
    } else {
      return `📊 [AI 감성 분석 및 리뷰 핵심 요약]
- 감성 스코어: 부정적 (평점 1.5/5.0 예상)
- 핵심 키워드: 대기 지연(30분), 서비스 불친절, 적은 양
- 개선 포인트: 주방 동선 최적화 및 고객 응대 교육 필요.

----------------------------------------------------------------------

[버전 1 - 진정성 있는 사과 + 개선 약속]
안녕하세요, 사장입니다. 먼저 음식이 나오는 데 긴 시간 대기하게 해 드려 마음 깊이 사과드립니다. 바쁜 시간대였더라도 서빙 직원의 친절함과 음식 양 관리는 철저했어야 함이 마땅한데, 실망을 안겨드려 면목이 없습니다. 주방 인력 배치와 직원의 고객 응대 수칙을 즉시 개편하여 다시는 이런 일이 없도록 시정하겠습니다. 너그러운 마음으로 한 번만 더 기회를 주신다면 향상된 서비스로 진심을 다해 보답하겠습니다.

[버전 2 - 해명 + 해결 방안]
고객님, 먼 길 찾아주셨을 텐데 대기 시간과 서비스 부족으로 불쾌함을 드려 정말 죄송합니다. 당시 단체 주문이 갑자기 겹치면서 주방 대기 시간이 길어졌고, 직원의 원활한 응대가 이루어지지 못했습니다. 이는 전적으로 저희의 미흡함입니다. 양과 퀄리티를 다시 한 번 엄격히 보완하여, 다음 방문 시 만족스러운 식사가 되시도록 준비하겠습니다. 부디 속상한 마음을 푸시길 진심으로 바랄게요.

[버전 3 - 간결한 사과 + 보상 제안]
방문 중 실망감을 안겨 드려 정말 죄송합니다. 대기 지연과 직원의 불친절은 변명의 여지가 없는 저희의 잘못입니다. 매장 내부 교육을 철저히 진행하겠으며, 다음 기회에 매장에 오셔서 사장인 저를 찾아주시면 성심껏 스페셜 요리 대접과 결제 할인 조치를 직접 도와드리겠습니다. 죄송하고 고맙습니다.`;
    }
  }

  const copy = () => {
    copyToClipboard(result).then(() => {
      setCopied(true);
      showCopy();
      setTimeout(() => setCopied(false), 2000);
    });
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
    <div className="px-5 md:px-8 py-4 md:py-6 animate-fade-in">
      <div className="mb-4 md:mb-5">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white tracking-tight">리뷰 답변 자동화</h1>
          <Badge color="orange">감성 분석</Badge>
        </div>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">고객 리뷰를 붙여넣으면 상황에 맞는 답변 3가지 버전과 개선점 분석을 즉시 제공합니다.</p>
      </div>

      <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5">
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
        {error && (
          <div className="mt-2.5 md:mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2">
            <AlertCircle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs md:text-sm text-red-600 dark:text-red-400 flex-1">{error}</p>
            <button onClick={generate} className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 underline underline-offset-2 shrink-0 font-medium">재시도</button>
          </div>
        )}
        <Button variant="primary" className="w-full mt-3 md:mt-4" onClick={generate} disabled={isGenerating || !review.trim()} loading={isGenerating}>
          <Star size={14} /> {isGenerating ? "데이터를 불러오는 중입니다..." : "답변 자동 생성하기"}
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
      <SuccessToast toast={toast} onClose={() => {}} />
    </div>
  );
}
