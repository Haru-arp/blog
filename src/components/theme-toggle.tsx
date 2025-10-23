"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  size?: "xs" | "sm" | "md";
}

export function ThemeToggle({ size = "md" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "w-7 h-7 sm:w-7 sm:h-7";
      case "sm":
        return "w-8 h-8 sm:w-8 sm:h-8";
      default:
        return "w-9 h-9 sm:w-9 sm:h-9";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "xs":
        return "h-3.5 w-3.5 sm:h-3.5 sm:w-3.5";
      case "sm":
        return "h-4 w-4 sm:h-4 sm:w-4";
      default:
        return "h-4.5 w-4.5 sm:h-4 sm:w-4";
    }
  };

  const sizeClasses = getSizeClasses();
  const iconSize = getIconSize();

  if (!mounted) {
    return (
      <div
        className={`${sizeClasses} rounded-md border border-gray-200 dark:border-gray-700`}
      />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`relative ${sizeClasses} rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center`}
      aria-label="테마 변경"
    >
      <Sun
        className={`${iconSize} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-700`}
      />
      <Moon
        className={`absolute ${iconSize} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-gray-300`}
      />
    </button>
  );
}
