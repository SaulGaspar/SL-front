import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {

  const getInitialTheme = () => {
    const saved = localStorage.getItem("dark-mode");

    if (saved !== null) return JSON.parse(saved);

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {

    const theme = darkMode ? "dark" : "light";

    // 👉 bootstrap
    document.documentElement.setAttribute("data-bs-theme", theme);

    // 👉 css custom
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem("dark-mode", JSON.stringify(darkMode));

  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
