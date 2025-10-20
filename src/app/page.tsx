import { getPosts } from "../../src/lib/notion";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Haru.dev",
  description: "Minimal blog by Haru",
};

export const revalidate = 60;

type Post = {
  id: string;
  properties: {
    [key: string]: any;
  };
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function Home() {
  const posts: Post[] = (await getPosts()) as Post[];

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-16 text-center relative">
        <div className="absolute top-0 right-0">
          <ThemeToggle />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Haru.dev</h1>
        <p className="text-muted-foreground text-lg">개발과 일상의 기록</p>
        <Separator className="mt-8" />
      </div>

      {/* Posts */}
      <div className="space-y-8">
        {posts.map((post) => {
          const title =
            post.properties.이름?.title[0]?.plain_text || "제목 없음";
          const date = post.properties.날짜?.date?.start || "";
          const slug =
            post.properties.Slug?.rich_text[0]?.plain_text || post.id;

          return (
            <Link href={`/posts/${slug}`} key={post.id} className="block group">
              <Card className="border-0 shadow-none hover:shadow-sm dark:hover:shadow-md transition-all duration-200 hover:translate-y-[-2px] hover:bg-accent/50">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <h2 className="text-xl font-semibold group-hover:text-muted-foreground transition-colors">
                      {title}
                    </h2>
                    {date && (
                      <Badge variant="secondary" className="text-xs">
                        {formatDate(date)}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t text-center">
        <p className="text-sm text-muted-foreground">© 2024 Haru.dev</p>
      </div>
    </div>
  );
}
