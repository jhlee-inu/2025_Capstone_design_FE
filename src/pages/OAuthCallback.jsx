import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const accessToken = params.get("accessToken") || "";
    const refreshToken = params.get("refreshToken") || "";
    const tokenType = params.get("tokenType") || "";
    const expiresIn = params.get("expiresIn") || "";

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (tokenType) localStorage.setItem("tokenType", tokenType);
      if (expiresIn) localStorage.setItem("expiresIn", expiresIn);
      navigate("/agree", { replace: true });
      return;
    }

    navigate("/login", { replace: true });
  }, [navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
      Redirecting...
    </div>
  );
}

export default OAuthCallback;
