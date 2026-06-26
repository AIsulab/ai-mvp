import { useState, useEffect, useRef, useCallback } from "react";

const NAVER_MAPS_URL = "https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=";

export function useNaverMap(containerRef, options = {}) {
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const markersRef = useRef([]);

  const { center = { lat: 35.818, lng: 127.148 }, zoom = 15 } = options;

  useEffect(() => {
    if (!containerRef.current || map) return;

    const scriptId = "naver-map-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `${NAVER_MAPS_URL}${process.env.NAVER_MAP_ID || ""}`;
      script.async = true;
      script.onload = () => {
        if (window.naver && window.naver.maps) {
          initMap();
        }
      };
      document.head.appendChild(script);
    } else if (window.naver && window.naver.maps) {
      initMap();
    }

    function initMap() {
      const naverMap = new window.naver.maps.Map(containerRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom,
        scaleControl: true,
        logoControl: false,
        mapDataControl: false,
      });
      setMap(naverMap);
      setIsLoaded(true);
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

  return { map, isLoaded, setCenter, getCenter, addMarker, clearMarkers };
}
