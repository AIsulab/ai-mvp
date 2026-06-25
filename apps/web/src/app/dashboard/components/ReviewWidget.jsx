import { Button, Textarea } from "../../../components/ui";

export default function ReviewWidget({ reviewInput, setReviewInput, onGenerate, isReplying, result }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-1">
      <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
        <span className="text-yellow-500">⭐</span> 리뷰 답변 자동화
      </h3>
      <Textarea
        label="고객 리뷰를 붙여넣으세요"
        value={reviewInput}
        onChange={e => setReviewInput(e.target.value)}
        placeholder="예: 파전이 엄청 바삭하고 맛있었어요! 막걸리랑 잘 어울렸습니다. 다음에 또 올게요 😍"
        rows={3}
      />
      <div className="flex justify-end mb-4 mt-3">
        <Button
          variant="primary"
          size="sm"
          onClick={onGenerate}
          disabled={isReplying || !reviewInput}
          loading={isReplying}
        >
          AI 답변 생성
        </Button>
      </div>
      <div>
        <label className="text-[11px] text-gray-500 mb-1.5 block font-medium">AI 답변</label>
        <div className="w-full min-h-[80px] bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-sm text-gray-700 whitespace-pre-wrap">
          {result ? result : <span className="text-gray-400 text-xs">리뷰를 입력하고 AI 답변 생성 버튼을 누르세요.</span>}
        </div>
      </div>
    </div>
  );
}
