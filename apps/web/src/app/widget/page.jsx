"use client";
import { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useHandleStreamResponse from "@/utils/useHandleStreamResponse";

const businessTypes = [
  "카페",
  "식당/한식",
  "치킨/배달",
  "베이커리",
  "편의점",
  "미용실",
  "옷가게",
  "기타",
];
const tones = ["따뜻하게", "세련되게", "유머있게", "감성적으로"];

export default function Widget() {
  const [businessType, setBusinessType] = useState("");
  const [menuOrProduct, setMenuOrProduct] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [streaming, setStreaming] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1=입력, 2=결과

  const { data: weather, isLoading: weatherLoading } = useQuery({
    queryKey: ["weather-widget"],
    queryFn: async () => {
      const res = await fetch("/api/weather");
      if (!res.ok) throw new Error("날씨 로딩 실패");
      return res.json();
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });

  const handleFinish = useCallback((msg) => {
    setResult(msg);
    setStreaming("");
    setIsGenerating(false);
    setStep(2);
  }, []);

  const handleStreamResponse = useHandleStreamResponse({
    onChunk: setStreaming,
    onFinish: handleFinish,
  });

  const generate = async () => {
    if (!businessType || !menuOrProduct) {
      setError("업종과 메뉴를 입력해주세요.");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setStreaming("");
    setResult("");

    const systemPrompt = `당신은 소상공인 마케팅 전문가입니다. 날씨와 업종에 맞는 SNS 마케팅 문구 3가지를 작성합니다.
형식: 각 문구를 번호(1. 2. 3.)로 구분, 2~3문장, 이모지 포함. 바로 복사해서 쓸 수 있는 문구로.`;

    const userPrompt = `날씨: ${weather?.emoji || "☀️"} ${weather?.condition || "맑음"} (${weather?.temperature || ""})
마케팅 테마: ${weather?.marketingTheme || "상쾌함"}
업종: ${businessType}
메뉴/상품: ${menuOrProduct}
톤: ${tone}
→ 마케팅 문구 3가지 작성해줘`;

    try {
      const res = await fetch("/integrations/chat-gpt/conversationgpt4", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          stream: true,
        }),
      });
      if (!res.ok) throw new Error(`오류: ${res.status}`);
      handleStreamResponse(res);
    } catch (err) {
      console.error(err);
      setError("생성 실패. 다시 시도해주세요.");
      setIsGenerating(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setStep(1);
    setResult("");
    setStreaming("");
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        maxWidth: "420px",
        margin: "0 auto",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#1d4ed8",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "15px",
              letterSpacing: "-0.3px",
            }}
          >
            W-AI 날씨 마케팅
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "11px",
              marginTop: "2px",
            }}
          >
            사장님의 성공 이유
          </div>
        </div>
        {/* Weather badge */}
        {weatherLoading ? (
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
            날씨 로딩중...
          </div>
        ) : weather ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "22px" }}>{weather.emoji}</div>
            <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600 }}>
              {weather.condition} {weather.temperature}
            </div>
          </div>
        ) : null}
      </div>

      <div style={{ padding: "20px" }}>
        {step === 1 && (
          <>
            {/* Weather theme chips */}
            {weather && (
              <div
                style={{
                  marginBottom: "16px",
                  padding: "10px 12px",
                  background: "#eff6ff",
                  borderRadius: "10px",
                  border: "1px solid #dbeafe",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    color: "#3b82f6",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  오늘의 마케팅 테마
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {(weather.marketingTheme || "").split(",").map((t, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "11px",
                        background: "#dbeafe",
                        color: "#1e40af",
                        padding: "2px 8px",
                        borderRadius: "99px",
                        fontWeight: 500,
                      }}
                    >
                      {t.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Business type */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                업종 선택
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {businessTypes.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBusinessType(b)}
                    style={{
                      fontSize: "12px",
                      padding: "5px 12px",
                      borderRadius: "99px",
                      border:
                        businessType === b
                          ? "1.5px solid #2563eb"
                          : "1.5px solid #e5e7eb",
                      background: businessType === b ? "#eff6ff" : "#fff",
                      color: businessType === b ? "#2563eb" : "#374151",
                      fontWeight: businessType === b ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu/product */}
            <div style={{ marginBottom: "14px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                오늘의 메뉴 / 상품
              </div>
              <input
                type="text"
                value={menuOrProduct}
                onChange={(e) => setMenuOrProduct(e.target.value)}
                placeholder="예: 아메리카노, 육개장, 팥빙수..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "1.5px solid #e5e7eb",
                  fontSize: "13px",
                  color: "#111",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Tone */}
            <div style={{ marginBottom: "18px" }}>
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                문구 분위기
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    style={{
                      fontSize: "12px",
                      padding: "5px 12px",
                      borderRadius: "99px",
                      border:
                        tone === t
                          ? "1.5px solid #2563eb"
                          : "1.5px solid #e5e7eb",
                      background: tone === t ? "#eff6ff" : "#fff",
                      color: tone === t ? "#2563eb" : "#374151",
                      fontWeight: tone === t ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div
                style={{
                  color: "#ef4444",
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={generate}
              disabled={isGenerating || !businessType || !menuOrProduct}
              style={{
                width: "100%",
                padding: "13px",
                background:
                  isGenerating || !businessType || !menuOrProduct
                    ? "#93c5fd"
                    : "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: 600,
                cursor:
                  isGenerating || !businessType || !menuOrProduct
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background 0.15s",
                fontFamily: "inherit",
              }}
            >
              {isGenerating ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "14px",
                      height: "14px",
                      border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  ></span>
                  마케팅 문구 생성 중...
                </>
              ) : (
                "⚡ 날씨 마케팅 문구 생성하기"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#111" }}>
                생성된 마케팅 문구
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={copy}
                  style={{
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    border: "1px solid #e5e7eb",
                    background: copied ? "#f0fdf4" : "#fff",
                    color: copied ? "#16a34a" : "#374151",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 500,
                  }}
                >
                  {copied ? "✓ 복사됨" : "복사"}
                </button>
                <button
                  onClick={reset}
                  style={{
                    fontSize: "11px",
                    padding: "4px 10px",
                    borderRadius: "99px",
                    border: "1px solid #e5e7eb",
                    background: "#fff",
                    color: "#374151",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontWeight: 500,
                  }}
                >
                  다시 만들기
                </button>
              </div>
            </div>

            {(streaming || result) && (
              <div
                style={{
                  background: "#f9fafb",
                  borderRadius: "10px",
                  padding: "14px",
                  border: "1px solid #e5e7eb",
                }}
              >
                {streaming && (
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#3b82f6",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: "6px",
                        height: "6px",
                        background: "#3b82f6",
                        borderRadius: "50%",
                      }}
                    ></span>
                    생성 중...
                  </div>
                )}
                <pre
                  style={{
                    fontSize: "13px",
                    color: "#1f2937",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.7",
                    margin: 0,
                    fontFamily: "inherit",
                  }}
                >
                  {streaming || result}
                </pre>
              </div>
            )}

            <div
              style={{
                marginTop: "12px",
                padding: "8px 12px",
                background: "#eff6ff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "13px" }}>{weather?.emoji}</span>
              <span style={{ fontSize: "11px", color: "#3b82f6" }}>
                기상청 실시간 날씨 기반 자동 생성 · W-AI
              </span>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #f3f4f6",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: "10px", color: "#9ca3af" }}>
          기상청 API · 전북 소상공인 특화
        </span>
        <span style={{ fontSize: "10px", color: "#2563eb", fontWeight: 600 }}>
          W-AI
        </span>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
