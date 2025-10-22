import Link from "next/link";

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
      <Link href="/" className="block">
        <h1 className="text-5xl font-bold mb-4 leading-tight hover:opacity-80 transition-opacity">
          Friday.
          <br />
          <span className="italic font-light">Tech</span>
        </h1>
      </Link>
      <p className={`text-gray-600 ${descriptionClass} leading-relaxed mb-6`}>
        배움과 도전의 흔적을 남기는
        <br />
        개발자들의 공간.
      </p>
    </div>
  );
}
