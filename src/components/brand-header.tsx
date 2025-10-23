import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

interface BrandHeaderProps {
  className?: string;
  descriptionSize?: "base" | "lg";
}

export function BrandHeader({
  className = "",
  descriptionSize = "base",
}: BrandHeaderProps) {
  const descriptionClass = descriptionSize === "lg" ? "text-lg" : "text-base";

  return (
    <div className={className}>
      <div className="flex items-start justify-between mb-4">
        <Link href="/" className="block">
          <h1 className="text-5xl font-bold leading-tight hover:opacity-80 transition-opacity text-gray-900 dark:text-white">
            Friday.
            <br />
            <span className="italic font-light">Tech</span>
          </h1>
        </Link>
        <div className="mt-2">
          <ThemeToggle size="sm" />
        </div>
      </div>
      <p
        className={`text-gray-600 dark:text-gray-400 ${descriptionClass} leading-relaxed mb-6`}
      >
        배움과 도전의 흔적을 남기는
        <br />
        개발자들의 공간.
      </p>
    </div>
  );
}
