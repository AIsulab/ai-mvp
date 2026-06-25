export default async function handler(req, res) {
  // CORS configuration
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OpenAI API 키가 설정되지 않았습니다." });
  }

  const { action, storeInfo, weather, reviewText, snsTab, snsEvent, chatMessage, chatHistory } = req.body;
  let systemPrompt = "당신은 전북지역 소상공인을 돕는 훌륭한 AI 마케팅 비서 'W-AI'입니다. 언제나 친절하고 창의적이며, 고객의 이목을 끄는 문구를 작성합니다.";
  let userPrompt = "";
  let messages = [];

  if (action === "marketing") {
    systemPrompt += " 제공된 날씨 데이터와 가게 정보를 바탕으로 오늘 바로 쓸 수 있는 짧고 매력적인 홍보 문구를 작성해주세요. 너무 길지 않게 2~3문장으로 작성하고 이모지를 적절히 사용하세요.";
    userPrompt = `[가게 정보]\n업종: ${storeInfo?.type}\n가게 이름: ${storeInfo?.name}\n주요 메뉴: ${storeInfo?.menu}\n지역: ${storeInfo?.region}\n\n[오늘의 날씨]\n상태: ${weather?.condition} ${weather?.emoji}\n기온: ${weather?.temperature}\n마케팅 테마: ${weather?.marketingTheme}\n\n위 조건과 테마에 맞는 오늘의 매력적인 마케팅 문구를 추천해 줘.`;
  } else if (action === "review") {
    systemPrompt += " 고객의 리뷰에 대한 사장님의 답글을 작성해주세요. 리뷰의 감정(긍정/부정)을 파악하여 적절한 공감과 감사, 또는 사과의 내용을 포함하고 정중하지만 딱딱하지 않은 톤으로 작성하세요.";
    userPrompt = `고객 리뷰: "${reviewText}"\n\n이 리뷰에 대한 자연스러운 사장님 답글을 1~2문단으로 작성해 줘.`;
  } else if (action === "sns") {
    systemPrompt += " 지정된 SNS 플랫폼의 특징에 맞는 매력적인 홍보 게시물을 작성해주세요. 적절한 해시태그를 5개 이상 반드시 포함해야 합니다.";
    userPrompt = `[플랫폼]: ${snsTab}\n[오늘의 특별사항]: ${snsEvent}\n[가게 정보]: ${storeInfo?.region} ${storeInfo?.name} (${storeInfo?.type} - ${storeInfo?.menu})\n\n위 내용으로 ${snsTab}에 바로 올릴 수 있는 마케팅 콘텐츠를 작성해 줘.`;
  } else if (action === "chat") {
    systemPrompt = "당신은 소상공인을 위한 친절하고 유능한 AI 상권분석 챗봇입니다. 복잡한 데이터를 사장님들이 이해하기 쉽도록 친절하게 풀어서 설명해 주며, 질문에 전문적이면서도 따뜻한 어조로 답변합니다. 마크다운을 사용하여 가독성 있게 답변하세요.";
    // Construct messages array for chat history
    messages = [
      { role: "system", content: systemPrompt },
      ...(chatHistory || []),
      { role: "user", content: chatMessage }
    ];
  } else {
    return res.status(400).json({ error: "유효하지 않은 액션 타입입니다." });
  }

  // If not chat, setup standard messages
  if (action !== "chat") {
    messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 빠르고 경제적인 모델 사용
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || "OpenAI API 통신 오류");
    }

    const data = await response.json();
    const resultText = data.choices[0].message.content.trim();

    return res.status(200).json({ result: resultText });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
