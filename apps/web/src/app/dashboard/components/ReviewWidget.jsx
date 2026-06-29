export default function ReviewWidget({ reviewInput, setReviewInput, onGenerate, isReplying, result }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-[15px] font-semibold text-gray-900 mb-3">리뷰 답변 자동화</h3>
      <textarea
        value={reviewInput}
        onChange={e => setReviewInput(e.target.value)}
        placeholder="고객 리뷰를 붙여넣으세요"
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-[14px] text-gray-900 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-900 mb-3 placeholder-gray-400"
      />
      <button onClick={onGenerate} disabled={isReplying || !reviewInput}
        className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg text-[14px] hover:bg-gray-800 transition-all disabled:opacity-50 mb-3">
        {isReplying ? "생성 중..." : "AI 답변 생성"}
      </button>
      {result && (
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
          <p className="text-[13px] text-gray-600 mb-1.5 font-medium">AI 답변</p>
          <p className="text-[14px] text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
}
