const API_BASE = "";

export async function generateAIResponse(messages, options = {}) {
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
  const response = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "chat",
      chatMessage: messages[messages.length - 1]?.content || "",
      chatHistory: messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
      stream: true,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `API 오류: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") return;

        try {
          const parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.content) yield parsed.content;
        } catch (e) {
          if (e.message && !e.message.includes("JSON")) throw e;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
