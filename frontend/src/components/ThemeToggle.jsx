import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "theme";

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || "light";
    return saved;
  } catch {
    /* storage unavailable */
  }
}

export default function ThemeToggle({ size = 24, strokeWidth = 1.75 }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    try {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`btn btn-link p-0 border-0 text-body d-inline-flex align-items-center`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun size={size} strokeWidth={strokeWidth} />
      ) : (
        <Moon size={size} strokeWidth={strokeWidth} />
      )}
    </button>
  );
}
