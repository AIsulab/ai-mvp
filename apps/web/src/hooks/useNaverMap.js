import { useState, useEffect, useRef, useCallback } from "react";

const NAVER_MAP_KEY = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "";
const SDK_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${NAVER_MAP_KEY}&submodules=geocoder`;

export { loadNaverSDK, tryInitMap };

let sdkPromise = null;

function loadNaverSDK() {
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const doReject = (err) => {
      sdkPromise = null; // 항상 리셋하여 재시도 가능하게
      reject(err);
    };

    if (isSDKReady()) {
      console.log("[NaverMap] SDK already loaded");
      resolve(window.naver.maps);
      return;
    }

    const keyToUse = NAVER_MAP_KEY;

    if (!keyToUse) {
      doReject(new Error("VITE_NAVER_MAP_CLIENT_ID 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요."));
      return;
    }

    const callbackName = "__naverMapReady_" + Date.now();
    window[callbackName] = () => {
      console.log("[NaverMap] SDK initialized via callback ✓");
      delete window[callbackName];
      if (typeof window.naver?.maps?.Map === "function") {
        resolve(window.naver.maps);
      } else {
        doReject(new Error(
          "네이버 지도 API 인증 실패: 도메인이 NCP 콘솔에 등록되지 않았습니다.\n" +
          "NCP 콘솔 > AI·NAVER API > Maps > Application에서 현재 도메인을 Web 서비스 URL에 추가해주세요."
        ));
      }
    };

    const scriptId = "naver-map-sdk";
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      waitForSDKReady(5000).then(resolve).catch(doReject);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${keyToUse}&submodules=geocoder&callback=${callbackName}`;
    script.async = true;

    console.log("[NaverMap] Loading SDK with Key:", keyToUse);

    script.onerror = () => {
      delete window[callbackName];
      doReject(new Error("SDK 스크립트 로드 실패 — 네트워크 또는 URL 확인"));
    };

    script.onload = () => {
      setTimeout(() => {
        if (window[callbackName]) {
          console.warn("[NaverMap] callback not fired after 5s, polling fallback...");
          delete window[callbackName];
          waitForSDKReady(5000).then(resolve).catch(doReject);
        }
      }, 5000);
    };

    document.head.appendChild(script);
  });

  return sdkPromise;
}

function isSDKReady() {
  const n = window.naver;
  return (
    n &&
    n.maps &&
    typeof n.maps.Map === "function" &&
    typeof n.maps.LatLng === "function" &&
    typeof n.maps.Event === "object"
  );
}

function waitForSDKReady(timeout = 5000) {
  return new Promise((resolve, reject) => {
    if (isSDKReady()) { resolve(window.naver.maps); return; }
    const start = Date.now();
    const timer = setInterval(() => {
      if (isSDKReady()) {
        clearInterval(timer);
        console.log("[NaverMap] SDK ready via polling ✓");
        resolve(window.naver.maps);
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        const n = window.naver;
        console.error("[NaverMap] SDK timeout. Detail:", {
          naverExists: !!n,
          mapsExists: !!n?.maps,
          hasMap: typeof n?.maps?.Map,
        });
        reject(new Error(
          `SDK 로드 타임아웃 — Client ID 인증 및 도메인 설정을 확인하세요.`
        ));
      }
    }, 50);
  });
}

async function tryInitMap(container, naverMaps, mapOptions, maxRetries = 3, retryMs = 300) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (typeof naverMaps.Map !== "function") {
        throw new Error(`naver.maps.Map이 function이 아님 (attempt ${attempt})`);
      }
      if (typeof naverMaps.Event === "undefined") {
        throw new Error(`naver.maps.Event가 undefined (attempt ${attempt})`);
      }

      console.log(`[NaverMap] initMap attempt ${attempt}/${maxRetries}`);
      const map = new naverMaps.Map(container, mapOptions);
      console.log(`[NaverMap] Map created ✓`);
      return map;
    } catch (e) {
      console.warn(`[NaverMap] initMap attempt ${attempt} failed:`, e.message);
      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, retryMs));
      } else {
        throw e;
      }
    }
  }
}

export function useNaverMap(containerRef, options = {}) {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);

  const { center = { lat: 35.818, lng: 127.148 }, zoom = 15 } = options;

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;
    let localMapInstance = null;

    (async () => {
      try {
        const naverMaps = await loadNaverSDK();

        if (cancelled || !containerRef.current) return;

        localMapInstance = await tryInitMap(
          containerRef.current,
          naverMaps,
          {
            center: new naverMaps.LatLng(center.lat, center.lng),
            zoom,
            scaleControl: true,
            logoControl: false,
            mapDataControl: false,
          },
          3,
          300
        );

        if (cancelled) {
          try { localMapInstance?.destroy?.(); } catch {}
          return;
        }

        setMap(localMapInstance);
        setIsLoaded(true);
      } catch (e) {
        if (!cancelled) {
          console.error("[NaverMap] Fatal:", e.message);
          setError(e.message);
        }
      }
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach(m => { try { m.setMap(null); } catch {} });
      markersRef.current = [];
      if (localMapInstance) {
        try { localMapInstance.destroy?.(); } catch {}
      }
      setMap(null);
    };
  }, [containerRef, center.lat, center.lng, zoom]);

  const setCenter = useCallback((lat, lng) => {
    if (map && window.naver?.maps) map.setCenter(new window.naver.maps.LatLng(lat, lng));
  }, [map]);

  const getCenter = useCallback(() => {
    if (map) {
      const c = map.getCenter();
      return { lat: c.lat(), lng: c.lng() };
    }
    return center;
  }, [map, center]);

  const addMarker = useCallback((lat, lng, opts = {}) => {
    if (!map || !window.naver?.maps) return null;
    const nm = window.naver.maps;
    const marker = new nm.Marker({
      position: new nm.LatLng(lat, lng),
      map,
      icon: opts.icon || undefined,
    });
    if (opts.infoWindow) {
      const iw = new nm.InfoWindow({ content: opts.infoWindow });
      nm.Event.addListener(marker, "click", () => iw.open(map, marker));
    }
    markersRef.current.push(marker);
    return marker;
  }, [map]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(m => { try { m.setMap(null); } catch {} });
    markersRef.current = [];
  }, []);

  return { map, isLoaded, error, setCenter, getCenter, addMarker, clearMarkers };
}
