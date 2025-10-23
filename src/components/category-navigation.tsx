"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandHeader } from "./brand-header";

interface CategoryNavigationProps {
  categories: string[];
}

export function CategoryNavigation({ categories }: CategoryNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="sticky top-8">
      <div className="xl:border-r xl:border-gray-200 dark:xl:border-gray-700 xl:pr-8 xl:min-h-[calc(100vh-6rem)]">
        <BrandHeader className="mb-8" descriptionSize="lg" />

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="space-y-1">
            <Link
              href="/"
              className={`block text-sm py-2 transition-colors ${
                pathname === "/"
                  ? "text-black dark:text-white font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
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
                      ? "text-black dark:text-white font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
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
