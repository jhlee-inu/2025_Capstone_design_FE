import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function OAuthCallback() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let active = true;

    const isFilled = (value) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      return true;
    };

    const handleAuth = async () => {
      const accessToken = params.get("accessToken") || "";
      const refreshToken = params.get("refreshToken") || "";
      const tokenType = params.get("tokenType") || "Bearer";
      const expiresIn = params.get("expiresIn") || "";

      if (!accessToken) {
        navigate("/login", { replace: true });
        return;
      }

      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      if (tokenType) localStorage.setItem("tokenType", tokenType);
      if (expiresIn) localStorage.setItem("expiresIn", expiresIn);

      if (!baseUrl) {
        navigate("/agree", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${baseUrl}/api/onboarding`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: `${tokenType} ${accessToken}`,
          },
        });

        if (!response.ok) {
          navigate("/agree", { replace: true });
          return;
        }

        const data = await response.json();
        if (!active) return;

        const requiredKeys = [
          "nickname",
          "birthDate",
          "mbti",
          "companion",
          "sasang",
          "selectedPersona",
          "lang",
        ];
        const isComplete = requiredKeys.every((key) => isFilled(data?.[key]));

        navigate(isComplete ? "/home" : "/agree", { replace: true });
      } catch (e) {
        if (!active) return;
        console.error("onboarding fetch error:", e);
        navigate("/agree", { replace: true });
      }
    };

    handleAuth();

    return () => {
      active = false;
    };
  }, [baseUrl, navigate, params]);

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
      Redirecting...
    </div>
  );
}

export default OAuthCallback;
