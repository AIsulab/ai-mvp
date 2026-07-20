// Netlify Function - SGIS API Proxy (소상공인 상권정보)
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
  const { cx = "127.148", cy = "35.818", radius = "500" } = params;
  const serviceKey = process.env.POTAL_API;

  if (!serviceKey) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        header: { resultCode: "00", resultMsg: "NORMAL_SERVICE" },
        body: {
          items: [
            { bizesNm: "전주객사길 카페", indsSclsNm: "커피점", ldongNm: "전주시 완산구", telno: "063-123-4567", lat: 35.8207, lon: 127.1478 },
            { bizesNm: "한옥마을 식당", indsSclsNm: "한식", ldongNm: "전주시 완산구", telno: "063-234-5678", lat: 35.8153, lon: 127.1468 },
            { bizesNm: "남부시장 분식", indsSclsNm: "분식", ldongNm: "전주시 완산구", telno: "063-345-6789", lat: 35.8136, lon: 127.1457 },
            { bizesNm: "전주한옥마을 전통찻집", indsSclsNm: "전통찻집", ldongNm: "전주시 완산구", telno: "063-456-7890", lat: 35.8164, lon: 127.1461 },
            { bizesNm: "덕진공원 인근 빵집", indsSclsNm: "제과점", ldongNm: "전주시 덕진구", telno: "063-567-8901", lat: 35.8385, lon: 127.1293 },
          ],
          numOfRows: 5,
          pageNo: 1,
          totalCount: 5,
        },
        isMock: true,
      }),
    };
  }

  try {
    const encodedKey = encodeURIComponent(serviceKey);
    const url = `http://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?radius=${radius}&cx=${cx}&cy=${cy}&serviceKey=${encodedKey}&pageNo=1&numOfRows=20&type=json`;

    const res = await fetch(url);
    const data = await res.json();

    if (data?.header?.resultCode !== "00" && data?.header?.resultCode !== "03") {
      throw new Error(`SGIS API Error: ${data?.header?.resultMsg || 'Unknown error'}`);
    }

    return { statusCode: 200, headers, body: JSON.stringify(data) };
  } catch (err) {
    console.error("SGIS API error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
}
