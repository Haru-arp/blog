"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NotionSidebarProps {
  categories: string[];
}

export function NotionSidebar({ categories }: NotionSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col min-h-screen">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">H</span>
          </div>
          <span className="font-medium text-gray-900">Haru.dev</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {/* 홈 링크 */}
          <Link
            href="/"
            className={`block px-3 py-1.5 text-sm rounded transition-colors ${
              pathname === "/"
                ? "bg-blue-100 text-blue-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            최근
          </Link>

          {/* 카테고리들 */}
          {categories.map((category) => {
            const href = `/category/${encodeURIComponent(category)}`;
            const isActive = pathname === href;
            return (
              <Link
                key={category}
                href={href}
                className={`block px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {category}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
