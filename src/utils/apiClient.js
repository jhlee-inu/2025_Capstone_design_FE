const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildUrl = (path) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};

const getAccessToken = () => localStorage.getItem("accessToken") || "";
const getTokenType = () => localStorage.getItem("tokenType") || "Bearer";

export const setAccessToken = (accessToken, tokenType, expiresIn) => {
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (tokenType) localStorage.setItem("tokenType", tokenType);
  if (expiresIn) localStorage.setItem("expiresIn", expiresIn);
};

const refreshAccessToken = async () => {
  const response = await fetch(buildUrl("/auth/refresh"), {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  const accessToken = data.accessToken || data.token || "";
  if (!accessToken) {
    return null;
  }

  setAccessToken(accessToken, data.tokenType, data.expiresIn);
  return accessToken;
};
//일반 fetch 대신 사용하는 함수 
//인증이 필요한 모든 api 호출에 사용
export const apiFetch = async (path, options = {}) => { // options: { method, headers, body, etc. }
  const url = buildUrl(path); 
  const headers = new Headers(options.headers || {});
  const accessToken = getAccessToken();

  if (accessToken && !headers.has("Authorization")) {
    headers.set("Authorization", `${getTokenType()} ${accessToken}`);
  }

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (options.body && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status !== 401) {
    return response;
  }

  const refreshed = await refreshAccessToken();
  if (!refreshed) {
    return response;
  }

  const retryHeaders = new Headers(headers);
  retryHeaders.set(
    "Authorization",
    `${getTokenType()} ${getAccessToken()}`
  );

  return fetch(url, {
    ...options,
    headers: retryHeaders,
  });
};
