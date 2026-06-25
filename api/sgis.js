// Vercel Serverless Function - SGIS API Proxy (소상공인 상권정보)
export default async function handler(request, response) {
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { cx = "127.148", cy = "35.818", radius = "500", category = "" } = request.query;
  const serviceKey = process.env.POTAL_API;

  if (!serviceKey) {
    // Return mock data when no API key
    return response.status(200).json({
      header: { resultCode: "00", resultMsg: "NORMAL_SERVICE" },
      body: {
        items: [
          { bizesNm: "전주객사길 카페", indsSclsNm: "커피점", ldongNm: "전주시 완산구", telno: "063-123-4567" },
          { bizesNm: "한옥마을 식당", indsSclsNm: "한식", ldongNm: "전주시 완산구", telno: "063-234-5678" },
          { bizesNm: "남부시장 분식", indsSclsNm: "분식", ldongNm: "전주시 완산구", telno: "063-345-6789" },
        ],
        numOfRows: 3,
        pageNo: 1,
        totalCount: 3,
      },
      isMock: true,
    });
  }

  try {
    const encodedKey = encodeURIComponent(serviceKey);
    const url = `http://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?radius=${radius}&cx=${cx}&cy=${cy}&serviceKey=${encodedKey}&pageNo=1&numOfRows=20&type=json`;
    
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
