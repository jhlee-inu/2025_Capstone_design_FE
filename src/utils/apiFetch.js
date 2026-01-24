const clearAuthAndRedirect = () => {
  try {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");
  } catch (error) {
    console.error("auth cleanup failed:", error);
  }

  if (typeof window !== "undefined") {
    window.location.replace("/login");
  }
};

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  const isAuthError =
    response.status === 401 ||
    response.status === 403 ||
    response.redirected;

  if (isAuthError) {
    clearAuthAndRedirect();
    throw new Error("AUTH_EXPIRED");
  }

  return response;
};
