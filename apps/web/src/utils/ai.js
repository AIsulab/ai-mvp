const MIMO_API_URL = "https://api.xiaomimimo.com/v1/chat/completions";

export async function generateAIResponse(messages, options = {}) {
  const {
    model = "mimo-v2-flash",
    maxTokens = 1024,
    temperature = 0.8,
    stream = false,
  } = options;

  const apiKey = import.meta.env.VITE_MIMO_API_KEY;

  if (!apiKey) {
    throw new Error("MiMo API 키가 설정되지 않았습니다.");
  }

  const response = await fetch(MIMO_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
      stream,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API 오류: ${response.status}`);
  }

  if (stream) {
    return response;
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function* streamAIResponse(messages, options = {}) {
  const response = await generateAIResponse(messages, { ...options, stream: true });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content;
          if (content) yield content;
        } catch {}
      }
    }
  }
}
