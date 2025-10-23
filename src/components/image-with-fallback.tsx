"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
}

export function ImageWithFallback({
  src,
  alt,
  fill = false,
  width,
  height,
  className = "",
  sizes,
  priority = false,
  quality = 85,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 에러 발생 시 fallback 이미지
  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 ${
          fill ? "absolute inset-0" : ""
        } ${className}`}
      >
        <div className="text-center p-4">
          <div className="text-4xl mb-2 opacity-50">📝</div>
          <div className="text-sm text-gray-500 font-medium">
            {alt.length > 30 ? alt.substring(0, 30) + "..." : alt}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 로딩 중 placeholder */}
      {isLoading && (
        <div
          className={`${
            fill ? "absolute inset-0" : "w-full h-full"
          } bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse`}
        />
      )}

      <Image
        src={src}
        alt={alt}
        {...(fill
          ? { fill: true }
          : { width: width || 0, height: height || 0 })}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        sizes={sizes}
        priority={priority}
        quality={quality}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
