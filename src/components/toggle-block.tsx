"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

interface ToggleBlockProps {
  richText: RichTextItemResponse[];
  children?: React.ReactNode;
}

// 클라이언트 컴포넌트 내부에서 renderRichText 함수 정의
const renderRichText = (richText: RichTextItemResponse[]) => {
  if (!richText) return null;
  return richText.map((text, index) => {
    const { annotations, plain_text, href } = text;
    let element: React.ReactNode = plain_text;

    // 기본 스타일 적용
    if (annotations.bold) element = <strong>{element}</strong>;
    if (annotations.italic) element = <em>{element}</em>;
    if (annotations.strikethrough) element = <del>{element}</del>;
    if (annotations.underline) element = <u>{element}</u>;
    if (annotations.code) {
      element = (
        <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
          {element}
        </code>
      );
    }
    if (href) {
      element = (
        <a
          href={href}
          className="text-blue-600 hover:text-blue-800 underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {element}
        </a>
      );
    }

    return <span key={index}>{element}</span>;
  });
};

export function ToggleBlock({ richText, children }: ToggleBlockProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left p-2 hover:bg-gray-50 rounded-md transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
        )}
        <span className="font-medium text-gray-900">
          {renderRichText(richText)}
        </span>
      </button>

      {isOpen && children && (
        <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-4">
          {children}
        </div>
      )}
    </div>
  );
}
