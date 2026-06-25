// Vercel Serverless Function - Naver Search API Proxy
export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { query, type = 'blog', display = 5 } = request.query;

  if (!query) {
    return response.status(400).json({ error: "검색어가 필요합니다." });
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return response.status(500).json({ error: "네이버 API 키가 설정되지 않았습니다." });
  }

  try {
    const url = `https://openapi.naver.com/v1/search/${type}.json?query=${encodeURIComponent(query)}&display=${display}`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.errorMessage || "네이버 API 요청 실패");
    }

    return response.status(200).json(data);
  } catch (err) {
    console.error("Naver API error:", err);
    return response.status(500).json({ error: err.message });
  }
}
