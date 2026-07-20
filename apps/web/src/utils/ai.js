const API_BASE = "";
const TIMEOUT_MS = 30_000; // 30초 타임아웃

// ─── 에러 분류 ─────────────────────────────────────────────────────────────────
export function classifyAIError(err) {
  // 오프라인
  if (!navigator.onLine || err?.name === "TypeError" && /fetch|network/i.test(err.message)) {
    return "인터넷 연결이 없습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
  }
  // 타임아웃 (AbortError)
  if (err?.name === "AbortError" || /timeout/i.test(err?.message)) {
    return "요청 시간이 초과됐습니다. 잠시 후 다시 시도해주세요.";
  }
  // API 키 오류
  if (/api key|invalid key|unauthorized/i.test(err?.message)) {
    return "AI 서비스 연결에 문제가 있습니다. 관리자에게 문의해주세요.";
  }
  // 서버 오류 (5xx)
  if (/50[0-9]/i.test(err?.message)) {
    return "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
  // 일반 오류
  return "일시적인 오류가 발생했습니다. 다시 시도해주세요.";
}

export async function generateAIResponse(messages, options = {}) {
  const { model = "mimo-v2-flash", maxTokens = 1024, temperature = 0.8 } = options;

  // 타임아웃 AbortController
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        action: "chat",
        chatMessage: messages[messages.length - 1]?.content || "",
        chatHistory: messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      }),
    });

    clearTimeout(timer);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || `API 오류: ${response.status}`);
    }

    const data = await response.json();
    return data.result;
  } catch (err) {
    clearTimeout(timer);
    throw err; // 분류는 호출부에서 classifyAIError()로 처리
  }
}

export async function* streamAIResponse(messages, options = {}) {
  const fullText = await generateAIResponse(messages, options);
  for (const char of fullText.split("")) {
    yield char;
    await new Promise(r => setTimeout(r, 10));
  }
}

