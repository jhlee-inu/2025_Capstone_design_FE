import { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiClock, FiSearch, FiX } from "react-icons/fi";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import AppLayout from "../layouts/AppLayout";

function Direction() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [recentRoutes, setRecentRoutes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [routeResults, setRouteResults] = useState([]);
  const [routeError, setRouteError] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRouting, setIsRouting] = useState(false);

  const [mode, setMode] = useState("default");
  const [activeField, setActiveField] = useState("from");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [searchText, setSearchText] = useState("");
  const [fromPlace, setFromPlace] = useState(null);
  const [toPlace, setToPlace] = useState(null);

  const hasRoute = useMemo(
    () => Boolean(fromPlace && toPlace),
    [fromPlace, toPlace]
  );

  const formatWalkLabel = (distance) => {
    const meters = Math.round(distance || 0);
    return meters > 0 ? `도보 ${meters}m` : "도보";
  };

  const formatBusLabel = (segment) => {
    const lanes = Array.isArray(segment?.lane) ? segment.lane : [];
    const busNumbers = lanes
      .map((lane) => lane?.busNoKor || lane?.busNo)
      .filter(Boolean);
    const base = busNumbers.length > 0 ? `버스 ${busNumbers.join(", ")}` : "버스";
    const startName = segment?.startName || "";
    const endName = segment?.endName || "";
    const stopCount = segment?.stationCount ? `${segment.stationCount}정거장` : "";
    const suffix = [startName, endName]
      .filter(Boolean)
      .join(" → ");
    const meta = [stopCount, suffix].filter(Boolean).join(" · ");
    return meta ? `${base} (${meta})` : base;
  };

  const formatSubwayLabel = (segment) => {
    const lanes = Array.isArray(segment?.lane) ? segment.lane : [];
    const lineNames = lanes
      .map((lane) => lane?.nameKor || lane?.name)
      .filter(Boolean);
    const base = lineNames.length > 0 ? lineNames.join(", ") : "지하철";
    const way = segment?.way || "";
    const startName = segment?.startName || "";
    const endName = segment?.endName || "";
    const stopCount = segment?.stationCount ? `${segment.stationCount}정거장` : "";
    const suffix = [startName, endName]
      .filter(Boolean)
      .join(" → ");
    const meta = [way, stopCount, suffix].filter(Boolean).join(" · ");
    return meta ? `${base} (${meta})` : base;
  };

  const formatRouteSummary = (subPath = []) => {
    if (!Array.isArray(subPath) || subPath.length === 0) return "";

    const parts = [];
    let walkDistance = 0;

    const flushWalk = () => {
      if (walkDistance > 0) {
        parts.push(formatWalkLabel(walkDistance));
        walkDistance = 0;
      }
    };

    subPath.forEach((segment) => {
      if (!segment) return;

      switch (segment.trafficType) {
        case 3:
          if ((segment.distance || 0) > 0) {
            walkDistance += segment.distance;
          }
          break;
        case 2:
          flushWalk();
          parts.push(formatBusLabel(segment));
          break;
        case 1:
          flushWalk();
          parts.push(formatSubwayLabel(segment));
          break;
        default:
          flushWalk();
          break;
      }
    });

    flushWalk();

    return parts.join(" → ");
  };

  useEffect(() => {
    let active = true;

    const fetchRecentKeywords = async () => {
      if (!baseUrl) return;

      try {
        const accessToken = localStorage.getItem("accessToken") || "";
        const tokenType = localStorage.getItem("tokenType") || "Bearer";
        const response = await fetch(`${baseUrl}/api/route/history/places`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(accessToken
              ? { Authorization: `${tokenType} ${accessToken}` }
              : {}),
          },
        });

        if (!response.ok) {
          console.error("recent keywords failed:", response.status);
          return;
        }

        const data = await response.json();
        if (!active) return;
        setRecentKeywords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("recent keywords error:", error);
      }
    };

    const fetchRecentRoutes = async () => {
      if (!baseUrl) return;

      try {
        const accessToken = localStorage.getItem("accessToken") || "";
        const tokenType = localStorage.getItem("tokenType") || "Bearer";
        const response = await fetch(`${baseUrl}/api/route/history/paths`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(accessToken
              ? { Authorization: `${tokenType} ${accessToken}` }
              : {}),
          },
        });

        if (!response.ok) {
          console.error("recent routes failed:", response.status);
          return;
        }

        const data = await response.json();
        if (!active) return;
        setRecentRoutes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("recent routes error:", error);
      }
    };

    fetchRecentKeywords();
    fetchRecentRoutes();

    return () => {
      active = false;
    };
  }, [baseUrl]);

  const requestRoutes = async (nextFrom, nextTo) => {
    if (!baseUrl || !nextFrom || !nextTo) return;

    const payload = {
      sx: `${nextFrom.longitude}`,
      sy: `${nextFrom.latitude}`,
      ex: `${nextTo.longitude}`,
      ey: `${nextTo.latitude}`,
      departureName:
        nextFrom.placeName || nextFrom.roadAddressName || nextFrom.addressName || "",
      arrivalName:
        nextTo.placeName || nextTo.roadAddressName || nextTo.addressName || "",
    };

    try {
      setIsRouting(true);
      setRouteError("");
      const accessToken = localStorage.getItem("accessToken") || "";
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const response = await fetch(`${baseUrl}/api/route/paths`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...(accessToken
            ? { Authorization: `${tokenType} ${accessToken}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("route search failed:", response.status, text);
        setRouteError("경로를 찾을 수 없습니다.");
        return;
      }

      const data = await response.json();
      const paths = data?.result?.path || [];
      if (!Array.isArray(paths) || paths.length === 0) {
        setRouteResults([]);
        setRouteError(data?.error?.msg || "경로를 찾을 수 없습니다.");
        return;
      }

      const nextResults = paths.slice(0, 6).map((path) => {
        const info = path?.info || {};
        const totalTime = info.totalTime || 0;
        const hours = Math.floor(totalTime / 60);
        const minutes = totalTime % 60;
        const duration = hours > 0 ? `${hours}시간 ${minutes}분` : `${minutes}분`;
        const transferCount =
          (info.busTransitCount || 0) + (info.subwayTransitCount || 0);
        const fareLabel = info.payment
          ? `요금 ${info.payment.toLocaleString()}원`
          : "요금 정보 없음";
        const transferLabel = transferCount > 0 ? `환승 ${transferCount}회` : "직통";
        const summary = formatRouteSummary(path?.subPath) || "경로 정보 없음";

        return {
          duration,
          summary,
          fare: fareLabel,
          transfer: transferLabel,
        };
      });

      setRouteResults(nextResults);
    } catch (error) {
      console.error("route search error:", error);
      setRouteError("경로를 찾을 수 없습니다.");
    } finally {
      setIsRouting(false);
    }
  };

  const searchPlaces = async (keyword, shouldSave = false) => {
    const trimmed = keyword.trim();
    if (!trimmed || !baseUrl) return;

    const params = new URLSearchParams({
      keyword: trimmed,
      save: shouldSave ? "true" : "false",
    });

    try {
      setIsSearching(true);
      const accessToken = localStorage.getItem("accessToken") || "";
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const response = await fetch(`${baseUrl}/api/route/places?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...(accessToken
            ? { Authorization: `${tokenType} ${accessToken}` }
            : {}),
        },
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("place search failed:", response.status, text);
        setSearchResults([]);
        return;
      }

      const data = await response.json();
      setSearchResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("place search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const persistSearchKeyword = async (keyword) => {
    const trimmed = keyword.trim();
    if (!trimmed || !baseUrl) return;

    const params = new URLSearchParams({
      keyword: trimmed,
      save: "true",
    });

    try {
      const accessToken = localStorage.getItem("accessToken") || "";
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      await fetch(`${baseUrl}/api/route/places?${params}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
          ...(accessToken
            ? { Authorization: `${tokenType} ${accessToken}` }
            : {}),
        },
      });
    } catch (error) {
      console.error("place search save error:", error);
    }
  };

  useEffect(() => {
    if (mode !== "search") return;

    const trimmed = searchText.trim();
    if (!trimmed) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      searchPlaces(trimmed, false);
    }, 300);

    return () => clearTimeout(timer);
  }, [mode, searchText, baseUrl]);

  const beginSearch = (field) => {
    setActiveField(field);
    setSearchText(field === "from" ? fromValue : toValue);
    setSearchResults([]);
    setMode("search");
  };

  const finishSearch = (nextFrom, nextTo, nextFromPlace, nextToPlace) => {
    setFromValue(nextFrom);
    setToValue(nextTo);
    setFromPlace(nextFromPlace);
    setToPlace(nextToPlace);
    setSearchText("");
    setMode(nextFrom.trim() && nextTo.trim() ? "results" : "default");
    if (nextFromPlace && nextToPlace) {
      requestRoutes(nextFromPlace, nextToPlace);
    }
  };

  const handleKeywordSelect = (keyword) => {
    setSearchText(keyword);
  };

  const handleSearchSubmit = () => {
    if (!searchText.trim()) return;
    searchPlaces(searchText, true);
  };

  const handleBack = () => {
    setSearchText("");
    setSearchResults([]);
    setMode(hasRoute ? "results" : "default");
  };

  const handleSwap = () => {
    const nextFrom = toValue;
    const nextTo = fromValue;
    const nextFromPlace = toPlace;
    const nextToPlace = fromPlace;
    setFromValue(nextFrom);
    setToValue(nextTo);
    setFromPlace(nextFromPlace);
    setToPlace(nextToPlace);
    if (nextFrom.trim() && nextTo.trim()) {
      setMode("results");
      if (nextFromPlace && nextToPlace) {
        requestRoutes(nextFromPlace, nextToPlace);
      }
    }
  };

  const handlePlaceSelect = (place) => {
    if (searchText.trim()) {
      persistSearchKeyword(searchText);
    }

    const label =
      place.placeName || place.roadAddressName || place.addressName || "";
    const nextFrom = activeField === "from" ? label : fromValue;
    const nextTo = activeField === "to" ? label : toValue;
    const nextFromPlace = activeField === "from" ? place : fromPlace;
    const nextToPlace = activeField === "to" ? place : toPlace;

    finishSearch(nextFrom, nextTo, nextFromPlace, nextToPlace);
  };

  const handleRecentKeywordClick = (keyword) => {
    const nextField = fromValue.trim() ? "to" : "from";
    setActiveField(nextField);
    setSearchText(keyword);
    setMode("search");
  };

  const handleRemoveRecentRoute = async (index, routeId) => {
    if (!baseUrl || !routeId) {
      setRecentRoutes((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken") || "";
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const response = await fetch(
        `${baseUrl}/api/route/history/paths/${routeId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(accessToken
              ? { Authorization: `${tokenType} ${accessToken}` }
              : {}),
          },
        }
      );

      if (!response.ok) {
        console.error("recent route delete failed:", response.status);
        return;
      }

      setRecentRoutes((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("recent route delete error:", error);
    }
  };

  const handleRemoveRecentKeyword = async (index, keywordId) => {
    if (!baseUrl || !keywordId) {
      setRecentKeywords((prev) => prev.filter((_, i) => i !== index));
      return;
    }

    try {
      const accessToken = localStorage.getItem("accessToken") || "";
      const tokenType = localStorage.getItem("tokenType") || "Bearer";
      const response = await fetch(
        `${baseUrl}/api/route/history/places/${keywordId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            ...(accessToken
              ? { Authorization: `${tokenType} ${accessToken}` }
              : {}),
          },
        }
      );

      if (!response.ok) {
        console.error("recent keyword delete failed:", response.status);
        return;
      }

      setRecentKeywords((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      console.error("recent keyword delete error:", error);
    }
  };

  const handleRecentRouteClick = (route) => {
    const nextFrom = route.departureName || "";
    const nextTo = route.arrivalName || "";
    const nextFromPlace = {
      placeName: route.departureName,
      longitude: route.departureLongitude,
      latitude: route.departureLatitude,
    };
    const nextToPlace = {
      placeName: route.arrivalName,
      longitude: route.arrivalLongitude,
      latitude: route.arrivalLatitude,
    };

    finishSearch(nextFrom, nextTo, nextFromPlace, nextToPlace);
  };

  return (
    <AppLayout
      header={
        <header className="h-14 flex items-center justify-center border-b bg-white z-10">
          <h1 className="text-lg font-bold">길찾기</h1>
        </header>
      }
    >
      <div className="min-h-full bg-white px-4 py-5">
        {mode !== "search" && (
          <section className="relative rounded-2xl border border-orange-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full text-orange-500"
              aria-label="swap direction"
              onClick={handleSwap}
            >
              <HiOutlineSwitchVertical size={25} style={{ transform: "scaleY(1.2)" }} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-orange-400">
                <FiSearch />
              </span>
              <input
                className="w-full text-sm placeholder:text-gray-400 outline-none"
                placeholder="출발지 입력"
                readOnly
                value={fromValue}
                onClick={() => beginSearch("from")}
              />
            </div>
            <div className="my-2 h-px w-[85%] bg-gray-200" />
            <div className="flex items-center gap-2">
              <span className="text-orange-400">
                <FiSearch />
              </span>
              <input
                className="w-full text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                placeholder="도착지 입력"
                readOnly
                value={toValue}
                onClick={() => beginSearch("to")}
              />
            </div>
          </section>
        )}

        {mode === "default" && (
          <section className="mt-5">
            <h2 className="text-sm font-semibold text-black">최근 길찾기</h2>
            <ul className="mt-3 -mx-4 divide-y bg-white">
              {recentRoutes.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-400">
                  최근 길찾기 기록이 없습니다.
                </li>
              )}
              {recentRoutes.map((route, index) => (
                <li
                  key={route.recentSearchedRouteId || `${route.departureName}-${route.arrivalName}-${index}`}
                  className="flex items-center justify-between px-4 py-3 text-sm text-black"
                >
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => handleRecentRouteClick(route)}
                  >
                    <FiClock className="text-orange-400" />
                    <span>
                      {route.departureName} → {route.arrivalName}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="text-gray-400"
                    aria-label="remove recent route"
                    onClick={() =>
                      handleRemoveRecentRoute(
                        index,
                        route.recentSearchedRouteId
                      )
                    }
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-sm font-semibold text-black">최근 검색</div>
            <ul className="mt-3 -mx-4 divide-y bg-white">
              {recentKeywords.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-400">
                  최근 검색이 없습니다.
                </li>
              )}
              {recentKeywords.map((item, index) => (
                <li
                  key={item.recentSearchedId || `${item.keyword}-${index}`}
                  className="flex items-center justify-between px-4 py-3 text-sm text-black"
                >
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => handleRecentKeywordClick(item.keyword)}
                  >
                    <FiClock className="text-orange-400" />
                    <span>{item.keyword}</span>
                  </button>
                  <button
                    type="button"
                    className="text-gray-400"
                    aria-label="remove recent keyword"
                    onClick={() =>
                      handleRemoveRecentKeyword(index, item.recentSearchedId)
                    }
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {mode === "search" && (
          <section>
            <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-3 py-2">
              <button type="button" onClick={handleBack} aria-label="back">
                <FiArrowLeft />
              </button>
              <input
                className="w-full text-sm text-gray-800 placeholder:text-gray-400 outline-none"
                placeholder={activeField === "from" ? "출발지 입력" : "도착지 입력"}
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearchSubmit();
                  }
                }}
              />
            </div>
            <div className="mt-4 text-sm font-semibold text-black">최근 검색</div>
            <ul className="mt-2 -mx-4 divide-y bg-white">
              {recentKeywords.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-400">
                  최근 검색이 없습니다.
                </li>
              )}
              {recentKeywords.map((item, index) => (
                <li
                  key={item.recentSearchedId || `${item.keyword}-${index}`}
                  className="flex items-center justify-between px-4 py-3 text-sm text-black"
                >
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => handleKeywordSelect(item.keyword)}
                  >
                    <FiClock className="text-orange-400" />
                    <span>{item.keyword}</span>
                  </button>
                  <button
                    type="button"
                    className="text-gray-400"
                    aria-label="remove recent keyword"
                    onClick={() =>
                      handleRemoveRecentKeyword(index, item.recentSearchedId)
                    }
                  >
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-5 text-sm font-semibold text-black">검색 결과</div>
            <ul className="mt-2 -mx-4 divide-y bg-white">
              {isSearching && (
                <li className="px-4 py-3 text-sm text-gray-400">검색 중...</li>
              )}
              {!isSearching && searchResults.length === 0 && (
                <li className="px-4 py-3 text-sm text-gray-400">
                  검색 결과가 없습니다.
                </li>
              )}
              {searchResults.map((place) => (
                <li
                  key={place.kakaoPlaceId || `${place.placeName}-${place.addressName}`}
                  className="px-4 py-3 text-sm text-black"
                >
                  <button
                    type="button"
                    className="flex flex-col gap-1 text-left"
                    onClick={() => handlePlaceSelect(place)}
                  >
                    <span className="font-semibold">{place.placeName}</span>
                    <span className="text-xs text-gray-500">
                      {place.roadAddressName || place.addressName}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {mode === "results" && (
          <section className="mt-6 space-y-3">
            {isRouting && (
              <div className="rounded-2xl bg-gray-100 px-4 py-4 text-sm text-gray-500">
                경로를 찾는 중입니다...
              </div>
            )}
            {!isRouting && routeError && (
              <div className="rounded-2xl bg-gray-100 px-4 py-4 text-sm text-gray-500">
                {routeError}
              </div>
            )}
            {!isRouting && !routeError && routeResults.map((route, index) => (
              <div
                key={`route-${index}`}
                className="rounded-2xl bg-gray-100 px-4 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                  <span>{route.duration}</span>
                  <span className="text-orange-500">{route.transfer}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">{route.summary}</div>
                <div className="mt-3 text-xs text-gray-600">{route.fare}</div>
              </div>
            ))}
          </section>
        )}
      </div>
    </AppLayout>
  );
}
export default Direction;
