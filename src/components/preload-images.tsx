import { useEffect } from "react";

interface PreloadImagesProps {
  imageUrls: string[];
}

export function PreloadImages({ imageUrls }: PreloadImagesProps) {
  useEffect(() => {
    // 이미지 프리로딩
    imageUrls.forEach((url) => {
      if (url) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = url;
        document.head.appendChild(link);
      }
    });

    // 클린업
    return () => {
      const preloadLinks = document.querySelectorAll(
        'link[rel="preload"][as="image"]'
      );
      preloadLinks.forEach((link) => {
        if (imageUrls.some((url) => link.getAttribute("href") === url)) {
          link.remove();
        }
      });
    };
  }, [imageUrls]);

  return null;
}
