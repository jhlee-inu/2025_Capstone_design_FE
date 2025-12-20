import { createContext, useContext, useState, useEffect } from "react";

const PersonaContext = createContext();

export function PersonaProvider({ children }) {
  const [persona, setPersona] = useState(
    localStorage.getItem("persona") || "bear"
  );

  useEffect(() => {
    localStorage.setItem("persona", persona);
  }, [persona]);

  return (
    <PersonaContext.Provider value={{ persona, setPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  return useContext(PersonaContext);
}
