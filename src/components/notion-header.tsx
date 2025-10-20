"use client";

import { Search, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NotionHeader() {
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center justify-between px-4">
      {/* Left side - Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <span>Notion</span>
        <span>→</span>
        <span>블로그</span>
        <span>→</span>
        <span>템플릿</span>
        <span>→</span>
        <span>가격</span>
        <span>→</span>
        <span>커뮤니티</span>
        <span>→</span>
        <span>템플릿 갤러리</span>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" className="text-gray-600">
          로그인
        </Button>
        <Button size="sm" className="bg-black text-white hover:bg-gray-800">
          Notion 무료로 사용하기
        </Button>
      </div>
    </header>
  );
}
