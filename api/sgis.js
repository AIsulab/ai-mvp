// Vercel Serverless Function - SGIS API Proxy
export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  // MVP 기본 위치: 전주 객사길 인근 (경도: 127.148, 위도: 35.818)
  const { cx = "127.148", cy = "35.818", radius = "500" } = request.query;

  const serviceKey = process.env.SGIS_API_KEY;

  if (!serviceKey) {
    return response.status(500).json({ error: "SGIS API 키가 설정되지 않았습니다." });
  }

  try {
    const encodedKey = serviceKey.includes('%') ? serviceKey : encodeURIComponent(serviceKey);
    const url = `http://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?radius=${radius}&cx=${cx}&cy=${cy}&serviceKey=${encodedKey}&pageNo=1&numOfRows=15&type=json`;
    
    const res = await fetch(url);
    const data = await res.json();
    
    if (data?.header?.resultCode !== "00" && data?.header?.resultCode !== "03") {
      throw new Error(`SGIS API Error: ${data?.header?.resultMsg || 'Unknown error'}`);
    }

    return response.status(200).json(data);
  } catch (err) {
    console.error("SGIS API error:", err);
    return response.status(500).json({ error: err.message });
  }
}
