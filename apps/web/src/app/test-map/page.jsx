/**
 * /test-map — 네이버 지도 SDK 최소 테스트 페이지
 *
 * 목적: 인증 성공/실패를 다른 기능과 완전히 분리하여 단독 진단
 * - SDK 로드 (콜백 방식)
 * - naver.maps.Map 생성자 유효성 확인
 * - Map 인스턴스 생성만 수행 (마커/InfoWindow/이벤트 없음)
 */
import { useEffect, useRef, useState } from "react";

const NAVER_MAP_KEY = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "";
const TEST_CENTER = { lat: 35.8242238, lng: 127.1479532 }; // 전주시청

// 로그 항목 타입: { time, level, msg }
function formatTime() {
  return new Date().toISOString().split("T")[1].replace("Z", "");
}

export default function TestMapPage() {
  const containerRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [retryCount, setRetryCount] = useState(0);

  function addLog(level, msg) {
    setLogs(prev => [...prev, { time: formatTime(), level, msg }]);
    console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
      `[TestMap] ${msg}`
    );
  }

  async function runTest() {
    setLogs([]);
    setStatus("loading");
    addLog("info", `테스트 시작 — KEY: ${NAVER_MAP_KEY ? `${NAVER_MAP_KEY.slice(0,4)}...${NAVER_MAP_KEY.slice(-2)}` : "(없음)"}`);

    // ① KEY 유효성
    if (!NAVER_MAP_KEY) {
      addLog("error", "VITE_NAVER_MAP_CLIENT_ID 환경변수가 없습니다. .env 파일을 확인하세요.");
      setStatus("error");
      return;
    }

    // ② SDK 로드
    try {
      const naver = await loadSDK();
      addLog("info", "SDK 로드 성공 ✓");

      // ③ Map 생성자 유효성
      addLog("info", `naver.maps.Map 타입: ${typeof naver.Map}`);
      addLog("info", `naver.maps.LatLng 타입: ${typeof naver.LatLng}`);
      addLog("info", `naver.maps.Event 타입: ${typeof naver.Event}`);
      addLog("info", `naver.maps.Marker 타입: ${typeof naver.Marker}`);

      if (typeof naver.Map !== "function") {
        addLog("error", "naver.maps.Map이 function이 아닙니다 — 인증 실패 (도메인 미등록 가능성)");
        setStatus("error");
        return;
      }

      // ④ Map 인스턴스 생성 (재시도 최대 3회)
      let map = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          addLog("info", `Map 생성 시도 ${attempt}/3...`);
          map = new naver.Map(containerRef.current, {
            center: new naver.LatLng(TEST_CENTER.lat, TEST_CENTER.lng),
            zoom: 14,
            scaleControl: true,
            logoControl: false,
            mapDataControl: false,
          });
          addLog("info", `Map 생성 성공 ✓ (attempt ${attempt})`);
          break;
        } catch (e) {
          addLog("warn", `Map 생성 실패 (attempt ${attempt}): ${e.message}`);
          if (attempt < 3) await new Promise(r => setTimeout(r, 500));
          else throw e;
        }
      }

      addLog("info", "✅ 모든 테스트 통과 — 지도 인증 정상");
      setStatus("success");
    } catch (e) {
      addLog("error", `❌ 테스트 실패: ${e.message}`);
      setStatus("error");
    }
  }

  // 최소 SDK 로더 (콜백 방식)
  function loadSDK() {
    return new Promise((resolve, reject) => {
      const n = window.naver;
      if (n?.maps && typeof n.maps.Map === "function") {
        addLog("info", "SDK 이미 로드됨 (캐시)");
        resolve(n.maps);
        return;
      }

      const cbName = "__testMapReady_" + Date.now();
      window[cbName] = () => {
        delete window[cbName];
        addLog("info", "SDK 콜백 수신 ✓");
        if (typeof window.naver?.maps?.Map === "function") {
          resolve(window.naver.maps);
        } else {
          reject(new Error("콜백 수신 후에도 naver.maps.Map이 function 아님 (인증 실패)"));
        }
      };

      // 기존 스크립트 제거 후 재로드 (테스트 환경)
      const oldScript = document.getElementById("naver-map-sdk-test");
      if (oldScript) oldScript.remove();

      const script = document.createElement("script");
      script.id = "naver-map-sdk-test";
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_KEY}&submodules=geocoder&callback=${cbName}`;
      script.async = true;

      addLog("info", `SDK URL: ...${script.src.slice(-80)}`);

      script.onerror = () => {
        delete window[cbName];
        reject(new Error("스크립트 로드 실패 (네트워크 오류 또는 잘못된 URL)"));
      };

      // onload 타임아웃 폴백 (10초)
      script.onload = () => {
        addLog("info", "스크립트 onload 수신 — 콜백 대기 중...");
        setTimeout(() => {
          if (window[cbName]) {
            delete window[cbName];
            reject(new Error("SDK onload 후 10초 내 콜백 없음 (인증 실패 또는 도메인 미등록)"));
          }
        }, 10000);
      };

      document.head.appendChild(script);
    });
  }

  // 마운트 시 자동 실행
  useEffect(() => { runTest(); }, []);

  const statusColor = {
    idle: "#6b7280",
    loading: "#f59e0b",
    success: "#10b981",
    error: "#ef4444",
  }[status];

  const statusLabel = {
    idle: "대기",
    loading: "테스트 중...",
    success: "✅ 성공",
    error: "❌ 실패",
  }[status];

  return (
    <div style={{ fontFamily: "monospace, sans-serif", padding: 24, maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
          🗺 Naver Map SDK 최소 테스트
        </h1>
        <p style={{ fontSize: 12, color: "#6b7280" }}>
          /test-map — SDK 로드 + Map 생성만 테스트. 다른 기능 없음.
        </p>
      </div>

      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 14px", borderRadius: 10, background: "#f9fafb", border: `2px solid ${statusColor}` }}>
        <div style={{ width: 10, height: 10, borderRadius: "50%", background: statusColor, boxShadow: status === "loading" ? `0 0 8px ${statusColor}` : "none" }} />
        <span style={{ fontSize: 14, fontWeight: 700, color: statusColor }}>{statusLabel}</span>
        <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: "auto" }}>
          KEY: {NAVER_MAP_KEY ? `${NAVER_MAP_KEY.slice(0,4)}...${NAVER_MAP_KEY.slice(-2)}` : "(없음 — .env 확인)"}
        </span>
        <button
          onClick={() => { setRetryCount(c => c + 1); runTest(); }}
          style={{ padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 600, background: "#111827", color: "white", border: "none", cursor: "pointer" }}
        >
          재시도
        </button>
      </div>

      {/* Map container */}
      <div
        ref={containerRef}
        style={{
          width: "100%", height: 300, borderRadius: 12,
          border: `2px solid ${statusColor}`,
          background: "#f3f4f6", marginBottom: 16,
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {status !== "success" && (
          <span style={{ fontSize: 13, color: "#9ca3af" }}>
            {status === "loading" ? "지도 로딩 중..." : status === "error" ? "지도 로드 실패" : "대기 중"}
          </span>
        )}
      </div>

      {/* Log panel */}
      <div style={{ background: "#111827", borderRadius: 10, padding: 16, maxHeight: 280, overflowY: "auto" }}>
        <div style={{ fontSize: 10, color: "#6b7280", marginBottom: 8, fontWeight: 700 }}>CONSOLE LOG</div>
        {logs.length === 0 && <div style={{ fontSize: 11, color: "#4b5563" }}>로그 없음...</div>}
        {logs.map((log, i) => (
          <div key={i} style={{ fontSize: 11, lineHeight: 1.6, color: log.level === "error" ? "#f87171" : log.level === "warn" ? "#fbbf24" : "#6ee7b7" }}>
            <span style={{ color: "#4b5563", marginRight: 8 }}>[{log.time}]</span>
            {log.msg}
          </div>
        ))}
      </div>

      {/* Help */}
      {status === "error" && (
        <div style={{ marginTop: 16, padding: 14, borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>🔍 디버그 체크리스트</div>
          <ol style={{ fontSize: 12, color: "#7f1d1d", paddingLeft: 18, lineHeight: 2 }}>
            <li>네이버 클라우드 콘솔 → Maps → Application에 <code>sulab.store</code> 도메인 등록 확인</li>
            <li><code>VITE_NAVER_MAP_CLIENT_ID</code> 환경변수 값 정확한지 확인</li>
            <li>브라우저 콘솔에서 Network 탭 → maps.js 요청 상태 확인 (403인 경우 인증 실패)</li>
            <li>localhost에서 테스트 시 <code>localhost</code>도 도메인에 추가 필요</li>
          </ol>
        </div>
      )}
    </div>
  );
}
