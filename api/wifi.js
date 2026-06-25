// Vercel Serverless Function - Jeonju WiFi API Proxy
export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const serviceKey = process.env.JEONJU_WIFI_API_KEY;

  if (!serviceKey) {
    return response.status(500).json({ error: "전주시청 와이파이 API 키가 설정되지 않았습니다." });
  }

  try {
    const encodedKey = serviceKey.includes('%') ? serviceKey : encodeURIComponent(serviceKey);
    // Jeonju API commonly uses authApiKey parameter.
    const url = `https://openapi.jeonju.go.kr/rest/wifizone/getWifiList?authApiKey=${encodedKey}`;
    
    let isMock = false;
    let data;
    try {
      const res = await fetch(url);
      const text = await res.text();
      // Simple parse or fallback
      if (text && text.includes('<list>')) {
         // rudimentary XML parsing for MVP
         const items = text.split('<list>').slice(1).map(item => {
           const getVal = (tag) => {
             const match = item.match(new RegExp(`<${tag}>(.*?)</${tag}>`));
             return match ? match[1] : '';
           };
           return {
             instlDiv: getVal('instlDiv'),
             instlPlace: getVal('instlPlace'),
             addr: getVal('addr'),
             wifiSsid: getVal('wifiSsid')
           };
         });
         data = { items };
      } else {
        throw new Error("Invalid or empty response from Jeonju API");
      }
    } catch (fetchErr) {
      console.warn("WiFi fetch failed, using fallback mock data:", fetchErr);
      isMock = true;
      data = {
        items: [
          { instlPlace: "전주객사", addr: "전북특별자치도 전주시 완산구 객사4길 73", wifiSsid: "Jeonju_Free_WiFi" },
          { instlPlace: "전주한옥마을 경기전", addr: "전북특별자치도 전주시 완산구 태조로 44", wifiSsid: "Jeonju_Free_WiFi" },
          { instlPlace: "남부시장 청년몰", addr: "전북특별자치도 전주시 완산구 풍남문2길 53", wifiSsid: "Jeonju_Free_WiFi" },
          { instlPlace: "전주 덕진공원", addr: "전북특별자치도 전주시 덕진구 권삼득로 390", wifiSsid: "Jeonju_Free_WiFi" }
        ]
      };
    }

    return response.status(200).json({
      success: true,
      isMock,
      data
    });
  } catch (err) {
    console.error("WiFi API error:", err);
    return response.status(500).json({ error: err.message });
  }
}
