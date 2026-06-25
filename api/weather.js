// Vercel Serverless Function - Weather API Proxy (Ultra-Short-Term Forecast)
export default async function handler(request, response) {
  // CORS configuration
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { nx = "63", ny = "89" } = request.query;
  const serviceKey = process.env.POTAL_API;

  if (!serviceKey) {
    return response.status(200).json({
      condition: "맑음", emoji: "☀️", temperature: "24°C", humidity: "52%", windSpeed: "2.3m/s", rainProb: "10%",
      marketingTheme: "상쾌함,활기,기분 좋은 하루", isMock: true, error: "기상청 API 키가 설정되지 않았습니다.",
    });
  }

  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);

  // 기상청 초단기예보 발표 시간은 매시간 45분 (base_time은 매시간 30분)
  let h = kstNow.getUTCHours();
  let m = kstNow.getUTCMinutes();

  if (m < 45) {
    // 45분 이전이면 이전 시간대의 예보를 사용
    kstNow.setUTCHours(kstNow.getUTCHours() - 1);
    h = kstNow.getUTCHours();
  }

  const pad = (n) => String(n).padStart(2, "0");
  const base_date = `${kstNow.getUTCFullYear()}${pad(kstNow.getUTCMonth() + 1)}${pad(kstNow.getUTCDate())}`;
  const base_time = `${pad(h)}30`; // 초단기예보는 항상 30분 기준

  const encodedKey = serviceKey.includes('%') ? serviceKey : encodeURIComponent(serviceKey);
  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=100&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

  try {
    const res = await fetch(url);
    const textData = await res.text();
    
    if (textData.trim().startsWith('<')) {
      throw new Error(`API XML Error: ${textData.substring(0, 100)}...`);
    }

    const data = JSON.parse(textData);
    if (data?.response?.header?.resultCode !== "00") {
      throw new Error(`API Error Code: ${data?.response?.header?.resultCode}`);
    }

    const items = data?.response?.body?.items?.item || [];
    if (items.length === 0) throw new Error("예보 데이터가 없습니다.");

    // 가장 가까운 시간대의 데이터 추출
    const firstFcstTime = items[0]?.fcstTime || "";
    const nearest = items.filter((i) => i.fcstTime === firstFcstTime);
    const getValue = (cat) => nearest.find((i) => i.category === cat)?.fcstValue;

    const sky = getValue("SKY");
    const pty = getValue("PTY");
    const tmp = getValue("T1H"); // 기온 (초단기예보는 T1H)
    const reh = getValue("REH"); // 습도
    const wsd = getValue("WSD"); // 풍속
    const pop = getValue("POP") || "0"; // 초단기예보에는 강수확률(POP)이 없거나 0일 수 있으므로 대체

    let condition = "맑음";
    let emoji = "☀️";
    let marketingTheme = "청량함,야외활동,여름 특선";

    const ptyNum = parseInt(pty || "0");
    const skyNum = parseInt(sky || "1");
    const tmpNum = parseFloat(tmp || "20");

    if (ptyNum === 1 || ptyNum === 4 || ptyNum === 5) {
      condition = "비"; emoji = "🌧️"; marketingTheme = "따뜻함,위로,실내,배달,든든함";
    } else if (ptyNum === 2 || ptyNum === 6) {
      condition = "비/눈"; emoji = "🌨️"; marketingTheme = "따뜻함,포근함,실내,특별한 날";
    } else if (ptyNum === 3 || ptyNum === 7) {
      condition = "눈"; emoji = "❄️"; marketingTheme = "낭만,겨울 감성,연말 특별";
    } else if (skyNum === 4) {
      condition = "흐림"; emoji = "☁️"; marketingTheme = "기분전환,특별 할인,에너지 충전";
    } else if (skyNum === 3) {
      condition = "구름많음"; emoji = "⛅"; marketingTheme = "일상,편안함,든든함";
    } else if (tmpNum >= 30) {
      condition = "폭염"; emoji = "🔥"; marketingTheme = "시원함,냉방,청량감,여름 특선";
    } else if (tmpNum <= 0) {
      condition = "한파"; emoji = "🥶"; marketingTheme = "온기,국물,따뜻한 실내,핫드링크";
    } else if (skyNum === 1) {
      condition = "맑음"; emoji = "☀️";
      if (tmpNum >= 25) marketingTheme = "청량함,야외활동,여름 특선";
      else marketingTheme = "상쾌함,활기,나들이,기분 좋은 하루";
    }

    return response.status(200).json({
      condition,
      emoji,
      temperature: tmp ? `${tmp}°C` : "-",
      humidity: reh ? `${reh}%` : "-",
      windSpeed: wsd ? `${wsd}m/s` : "-",
      rainProb: `${pop}%`, // 초단기예보는 강수형태 중심이므로 일단 표기
      marketingTheme,
      base_date,
      base_time,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    return response.status(200).json({
      condition: "맑음", emoji: "☀️", temperature: "22°C", humidity: "55%", windSpeed: "2.1m/s", rainProb: "10%",
      marketingTheme: "상쾌함,활기,기분 좋은 하루", isMock: true, error: err.message,
    });
  }
}
