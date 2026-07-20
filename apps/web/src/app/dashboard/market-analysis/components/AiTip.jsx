import { Lightbulb, RefreshCw } from "lucide-react";

const tips = [
  {
    title: "비 오는 날 전략",
    content: "야외 관광객이 줄고 실내 배달 수요가 늘어납니다. 배달 플랫폼 프로모션과 실내 좌석 안내를 강조하세요.",
    tags: ["배달", "실내"],
  },
  {
    title: "주말 특화 전략",
    content: "한옥마을 관광객 유입이 늘어나는 주말에는 가족/커플 세트 메뉴와 포토존을 활용한 SNS 마케팅이 효과적입니다.",
    tags: ["관광객", "SNS"],
  },
  {
    title: "경쟁 업종 대응",
    content: "주변 동일 업종이 밀집되어 있다면 차별화된 시그니처 메뉴와 단골 리뷰 확보가 핵심입니다.",
    tags: ["차별화", "단골"],
  },
  {
    title: "저녁 시간대 공략",
    content: "퇴근 시간대(17~19시) 직장인 타겟 퇴근길 이벤트와 해피아워 할인이 매출 증대에 효과적입니다.",
    tags: ["퇴근길", "할인"],
  },
  {
    title: "계절별 메뉴 전략",
    content: "계절에 맞는 한정 메뉴 출시는 고객 관심도를 높이고 재방문율을 향상시킵니다.",
    tags: ["계절", "한정"],
  },
];

export default function AiTip({ weather }) {
  const tipIndex = weather?.condition?.includes("비") ? 0
    : weather?.condition?.includes("흐림") || weather?.condition?.includes("구름") ? 2
    : new Date().getDay() === 0 || new Date().getDay() === 6 ? 1
    : new Date().getHours() >= 17 ? 3
    : 4;

  const tip = tips[tipIndex];

  return (
    <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/15 dark:to-transparent border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Lightbulb size={14} className="text-amber-600 dark:text-amber-400" />
        </div>
        <h4 className="text-xs font-bold text-amber-800 dark:text-amber-400">W-AI 상권 권장 전략</h4>
      </div>
      <p className="text-[11px] text-amber-900/80 dark:text-amber-500/70 leading-relaxed mb-2">
        {tip.content}
      </p>
      <div className="flex flex-wrap gap-1">
        {tip.tags.map((tag, i) => (
          <span key={i} className="text-[9px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
}
