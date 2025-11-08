"use client";

import { useState } from "react";

interface SmoothImageProps {
  src: string;
  alt: string;
  className?: string;
  blockId?: string;
}

export function SmoothImage({
  src,
  alt,
  className = "",
  blockId,
}: SmoothImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="relative w-full min-h-[300px] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4 opacity-30">🖼️</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            이미지를 불러올 수 없습니다
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">{alt}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Skeleton Loader - 이미지 로딩 전 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      )}

      {/* 실제 이미지 */}
      <img
        src={src}
        alt={alt}
        className={`
          w-full h-auto
          transition-all duration-700 ease-out
          ${
            isLoaded
              ? "opacity-100 blur-0 scale-100"
              : "opacity-0 blur-md scale-105"
          }
          ${className}
        `}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          console.log("✅ Image Loaded Successfully:", alt);
          setIsLoaded(true);
        }}
        onError={() => {
          console.error("❌ Image Load Failed:", alt);
          setHasError(true);
        }}
      />
    </div>
  );
}
