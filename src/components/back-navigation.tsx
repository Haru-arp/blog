"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackNavigation() {
  const backUrl = "/";
  const backText = "모든 게시글";

  return (
    <div className="sticky top-8 ">
      <div className="xl:pr-4 xl:w-[150px]">
        <Link href={backUrl}>
          <Button
            variant="ghost"
            className="p-0 h-auto font-normal text-sm text-blue-600 hover:text-blue-800 flex items-center whitespace-nowrap"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {backText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
