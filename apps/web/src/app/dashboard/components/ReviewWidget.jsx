import { Button, Textarea } from "../../../components/ui";

export default function ReviewWidget({ reviewInput, setReviewInput, onGenerate, isReplying, result }) {
  return (
    <div className="bg-white rounded-[16px] border border-gray-100 shadow-card p-5 flex-1">
      <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-4 tracking-tight">
        <span className="text-accent-orange">⭐</span> 리뷰 답변 자동화
      </h3>
      <Textarea
        label="고객 리뷰를 붙여넣으세요"
        value={reviewInput}
        onChange={e => setReviewInput(e.target.value)}
        placeholder="예: 파전이 엄청 바삭하고 맛있었어요!"
        rows={3}
      />
      <div className="flex justify-end mb-4 mt-3">
        <button
          onClick={onGenerate}
          disabled={isReplying || !reviewInput}
          className="bg-navy text-white font-medium px-4 py-2 rounded-full text-xs hover:shadow-hero transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {isReplying ? "생성 중..." : "AI 답변 생성"}
        </button>
      </div>
      <div>
        <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">AI 답변</label>
        <div className="w-full min-h-[80px] bg-accent-orange-light/30 border border-accent-orange/20 rounded-[12px] p-3 text-sm text-gray-700 whitespace-pre-wrap">
          {result ? result : <span className="text-gray-400 text-xs">리뷰를 입력하고 AI 답변 생성 버튼을 누르세요.</span>}
        </div>
      </div>
    </div>
  );
}
