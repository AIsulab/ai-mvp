import { Button, Textarea } from "../../../components/ui";

export default function ReviewWidget({ reviewInput, setReviewInput, onGenerate, isReplying, result }) {
  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl p-5 md:p-6 flex-1"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
    >
      <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white flex items-center gap-2 mb-4">
        <span className="text-yellow-500">⭐</span> 리뷰 답변 자동화
      </h2>
      <Textarea
        label="고객 리뷰를 붙여넣으세요"
        value={reviewInput}
        onChange={e => setReviewInput(e.target.value)}
        placeholder="예: 파전이 엄청 바삭하고 맛있었어요! 막걸리랑 잘 어울렸습니다. 다음에 또 올게요 😍"
        rows={3}
      />
      <div className="flex justify-end mt-3 mb-4">
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
        <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block font-medium">AI 답변</label>
        <div className="w-full min-h-[80px] bg-[#F9FAFB] dark:bg-gray-700/50 rounded-xl p-3 text-sm text-[#111827] dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {result ? result : <span className="text-gray-400 dark:text-gray-500 text-xs">리뷰를 입력하고 AI 답변 생성 버튼을 누르세요.</span>}
        </div>
      </div>
    </div>
  );
}
