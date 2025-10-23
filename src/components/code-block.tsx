"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  dracula,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mb-6 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <SyntaxHighlighter
        language={language || "text"}
        style={mounted && theme === "dark" ? dracula : oneLight}
        customStyle={{
          margin: 0,
          padding: "1rem",
          fontSize: "0.875rem",
          lineHeight: "1.5",
          background: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
