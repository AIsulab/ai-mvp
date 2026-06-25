// Vercel Serverless Function - Jeonju WiFi API Proxy
export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const serviceKey = process.env.POTAL_API;

  if (!serviceKey) {
    // Return mock data with real coordinates when no API key
    return response.status(200).json({
      success: true,
      isMock: true,
      data: {
        items: [
          { instlPlace: "전주객사", addr: "전북특별자치도 전주시 완산구 객사4길 73", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8207, lon: 127.1478 },
          { instlPlace: "전주한옥마을 경기전", addr: "전북특별자치도 전주시 완산구 태조로 44", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8153, lon: 127.1468 },
          { instlPlace: "남부시장 청년몰", addr: "전북특별자치도 전주시 완산구 풍남문2길 53", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8136, lon: 127.1457 },
          { instlPlace: "전주 덕진공원", addr: "전북특별자치도 전주시 덕진구 권삼득로 390", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8385, lon: 127.1293 },
          { instlPlace: "전주역 광장", addr: "전북특별자치도 전주시 덕진구 건산로 251", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8401, lon: 127.1165 },
          { instlPlace: "전주한벽문화관", addr: "전북특별자치도 전주시 완산구 기린대로 95", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8164, lon: 127.1461 },
          { instlPlace: "전주동부시장", addr: "전북특별자치도 전주시 완산구 전동성당길 25", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8112, lon: 127.1507 },
          { instlPlace: "전주풍남시장", addr: "전북특별자치도 전주시 완산구 풍남문3길 38", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8142, lon: 127.1446 },
        ]
      }
    });
  }

  try {
    const encodedKey = encodeURIComponent(serviceKey);
    const url = `https://openapi.jeonju.go.kr/rest/wifizone/getWifiList?authApiKey=${encodedKey}`;
    
    let isMock = false;
    let data;
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (text && text.includes('<list>')) {
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
        throw new Error("Invalid response from Jeonju API");
      }
    } catch (fetchErr) {
      console.warn("WiFi fetch failed, using fallback:", fetchErr);
      isMock = true;
      data = {
        items: [
          { instlPlace: "전주객사", addr: "전북특별자치도 전주시 완산구 객사4길 73", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8207, lon: 127.1478 },
          { instlPlace: "전주한옥마을 경기전", addr: "전북특별자치도 전주시 완산구 태조로 44", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8153, lon: 127.1468 },
          { instlPlace: "남부시장 청년몰", addr: "전북특별자치도 전주시 완산구 풍남문2길 53", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8136, lon: 127.1457 },
          { instlPlace: "전주 덕진공원", addr: "전북특별자치도 전주시 덕진구 권삼득로 390", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8385, lon: 127.1293 },
          { instlPlace: "전주역 광장", addr: "전북특별자치도 전주시 덕진구 건산로 251", wifiSsid: "Jeonju_Free_WiFi", lat: 35.8401, lon: 127.1165 },
        ]
      };
    }

    return response.status(200).json({ success: true, isMock, data });
  } catch (err) {
    console.error("WiFi API error:", err);
    return response.status(500).json({ error: err.message });
  }
}
