// Netlify Function - Naver Search API Proxy
export default async function handler(event, context) {
  const headers = {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const params = event.queryStringParameters || {};
  const { query, type = 'blog', display = 5 } = params;

  if (!query) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "검색어가 필요합니다." }) };
  }

  const clientId = process.env.NAVER_CLIENT_ID || process.env.NAVER_ID || "2tBfhdei4zomxK9ZoSty";
  const clientSecret = process.env.NAVER_CLIENT_SECRET || process.env.NAVER_SECRET || "pLas4T0YUx";

  if (!clientId || !clientSecret) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        items: [{ title: `<b>${query}</b> 관련 블로그`, link: "#", description: `${query}에 대한 유용한 정보를 공유합니다.`, bloggerName: "전주 맛집 블로거", postDate: "20260625" }],
        total: 1, isMock: true,
      }),
    };
  }

  try {
    const allowedTypes = ['blog', 'news', 'cafe', 'webkr', 'image', 'local'];
    const searchType = allowedTypes.includes(type) ? type : 'blog';
    const url = `https://openapi.naver.com/v1/search/${searchType}.json?query=${encodeURIComponent(query)}&display=${display}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "X-Naver-Client-Id": clientId, "X-Naver-Client-Secret": clientSecret },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.errorMessage || "네이버 API 요청 실패");
    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    console.error("Naver API error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
}
