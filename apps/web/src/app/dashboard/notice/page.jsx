import { useState } from "react";
import { Bell, Search, ChevronRight, Pin, Eye, Calendar, ArrowLeft } from "lucide-react";

const notices = [
  {
    id: 1,
    title: "W-AI 서비스 오픈 안내",
    date: "2026.06.28",
    views: 1284,
    pinned: true,
    category: "공지",
    content: `W-AI 소상공인 AI 경영 비서 플랫폼이 정식 오픈되었습니다.

주요 기능:
- 날씨 기반 마케팅 문구 자동 생성
- SNS 콘텐츠 자동화 (인스타그램, 블로그, 카카오)
- 고객 리뷰 AI 답변
- 전북 상권 분석
- 정부 지원금 자동 매칭
- 프롬프트 보드 (AI 도구 활용 가이드)

전북 지역 소상공인이라면 누구나 무료로 사용하실 수 있습니다.`,
  },
  {
    id: 2,
    title: "프롬프트 보드 신규 추가 안내",
    date: "2026.06.27",
    views: 567,
    pinned: true,
    category: "업데이트",
    content: `프롬프트 보드가 신규 추가되었습니다.

ChatGPT, Claude, Gemini 등 AI 도구에서 바로 사용할 수 있는 마케팅 프롬프트 18개를 제공합니다.

카테고리:
- 마케팅 문구 (3개)
- SNS 콘텐츠 (3개)
- 리뷰 관리 (3개)
- 이벤트/쿠폰 (3개)
- 메뉴/가격 (3개)
- 고객 관리 (3개)

각 프롬프트는 원클릭으로 복사하여 AI 도구에 붙여넣기 하시면 됩니다.`,
  },
  {
    id: 3,
    title: "기상청 API 연동 안내",
    date: "2026.06.25",
    views: 892,
    pinned: false,
    category: "안내",
    content: `W-AI는 기상청 단기예보 API와 연동하여 실시간 날씨 데이터를 기반으로 마케팅 문구를 생성합니다.

연동 데이터:
- 기온, 습도, 풍속
- 강수 확률, 날씨 상태
- 1시간 단위 예보

전북 주요 도시 (전주, 군산, 익산, 정읍, 남원, 김제) 날씨 데이터를 활용합니다.`,
  },
  {
    id: 4,
    title: "소상공인 지원사업 안내",
    date: "2026.06.24",
    views: 1456,
    pinned: false,
    category: "지원금",
    content: `현재 신청 가능한 소상공인 지원사업 안내입니다.

1. 소상공인 경영안정 바우처
- 지원금: 연 최대 25만원
- 대상: 매출 1.04억 미만
- 마감: 2026.11.30

2. 스마트상점 기술보급사업
- 지원금: 최대 500만원
- 내용: AI, 키오스크 등 스마트기술 도입
- 마감: 2026.08.30

3. 전북 소상공인 특례보증
- 지원금: 최대 3,000만원
- 금리: 연 2.0% 이자지원
- 마감: 2026.10.31

지원금 매칭 기능을 통해 본인에게 맞는 지원사업을 확인하세요.`,
  },
  {
    id: 5,
    title: "서비스 이용 방법 안내",
    date: "2026.06.22",
    views: 2103,
    pinned: false,
    category: "이용법",
    content: `W-AI 서비스 이용 방법 안내입니다.

1. 가게 정보 입력
- 업종, 가게 이름, 메뉴, 지역 입력
- 한 번만 입력하면 자동 저장

2. 날씨 마케팅
- "날씨 분석 시작" 버튼 클릭
- AI가 자동으로 마케팅 문구 생성

3. SNS 콘텐츠
- 플랫폼 선택 (인스타/블로그/카카오)
- 오늘의 이벤트/메뉴 입력
- 문구 자동 생성

4. 리뷰 답변
- 고객 리뷰 붙여넣기
- AI가 맞춤 답변 3가지 생성

5. 프롬프트 보드
- 카테고리 선택 후 프롬프트 복사
- ChatGPT 등 AI 도구에 붙여넣기`,
  },
  {
    id: 6,
    title: "전북 상권 데이터 업데이트",
    date: "2026.06.20",
    views: 678,
    pinned: false,
    category: "업데이트",
    content: `전북 상권 데이터가 최신으로 업데이트되었습니다.

업데이트 내용:
- 소상공인 상권정보 API 연동
- 유동인구 데이터 갱신
- 업종별 매출 통계 반영

상권 분석 기능을 통해 주변 경쟁 업체, 유동인구, 상권 트렌드를 확인하세요.`,
  },
  {
    id: 7,
    title: "개선 사항 안내",
    date: "2026.06.18",
    views: 432,
    pinned: false,
    category: "안내",
    content: `사용자 피드백을 반영한 주요 개선 사항입니다.

1. UI/UX 개선
- 가독성 향상 (폰트 크기 확대)
- 컴포넌트 간격 조정
- 모바일 반응형 최적화

2. 기능 개선
- 날씨 마케팅 문구 품질 향상
- 리뷰 답변 정확도 개선
- SNS 콘텐츠 다양한 톤 지원

3. 신규 기능
- 프롬프트 보드 추가
- 공지사항 게시판 추가

앞으로도 지속적인 개선을 진행하겠습니다.`,
  },
];

const categories = ["전체", "공지", "업데이트", "안내", "지원금", "이용법"];

export default function NoticePage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotices = notices.filter((n) => {
    const matchCategory = selectedCategory === "전체" || n.category === selectedCategory;
    const matchSearch = !searchQuery || n.title.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  if (selectedNotice) {
    return (
      <div className="min-h-screen bg-gray-50/50">
        <div className="max-w-[1100px] mx-auto px-4 md:px-5 py-6">
          <button
            onClick={() => setSelectedNotice(null)}
            className="flex items-center gap-1.5 text-[14px] text-gray-500 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={16} /> 목록으로
          </button>

          <div className="bg-white rounded-xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[12px] bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">
                {selectedNotice.category}
              </span>
              {selectedNotice.pinned && (
                <span className="text-[12px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <Pin size={10} /> 고정
                </span>
              )}
            </div>

            <h1 className="text-[22px] md:text-[26px] font-bold text-gray-900 mb-4 tracking-tight">
              {selectedNotice.title}
            </h1>

            <div className="flex items-center gap-4 text-[13px] text-gray-500 mb-6 pb-4 border-b border-gray-100">
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {selectedNotice.date}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} /> {selectedNotice.views.toLocaleString()}
              </span>
            </div>

            <div className="text-[15px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedNotice.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1100px] mx-auto px-4 md:px-5 py-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Bell size={20} className="text-gray-900" />
          <h1 className="text-[22px] font-bold text-gray-900">공지사항</h1>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="검색..."
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notice List */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setSelectedNotice(notice)}
              className="flex items-center justify-between p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium shrink-0">
                  {notice.category}
                </span>
                {notice.pinned && (
                  <Pin size={12} className="text-blue-500 shrink-0" />
                )}
                <h3 className="text-[15px] font-medium text-gray-900 truncate">
                  {notice.title}
                </h3>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="text-[12px] text-gray-400 hidden sm:block">{notice.date}</span>
                <span className="text-[12px] text-gray-400 hidden sm:flex items-center gap-1">
                  <Eye size={11} /> {notice.views}
                </span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="text-center py-10">
              <p className="text-[14px] text-gray-400">등록된 공지사항이 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
