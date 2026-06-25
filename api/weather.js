// Vercel Serverless Function - Weather API Proxy
export default async function handler(request, response) {
  // CORS configuration if needed
  response.setHeader('Access-Control-Allow-Credentials', true);
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (request.method === 'OPTIONS') {
    response.status(200).end();
    return;
  }

  const { nx = "63", ny = "89" } = request.query;
  const serviceKey = process.env.WEATHER_API_KEY;

  if (!serviceKey) {
    // Return mock data if no API key is configured
    return response.status(200).json({
      condition: "맑음",
      emoji: "☀️",
      temperature: "24°C",
      humidity: "52%",
      windSpeed: "2.3m/s",
      marketingTheme: "상쾌함,활기,기분 좋은 하루",
      isMock: true,
      error: "기상청 API 키가 설정되지 않았습니다.",
    });
  }

  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);

  // 기상청 단기예보 업데이트 시간: 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10
  let h = kstNow.getUTCHours();
  let m = kstNow.getUTCMinutes();
  let totalMinutes = h * 60 + m;
  let baseHour = 2;

  if (totalMinutes < 2 * 60 + 15) {
    kstNow.setUTCDate(kstNow.getUTCDate() - 1);
    baseHour = 23;
  } else if (totalMinutes < 5 * 60 + 15) { baseHour = 2; }
  else if (totalMinutes < 8 * 60 + 15) { baseHour = 5; }
  else if (totalMinutes < 11 * 60 + 15) { baseHour = 8; }
  else if (totalMinutes < 14 * 60 + 15) { baseHour = 11; }
  else if (totalMinutes < 17 * 60 + 15) { baseHour = 14; }
  else if (totalMinutes < 20 * 60 + 15) { baseHour = 17; }
  else if (totalMinutes < 23 * 60 + 15) { baseHour = 20; }
  else { baseHour = 23; }

  const pad = (n) => String(n).padStart(2, "0");
  const base_date = `${kstNow.getUTCFullYear()}${pad(kstNow.getUTCMonth() + 1)}${pad(kstNow.getUTCDate())}`;
  const base_time = `${pad(baseHour)}00`;

  // API 키가 이미 인코딩되어 발급되는 경우가 많으므로 인코딩/디코딩 방어 로직 적용
  const encodedKey = serviceKey.includes('%') ? serviceKey : encodeURIComponent(serviceKey);
  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodedKey}&pageNo=1&numOfRows=200&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

  try {
    const res = await fetch(url);
    const textData = await res.text();
    
    // 기상청 API는 에러 시 XML을 반환하는 경우가 있음
    if (textData.trim().startsWith('<')) {
      throw new Error(`기상청 API XML 에러 반환: ${textData.substring(0, 100)}...`);
    }

    const data = JSON.parse(textData);
    
    if (data?.response?.header?.resultCode !== "00") {
      throw new Error(`기상청 API 에러 코드: ${data?.response?.header?.resultCode}, Msg: ${data?.response?.header?.resultMsg}`);
    }

    const items = data?.response?.body?.items?.item || [];
    if (items.length === 0) throw new Error("예보 데이터가 없습니다.");

    const firstFcstTime = items[0]?.fcstTime || "";
    const nearest = items.filter((i) => i.fcstTime === firstFcstTime);

    const getValue = (cat) => nearest.find((i) => i.category === cat)?.fcstValue;

    const sky = getValue("SKY");
    const pty = getValue("PTY");
    const tmp = getValue("TMP");
    const reh = getValue("REH");
    const wsd = getValue("WSD");
    const pop = getValue("POP"); // 강수확률 추가

    let condition = "맑음";
    let emoji = "☀️";
    let marketingTheme = "청량함,야외활동,여름 특선";

    const ptyNum = parseInt(pty || "0");
    const skyNum = parseInt(sky || "1");
    const tmpNum = parseFloat(tmp || "20");

    if (ptyNum === 1 || ptyNum === 4) {
      condition = "비";
      emoji = "🌧️";
      marketingTheme = "따뜻함,위로,실내,배달,든든함";
    } else if (ptyNum === 2) {
      condition = "비/눈";
      emoji = "🌨️";
      marketingTheme = "따뜻함,포근함,실내,특별한 날";
    } else if (ptyNum === 3) {
      condition = "눈";
      emoji = "❄️";
      marketingTheme = "낭만,겨울 감성,연말 특별";
    } else if (skyNum === 4) {
      condition = "흐림";
      emoji = "☁️";
      marketingTheme = "기분전환,특별 할인,에너지 충전";
    } else if (skyNum === 3) {
      condition = "구름많음";
      emoji = "⛅";
      marketingTheme = "일상,편안함,든든함";
    } else if (tmpNum >= 30) {
      condition = "폭염";
      emoji = "🔥";
      marketingTheme = "시원함,냉방,청량감,여름 특선";
    } else if (tmpNum <= 0) {
      condition = "한파";
      emoji = "🥶";
      marketingTheme = "온기,국물,따뜻한 실내,핫드링크";
    } else if (skyNum === 1) {
      condition = "맑음";
      emoji = "☀️";
      if (tmpNum >= 25) marketingTheme = "청량함,야외활동,여름 특선";
      else marketingTheme = "상쾌함,활기,나들이,기분 좋은 하루";
    }

    return response.status(200).json({
      condition,
      emoji,
      temperature: tmp ? `${tmp}°C` : "-",
      humidity: reh ? `${reh}%` : "-",
      windSpeed: wsd ? `${wsd}m/s` : "-",
      rainProb: pop ? `${pop}%` : "-",
      marketingTheme,
      base_date,
      base_time,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    return response.status(200).json({
      condition: "맑음",
      emoji: "☀️",
      temperature: "22°C",
      humidity: "55%",
      windSpeed: "2.1m/s",
      rainProb: "10%",
      marketingTheme: "상쾌함,활기,기분 좋은 하루",
      isMock: true,
      error: err.message,
    });
  }
}
