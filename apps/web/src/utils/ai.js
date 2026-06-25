const API_BASE = "";

export async function generateAIResponse(messages, options = {}) {
  const { model = "mimo-v2-flash", maxTokens = 1024, temperature = 0.8 } = options;

  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "chat",
      chatMessage: messages[messages.length - 1]?.content || "",
      chatHistory: messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API 오류: ${response.status}`);
  }

  const data = await response.json();
  return data.result;
}

export async function* streamAIResponse(messages, options = {}) {
  const fullText = await generateAIResponse(messages, options);
  const words = fullText.split("");
  let accumulated = "";

  for (const char of words) {
    accumulated += char;
    yield char;
    await new Promise(r => setTimeout(r, 10));
  }
}
