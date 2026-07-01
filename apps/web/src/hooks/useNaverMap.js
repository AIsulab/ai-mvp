import { useState, useEffect, useRef, useCallback } from "react";

const NAVER_MAPS_URL = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=";
const NAVER_MAP_KEY = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || "";

function isNaverMapsReady() {
  const n = window.naver;
  return n && n.maps && typeof n.maps.Map === "function" && typeof n.maps.LatLng === "function" && typeof n.maps.Event === "object";
}

function waitForNaverMaps(maxWait = 8000) {
  return new Promise((resolve) => {
    if (isNaverMapsReady()) { resolve(window.naver.maps); return; }
    const start = Date.now();
    const interval = setInterval(() => {
      if (isNaverMapsReady()) {
        clearInterval(interval);
        resolve(window.naver.maps);
      } else if (Date.now() - start > maxWait) {
        clearInterval(interval);
        const n = window.naver;
        console.error("[NaverMap] Auth check detail:", {
          naverExists: !!n,
          mapsExists: !!n?.maps,
          hasMap: typeof n?.maps?.Map,
          hasLatLng: typeof n?.maps?.LatLng,
          hasEvent: typeof n?.maps?.Event,
          hasMarker: typeof n?.maps?.Marker,
        });
        resolve(null);
      }
    }, 50);
  });
}

export function useNaverMap(containerRef, options = {}) {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);

  const { center = { lat: 35.818, lng: 127.148 }, zoom = 15 } = options;

  useEffect(() => {
    if (!containerRef.current || map) return;

    console.log("[NaverMap] KEY:", NAVER_MAP_KEY ? `${NAVER_MAP_KEY.slice(0,4)}...` : "(empty)");

    const scriptId = "naver-map-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `${NAVER_MAPS_URL}${NAVER_MAP_KEY}&submodules=geocoder`;
      console.log("[NaverMap] SDK URL:", script.src);
      script.async = true;
      script.onload = async () => {
        console.log("[NaverMap] Script loaded, waiting for SDK init...");
        const naverMaps = await waitForNaverMaps();
        if (naverMaps) {
          console.log("[NaverMap] SDK ready");
          initMap(naverMaps);
        } else {
          const n = window.naver;
          const detail = {
            naverExists: !!n, mapsExists: !!n?.maps,
            hasMap: typeof n?.maps?.Map, hasLatLng: typeof n?.maps?.LatLng,
            hasEvent: typeof n?.maps?.Event, hasMarker: typeof n?.maps?.Marker,
          };
          console.error("[NaverMap] Auth FAILED. Detail:", detail);
          setError(`인증 실패 — Map:${detail.hasMap} Event:${detail.hasEvent} LatLng:${detail.hasLatLng}. 네이버 콘솔에서 sulab.store 도메인을 확인하세요.`);
        }
      };
      script.onerror = () => {
        console.error("[NaverMap] Script load failed");
        setError("SDK 스크립트 로드 실패");
      };
      document.head.appendChild(script);
    } else {
      waitForNaverMaps().then((naverMaps) => { if (naverMaps) initMap(naverMaps); });
    }

    function initMap(naverMaps) {
      try {
        console.log("[NaverMap] initMap start");
        const naverMap = new naverMaps.Map(containerRef.current, {
          center: new naverMaps.LatLng(center.lat, center.lng),
          zoom,
          scaleControl: true,
          logoControl: false,
          mapDataControl: false,
        });
        console.log("[NaverMap] Map created OK");
        setMap(naverMap);
        setIsLoaded(true);
      } catch (e) {
        console.error("[NaverMap] initMap error:", e);
        setError(`지도 초기화 실패: ${e.message}`);
      }
    }
  }, [containerRef, center, zoom]);

  const setCenter = useCallback((lat, lng) => {
    if (map) {
      map.setCenter(new window.naver.maps.LatLng(lat, lng));
    }
  }, [map]);

  const getCenter = useCallback(() => {
    if (map) {
      const c = map.getCenter();
      return { lat: c.lat(), lng: c.lng() };
    }
    return center;
  }, [map, center]);

  const addMarker = useCallback((lat, lng, options = {}) => {
    if (!map || !window.naver) return null;
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(lat, lng),
      map,
      icon: options.icon || undefined,
    });
    if (options.infoWindow) {
      const infoWindow = new window.naver.maps.InfoWindow({
        content: options.infoWindow,
      });
      window.naver.maps.Event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      });
    }
    markersRef.current.push(marker);
    return marker;
  }, [map]);

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
  }, []);

  return { map, isLoaded, error, setCenter, getCenter, addMarker, clearMarkers };
}
