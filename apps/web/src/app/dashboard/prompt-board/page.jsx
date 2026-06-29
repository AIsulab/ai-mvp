import { useState } from "react";
import { Copy, Check, BookOpen, Search, ChevronRight, Sparkles } from "lucide-react";

const categories = [
  { id: "marketing", label: "마케팅 문구", icon: "📣" },
  { id: "sns", label: "SNS 콘텐츠", icon: "📱" },
  { id: "review", label: "리뷰 관리", icon: "⭐" },
  { id: "event", label: "이벤트/쿠폰", icon: "🎉" },
  { id: "menu", label: "메뉴/가격", icon: "🍽️" },
  { id: "customer", label: "고객 관리", icon: "👥" },
];

const prompts = [
  // 마케팅 문구
  {
    category: "marketing",
    title: "날씨 기반 마케팅 문구",
    desc: "오늘 날씨에 맞는 가게 홍보 문구 생성",
    prompt: `당신은 소상공인을 위한 마케팅 전문가입니다.

다음 정보를 바탕으로 마케팅 문구를 작성해주세요:
- 가게 업종: [업종 입력]
- 가게 이름: [이름 입력]
- 주요 메뉴/상품: [메뉴 입력]
- 오늘 날씨: [날씨 입력]
- 타겟 플랫폼: [인스타그램/카카오/블로그 중 선택]

요구사항:
1. 문구 3가지 생성 (각 2-3문장)
2. 이모지 적절히 활용
3. 지역 친화적 톤
4. SNS/카카오채널/매장 안내문에 바로 사용 가능
5. 감성적이면서도 매출에 도움되는 문구`,
  },
  {
    category: "marketing",
    title: "가게 홍보 문구",
    desc: "가게의 장점을 어필하는 홍보 문구",
    prompt: `다음 가게 정보를 바탕으로 홍보 문구를 작성해주세요:

가게 정보:
- 업종: [업종]
- 가게 이름: [이름]
- 위치: [위치]
- 주요 메뉴/상품: [메뉴]
- 가게 장점: [장점 입력]

문구 3가지 작성:
1. 네이버 블로그용 (200자 내외)
2. 인스타그램 게시문 (해시태그 포함)
3. 카카오톡 채널용 (간결하게)

톤: 친근하고 따뜻하게
이모지: 적절히 활용
지역 키워드: [지역] 포함`,
  },
  {
    category: "marketing",
    title: "계절별 마케팅 전략",
    desc: "시즌에 맞는 마케팅 아이디어 제안",
    prompt: `현재 계절/시기에 맞는 소상공인 마케팅 전략을 제안해주세요.

가게 정보:
- 업종: [업종]
- 지역: [지역]
- 현재 시기: [월/계절]

다음을 포함해주세요:
1. 이번 달 추천 이벤트 3가지
2. 계절별 인기 메뉴/상품 아이디어
3. 해시태그 추천 (10개)
4. 게시물 업로드 추천 시간대
5. 경쟁업체 대비 차별화 포인트`,
  },

  // SNS 콘텐츠
  {
    category: "sns",
    title: "인스타그램 게시물",
    desc: "인스타그램용 게시문 + 해시태그",
    prompt: `인스타그램 게시물을 작성해주세요:

가게 정보:
- 업종: [업종]
- 메뉴/상품: [메뉴]
- 오늘의 이벤트: [이벤트]
- 분위기: [따뜻하게/트렌디하게/유머러스하게]

포함할 내용:
1. 본문 (3-5문장, 감성적)
2. 해시태그 15개 (지역+업종+트렌드 키워드)
3. 스토리용 문구 (1줄)
4. 릴스/릴츠 아이디어 (1줄)

톤: [톤 선택]
이모지: 적절히 활용`,
  },
  {
    category: "sns",
    title: "블로그 리뷰 유도 문구",
    desc: "고객 블로그 리뷰를 유도하는 문구",
    prompt: `고객이 블로그 리뷰를 작성하도록 유도하는 문구를 만들어주세요:

가게 정보:
- 업종: [업종]
- 가게 이름: [이름]
- 리뷰 유도 메뉴/상품: [메뉴]

문구 유형:
1. 매장 내 안내문용 (QR코드 포함)
2. 영수증 메시지용 (짧게)
3. 카카오톡 감사 메시지용

포함할 내용:
- 리뷰 작성 시 혜택 (할인/서비스 등)
- 리뷰 작성 가이드 (키워드, 사진 팁)
- 감사 인사`,
  },
  {
    category: "sns",
    title: "유튜브 숏폼 시나리오",
    desc: "유튜브 릴스/틱톡용 영상 시나리오",
    prompt: `소상공인 매장 홍보용 숏폼 영상 시나리오를 만들어주세요:

매장 정보:
- 업종: [업종]
- 매장 분위기: [분위기]
- 주요 메뉴/상품: [메뉴]
- 영상 길이: [15초/30초/60초]

시나리오 구성:
1. 오프닝 (관심 유발)
2. 본문 (매장/메뉴 소개)
3. 클로징 (방문 유도)

추가 포함:
- 자막 문구
- 배경음악 추천
- 해시태그 10개
- 촬영 팁`,
  },

  // 리뷰 관리
  {
    category: "review",
    title: "긍정 리뷰 답변",
    desc: "좋은 리뷰에 대한 감사 답변",
    prompt: `다음 긍정 리뷰에 대한 사장님 답변을 작성해주세요:

리뷰 내용: [리뷰 입력]
가게 업종: [업종]

답변 3가지 버전:
1. 정중하고 공식적인 답변
2. 따뜻하고 친근한 답변
3. 간결하고 임팩트 있는 답변

규칙:
- 과도한 경어 사용 금지
- 자연스러운 한국어
- 각 답변 3-5문장
- 재방문 유도 메시지 포함`,
  },
  {
    category: "review",
    title: "부정 리뷰 대응",
    desc: "나쁜 리뷰에 대한 사과/해명 답변",
    prompt: `다음 부정 리뷰에 대한 사장님 답변을 작성해주세요:

리뷰 내용: [리뷰 입력]
가게 업종: [업종]
실제 상황: [해당 사항 있으면 입력]

답변 3가지 버전:
1. 진정성 있는 사과 + 개선 약속
2. 해명 + 해결 방안
3. 간결한 사과 + 보상 제안

규칙:
- 변명 금지, 책임감 있는 톤
- 구체적인 개선 방안 포함
- 재방문 유도 포함
- 각 답변 3-5문장`,
  },
  {
    category: "review",
    title: "리뷰 분석 리포트",
    desc: "리뷰 데이터를 분석한 개선 리포트",
    prompt: `다음 리뷰들을 분석하고 개선 리포트를 작성해주세요:

리뷰 목록:
[리뷰 1]
[리뷰 2]
[리뷰 3]
(최소 5개 이상 권장)

리포트 구성:
1. 긍정/부정 비율
2. 자주 언급된 키워드 TOP 10
3. 개선 필요 포인트 3가지
4. 강점 3가지
5. 다음 달 개선 계획 제안

형식: 표 + 요약`,
  },

  // 이벤트/쿠폰
  {
    category: "event",
    title: "할인 쿠폰 문구",
    desc: "할인쿠폰/이벤트 문구 생성",
    prompt: `할인 쿠폰/이벤트 문구를 만들어주세요:

이벤트 정보:
- 할인율/혜택: [할인 내용]
- 적용 메뉴/상품: [메뉴]
- 기간: [기간]
- 조건: [조건]

문구 유형:
1. 인스타그램 게시물용
2. 카카오톡 채널용
3. 매장 내 안내문용
4. 영수증 쿠폰용

톤: [기대감 유발/친근/긴급]
이모지: 적절히 활용
CTA: 방문 유도 메시지 포함`,
  },
  {
    category: "event",
    title: "시즌 이벤트 기획",
    desc: "계절별/시즌별 이벤트 기획",
    prompt: `이번 시즌에 맞는 이벤트를 기획해주세요:

가게 정보:
- 업종: [업종]
- 지역: [지역]
- 현재 시기: [월/계절]
- 타겟 고객: [연령대/성별]

이벤트 구성:
1. 이벤트명 (3가지 제안)
2. 혜택 내용
3. 기간
4. 홍보 문구 (각 플랫폼별)
5. 예상 효과
6. 비용 추정

추가:
- 경쟁업체 대비 차별점
- SNS 홍보 전략`,
  },
  {
    category: "event",
    title: "재방문 유도 이벤트",
    desc: "단골 고객 재방문을 위한 이벤트",
    prompt: `단골 고객의 재방문을 유도하는 이벤트를 기획해주세요:

가게 정보:
- 업종: [업종]
- 평균 방문 주기: [주기]
- 리뷰 수: [리뷰 수]

이벤트 제안:
1. 포인트 적립 프로그램
2. 생일/기념일 이벤트
3. 오래된 고객 할인
4. 지인 추천 이벤트

각 이벤트 포함:
- 혜택 내용
- 진행 방법
- 홍보 문구
- 예상 비용`,
  },

  // 메뉴/가격
  {
    category: "menu",
    title: "메뉴 설명 문구",
    desc: "메뉴판/배달앱용 메뉴 설명",
    prompt: `메뉴 설명 문구를 작성해주세요:

메뉴 정보:
- 메뉴명: [메뉴명]
- 가격: [가격]
- 재료/특징: [특징]
- 타겟: [타겟 고객]

문구 유형:
1. 매장 내 메뉴판용 (간결)
2. 배달앱 상세 설명 (200자 내외)
3. 인스타그램 소개용 (감성적)
4. 블로그 리뷰용 (상세)

톤: [맛있게/건강하게/트렌디하게]
포함: 추천 조합/페어링`,
  },
  {
    category: "menu",
    title: "신메뉴 출시 홍보",
    desc: "신메뉴 출시 시 홍보 문구",
    prompt: `신메뉴 출시 홍보 문구를 만들어주세요:

신메뉴 정보:
- 메뉴명: [메뉴명]
- 가격: [가격]
- 특징: [특징]
- 출시 기간: [기간]

홍보 채널별 문구:
1. 인스타그램 (게시물 + 스토리)
2. 카카오톡 채널
3. 네이버 블로그
4. 매장 내 안내문

추가:
- 해시태그 10개
- 촬영 포인트
- 프로모션 제안`,
  },
  {
    category: "menu",
    title: "가격 비교 분석",
    desc: "경쟁업체 대비 가격 분석",
    prompt: `경쟁업체와의 가격 비교 분석을 해주세요:

내 가게 정보:
- 업종: [업종]
- 메뉴/가격: [목록]

분석 요청:
1. 유사 업종 평균 가격 비교
2. 내 가게 가격 포지셔닝
3. 가격 조정 제안
4. 프리미엄 메뉴 아이디어
5. 가성비 메뉴 아이디어

형식: 표 + 요약
추가: 가격에 따른 마케팅 전략`,
  },

  // 고객 관리
  {
    category: "customer",
    title: "단골 고객 관리 메시지",
    desc: "리뷰 남긴 고객에게 보낼 메시지",
    prompt: `리뷰를 남긴 고객에게 보낼 감사 메시지를 만들어주세요:

고객 정보:
- 리뷰 내용: [리뷰]
- 평점: [평점]
- 방문 횟수: [횟수]

메시지 유형:
1. 카카오톡 감사 메시지
2. 재방문 쿠폰 메시지
3. 지인 추천 유도 메시지

톤: [진심/친근/격식]
포함: 다음 방문 시 혜택`,
  },
  {
    category: "customer",
    title: "재방문 유도 메시지",
    desc: "오래 안 온 고객에게 보낼 메시지",
    prompt: `오래 방문하지 않은 고객에게 보낼 메시지를 만들어주세요:

고객 정보:
- 마지막 방문: [날짜]
- 평균 방문 주기: [주기]
- 선호 메뉴: [메뉴]

메시지 유형:
1. 그리운 마음 전달
2. 신메뉴 소식
3. 특별 할인 제안

톤: [부담없는/감성적/혜택 강조]
주의: 과도한 영업 X, 자연스럽게`,
  },
  {
    category: "customer",
    title: "고객 피드백 수집",
    desc: "고객 의견을 수집하는 설문 문구",
    prompt: `고객 피드백을 수집하는 설문 문구를 만들어주세요:

설문 목적:
- 메뉴 개선
- 서비스 개선
- 신메뉴 아이디어

설문 구성:
1. 도입부 (감사 인사)
2. 질문 5-7개 (객관식 + 주관식)
3. 마무리 (감사 + 혜택)

채널별:
- 카카오톡용 (짧게)
- 네이버 블로그용 (상세)
- 매장 내 QR코드용

포함: 설문 완료 시 쿠폰 혜택`,
  },
];

export default function PromptBoardPage() {
  const [activeCategory, setActiveCategory] = useState("marketing");
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredPrompts = prompts.filter(p => {
    const matchCategory = p.category === activeCategory;
    const matchSearch = !searchQuery || 
      p.title.includes(searchQuery) || 
      p.desc.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-[1100px] mx-auto px-4 md:px-5 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={18} className="text-gray-900" />
            <h1 className="text-[20px] font-bold text-gray-900">프롬프트 보드</h1>
          </div>
          <p className="text-[14px] text-gray-600">
            ChatGPT, Claude, Gemini 등 AI 도구에서 바로 사용할 수 있는 프롬프트 모음
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="프롬프트 검색..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Prompts List */}
        <div className="space-y-3">
          {filteredPrompts.map((prompt, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setExpandedId(expandedId === i ? null : i)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[15px] font-semibold text-gray-900">{prompt.title}</h3>
                      <Sparkles size={12} className="text-gray-400" />
                    </div>
                    <p className="text-[13px] text-gray-500">{prompt.desc}</p>
                  </div>
                  <ChevronRight
                    size={16}
                    className={`text-gray-400 transition-transform ${expandedId === i ? "rotate-90" : ""}`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === i && (
                <div className="border-t border-gray-100 p-4 bg-gray-50/50">
                  {/* Preview */}
                  <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3">
                    <pre className="text-[13px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                      {prompt.prompt}
                    </pre>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => copyPrompt(prompt.prompt, i)}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-medium transition-all ${
                      copiedId === i
                        ? "bg-green-50 text-green-600 border border-green-200"
                        : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                  >
                    {copiedId === i ? (
                      <>
                        <Check size={14} /> 복사 완료!
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> 프롬프트 복사하기
                      </>
                    )}
                  </button>

                  {/* Usage Guide */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-[12px] text-blue-800 font-medium mb-1">💡 사용 방법</p>
                    <p className="text-[12px] text-blue-700">
                      1. 위 버튼으로 프롬프트 복사<br />
                      2. ChatGPT/Claude/Gemini 접속<br />
                      3. 복사한 프롬프트 붙여넣기<br />
                      4. [ ] 안의 내용을 실제 정보로 변경<br />
                      5. 전송!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPrompts.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[14px] text-gray-400">검색 결과가 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
