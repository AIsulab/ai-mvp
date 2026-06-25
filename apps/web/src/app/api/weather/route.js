export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const nx = searchParams.get("nx") || "63"; // Jeonju default
  const ny = searchParams.get("ny") || "89";

  const serviceKey = process.env.WEATHER_API_KEY;
  if (!serviceKey) {
    return Response.json(
      { error: "기상청 API 키가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  // Get current date and nearest base_time
  const now = new Date();
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(now.getTime() + kstOffset);

  const pad = (n) => String(n).padStart(2, "0");
  const base_date = `${kstNow.getUTCFullYear()}${pad(kstNow.getUTCMonth() + 1)}${pad(kstNow.getUTCDate())}`;

  const hour = kstNow.getUTCHours();
  const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];
  let baseHour = baseTimes[0];
  for (const t of baseTimes) {
    if (hour >= t) baseHour = t;
  }
  const base_time = `${pad(baseHour)}00`;

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=${encodeURIComponent(serviceKey)}&pageNo=1&numOfRows=200&dataType=JSON&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`기상청 API 오류: ${res.status}`);
    const data = await res.json();

    const items = data?.response?.body?.items?.item || [];

    // Extract the nearest forecast (first fcst time)
    const firstFcstTime = items[0]?.fcstTime || "";
    const nearest = items.filter((i) => i.fcstTime === firstFcstTime);

    const getValue = (cat) =>
      nearest.find((i) => i.category === cat)?.fcstValue;

    const sky = getValue("SKY"); // 1=맑음, 3=구름많음, 4=흐림
    const pty = getValue("PTY"); // 0=없음, 1=비, 2=비/눈, 3=눈, 4=소나기
    const tmp = getValue("TMP"); // temperature
    const reh = getValue("REH"); // humidity
    const wsd = getValue("WSD"); // wind speed

    // Determine weather condition
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

    return Response.json({
      condition,
      emoji,
      temperature: tmp ? `${tmp}°C` : "-",
      humidity: reh ? `${reh}%` : "-",
      windSpeed: wsd ? `${wsd}m/s` : "-",
      marketingTheme,
      base_date,
      base_time,
    });
  } catch (err) {
    console.error("Weather API error:", err);
    // Return mock data as fallback
    return Response.json({
      condition: "맑음",
      emoji: "☀️",
      temperature: "22°C",
      humidity: "55%",
      windSpeed: "2.1m/s",
      marketingTheme: "상쾌함,활기,기분 좋은 하루",
      isMock: true,
      error: err.message,
    });
  }
}
