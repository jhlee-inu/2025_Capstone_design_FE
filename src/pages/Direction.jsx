import { useMemo, useState } from "react";
import { FiArrowLeft, FiClock, FiSearch, FiX } from "react-icons/fi";
import { HiOutlineSwitchVertical } from "react-icons/hi";
import AppLayout from "../layouts/AppLayout";

function Direction() {
  const recentRoutes = [
    { from: "최근 검색어", to: "최근 검색어" },
    { from: "최근 검색어", to: "최근 검색어" },
    { from: "최근 검색어", to: "최근 검색어" },
    { from: "최근 검색어", to: "최근 검색어" },
  ];
  const recentKeywords = [
    "최근 검색어",
    "최근 검색어",
    "최근 검색어",
    "최근 검색어",
  ];
  const routeResults = [
    { duration: "시간 00분", time: "00:00~00:00", fare: "예상 요금", transfer: "환승 2회" },
    { duration: "시간 00분", time: "00:00~00:00", fare: "예상 요금", transfer: "환승 2회" },
    { duration: "시간 00분", time: "00:00~00:00", fare: "예상 요금", transfer: "환승 2회" },
    { duration: "시간 00분", time: "00:00~00:00", fare: "예상 요금", transfer: "환승 2회" },
  ];

  const [mode, setMode] = useState("default");
  const [activeField, setActiveField] = useState("from");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [searchText, setSearchText] = useState("");

  const hasRoute = useMemo(
    () => Boolean(fromValue.trim() && toValue.trim()),
    [fromValue, toValue]
  );

  const beginSearch = (field) => {
    setActiveField(field);
    setSearchText(field === "from" ? fromValue : toValue);
    setMode("search");
  };

  const finishSearch = (nextFrom, nextTo) => {
    setFromValue(nextFrom);
    setToValue(nextTo);
    setSearchText("");
    setMode(nextFrom.trim() && nextTo.trim() ? "results" : "default");
  };

  const handleKeywordSelect = (keyword) => {
    const nextFrom = activeField === "from" ? keyword : fromValue;
    const nextTo = activeField === "to" ? keyword : toValue;
    finishSearch(nextFrom, nextTo);
  };

  const handleSearchSubmit = () => {
    if (!searchText.trim()) return;
    const nextFrom = activeField === "from" ? searchText : fromValue;
    const nextTo = activeField === "to" ? searchText : toValue;
    finishSearch(nextFrom, nextTo);
  };

  const handleBack = () => {
    setSearchText("");
    setMode(hasRoute ? "results" : "default");
  };

  const handleSwap = () => {
    const nextFrom = toValue;
    const nextTo = fromValue;
    setFromValue(nextFrom);
    setToValue(nextTo);
    if (nextFrom.trim() && nextTo.trim()) {
      setMode("results");
    }
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
            <h2 className="text-sm font-semibold text-black">최근</h2>
            <ul className="mt-3 -mx-4 divide-y bg-white">
              {recentRoutes.map((item, index) => (
                <li
                  key={`${item.from}-${item.to}-${index}`}
                  className="flex items-center justify-between px-4 py-3 text-sm text-black"
                >
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => finishSearch(item.from, item.to)}
                  >
                    <FiClock className="text-orange-400" />
                    <span>
                      {item.from} → {item.to}
                    </span>
                  </button>
                  <button type="button" className="text-gray-500" aria-label="remove">
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
              {recentKeywords.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center justify-between px-4 py-3 text-sm text-black"
                >
                  <button
                    type="button"
                    className="flex flex-1 items-center gap-2 text-left"
                    onClick={() => handleKeywordSelect(item)}
                  >
                    <FiClock className="text-orange-400" />
                    <span>{item}</span>
                  </button>
                  <button type="button" className="text-gray-400" aria-label="remove">
                    <FiX />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {mode === "results" && (
          <section className="mt-6 space-y-3">
            {routeResults.map((route, index) => (
              <div
                key={`route-${index}`}
                className="rounded-2xl bg-gray-100 px-4 py-4 shadow-sm"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
                  <span>{route.duration}</span>
                  <span className="text-orange-500">{route.transfer}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">{route.time}</div>
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
