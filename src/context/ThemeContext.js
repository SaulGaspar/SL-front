import React, { createContext, useEffect, useMemo, useState } from "react";

export const ThemeContext = createContext();

const THEME_KEY = "sportlike-theme-preference";
const validPreferences = new Set(["system", "light", "dark"]);

function readPreference() {
  const saved = localStorage.getItem(THEME_KEY);
  if (validPreferences.has(saved)) return saved;

  const legacy = localStorage.getItem("dark-mode");
  if (legacy !== null) return legacy === "true" ? "dark" : "light";
  return "system";
}

export function ThemeProvider({ children }) {

  const [themePreference, setThemePreference] = useState(readPreference);
  const [systemDark, setSystemDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const darkMode = themePreference === "dark" || (themePreference === "system" && systemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event) => setSystemDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    try {
      const preferences = JSON.parse(localStorage.getItem("config-app") || "{}");
      document.body.dataset.reduceMotion = preferences.animaciones === false ? "true" : "false";
    } catch {
      document.body.dataset.reduceMotion = "false";
    }
  }, []);

  useEffect(() => {

    const theme = darkMode ? "dark" : "light";

    // Todas las pantallas consultan los mismos atributos: evita temas mezclados.
    document.documentElement.setAttribute("data-bs-theme", theme);
    document.body.setAttribute("data-bs-theme", theme);
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem(THEME_KEY, themePreference);
    localStorage.setItem("dark-mode", JSON.stringify(darkMode));

  }, [darkMode, themePreference]);

  const value = useMemo(() => ({
    darkMode,
    themePreference,
    setThemePreference,
    // Compatibilidad con los interruptores existentes.
    setDarkMode: (enabled) => setThemePreference(enabled ? "dark" : "light"),
  }), [darkMode, themePreference]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
