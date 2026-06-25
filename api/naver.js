// Vercel Serverless Function - Naver Search API Proxy
export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { query, type = 'blog', display = 5 } = request.query;

  if (!query) {
    return response.status(400).json({ error: "검색어가 필요합니다." });
  }

  const clientId = process.env.NAVER_ID;
  const clientSecret = process.env.NAVER_SECRET;

  if (!clientId || !clientSecret) {
    // Return mock data when no API key
    return response.status(200).json({
      items: [
        {
          title: `<b>${query}</b> 관련 블로그`,
          link: "#",
          description: `${query}에 대한 유용한 정보를 공유합니다.`,
          bloggerName: "전주 맛집 블로거",
          postDate: "20260625",
        }
      ],
      total: 1,
      isMock: true,
    });
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
