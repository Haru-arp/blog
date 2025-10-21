"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryNavigationProps {
  categories: string[];
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-8">
      <div className="xl:border-r xl:border-gray-200 xl:pr-8 xl:min-h-[calc(100vh-6rem)]">
        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Haru&apos;s
          <br />
          <span className="italic font-light">Dev</span>
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-8">
          업무 방식의 미래를 이끄는 사람들과
          <br />
          팀이 전하는 생각
        </p>

        <div className="border-t border-gray-200 pt-8">
          <div className="space-y-1">
            <Link
              href="/"
              className={`block text-sm py-2 transition-colors ${
                pathname === "/"
                  ? "text-black font-medium"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              모든 게시글
            </Link>

            {categories.map((category) => {
              const href = `/category/${encodeURIComponent(category)}`;
              const isActive = pathname === href;

              return (
                <Link
                  key={category}
                  href={href}
                  className={`block text-sm py-2 transition-colors ${
                    isActive
                      ? "text-black font-medium"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {category}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
