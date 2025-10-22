import { useEffect } from "react";

interface ImagePreloaderProps {
  images: string[];
}

export function ImagePreloader({ images }: ImagePreloaderProps) {
  useEffect(() => {
    // 이미지 프리로딩
    const preloadPromises = images.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    });

    // 모든 이미지 로딩 완료 대기 (선택사항)
    Promise.allSettled(preloadPromises).then(() => {
      console.log("Images preloaded");
    });
  }, [images]);

  return null;
}

// 서버 컴포넌트에서 사용할 수 있는 프리로드 링크 생성
export function generatePreloadLinks(images: string[]) {
  return images.map((src, index) => (
    <link key={index} rel="preload" as="image" href={src} />
  ));
}
