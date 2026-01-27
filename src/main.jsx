import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const baseUrl = import.meta.env.VITE_API_BASE_URL;

if (
  typeof window !== "undefined" &&
  !window.__fetchWrapped &&
  typeof window.fetch === "function"
) {
  window.__fetchWrapped = true;
  const originalFetch = window.fetch.bind(window);
  let refreshPromise = null;

  const clearAuthAndRedirect = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenType");
    } catch (error) {
      console.error("auth cleanup failed:", error);
    }

    window.location.replace("/login");
  };

  const getRequestUrl = (input) => {
    if (typeof input === "string") return input;
    if (input instanceof Request) return input.url || "";
    return "";
  };

  const refreshAccessToken = async () => {
    if (!baseUrl) {
      throw new Error("NO_BASE_URL");
    }

    const response = await originalFetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
    });

    if (!response.ok) {
      throw new Error("REFRESH_FAILED");
    }

    const data = await response.json();
    const nextAccessToken = data?.accessToken;
    if (!nextAccessToken) {
      throw new Error("REFRESH_NO_TOKEN");
    }

    localStorage.setItem("accessToken", nextAccessToken);
    return nextAccessToken;
  };

  const getRefreshedToken = async () => {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    return refreshPromise;
  };

  window.fetch = async (input, init = {}) => {
    const requestUrl = getRequestUrl(input);
    const isRefreshRequest = requestUrl.includes("/auth/refresh");

    // [추가] 리프레시 요청은 인터셉트 로직을 타지 않게 미리 반환(무한 루프 방지)
    if (isRefreshRequest) {
      return originalFetch(input, init);
    }

    const response = await originalFetch(input, init);

    // [새로운 코드] - 401이 아니면 통과
    // ⚠️ 수정됨: resposne -> response (오타 수정)
    if (response.status !== 401) {
      return response;
    }

    // 401이면 원인 분석 시작
    const responseClone = response.clone();
    let errorData = {};

    try {
      errorData = await responseClone.json();
    } catch (e) {
      console.error("JSON 파싱 에러:", e);
      // JSON 파싱 실패 시 그냥 로그아웃
      clearAuthAndRedirect();
      return response;
    }

    // 백엔드 에러 코드 확인
    if (errorData?.code === "TOKEN_EXPIRED") {
      // CASE A: 토큰 만료일 때만 리프레시 로직 실행
      try {
        const nextAccessToken = await getRefreshedToken();

        const headers = new Headers(
          init?.headers || (input instanceof Request ? input.headers : {})
        );
        const tokenType = localStorage.getItem("tokenType") || "Bearer";
        headers.set("Authorization", `${tokenType} ${nextAccessToken}`);

        // 재요청
        const retryResponse = await originalFetch(input, {
          ...init,
          headers,
        });

        // [새로운 코드] 재요청도 401이면 로그아웃
        // ⚠️ 수정됨: 이 로직은 try 블록 안에 있어야 함
        if (retryResponse.status === 401) {
          clearAuthAndRedirect();
        }

        return retryResponse;
      } catch (error) {
        clearAuthAndRedirect();
        throw error;
      }
    } else {
      // [새로운 코드] CASE B: LOGIN_REQUIRED(토큰 없음) 등 -> 즉시 로그아웃
      // ⚠️ 수정됨: if 문법 구조 맞춤
      clearAuthAndRedirect();
      return response;
    }
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
