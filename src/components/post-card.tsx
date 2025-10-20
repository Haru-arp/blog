import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User } from "lucide-react";

type Post = {
  id: string;
  properties: {
    [key: string]: any;
  };
};

interface PostCardProps {
  post: Post;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function PostCard({ post }: PostCardProps) {
  const title = post.properties.이름?.title[0]?.plain_text || "제목 없음";
  const date = post.properties.날짜?.date?.start || "";
  const category = post.properties.카테고리?.select?.name || "";
  const slug = post.properties.Slug?.rich_text[0]?.plain_text || post.id;

  // 썸네일 이미지 (없으면 기본 패턴)
  const thumbnail =
    post.properties.썸네일?.files?.[0]?.file?.url ||
    post.properties.썸네일?.files?.[0]?.external?.url;

  return (
    <Link href={`/posts/${slug}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-4px]">
        {/* Thumbnail */}
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 relative overflow-hidden">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl font-bold text-blue-200 dark:text-blue-800 opacity-50">
                {title.charAt(0)}
              </div>
            </div>
          )}
          {category && (
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-white/90 text-gray-700">
                {category}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>

            {/* Meta */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{date ? formatDate(date) : "날짜 없음"}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">H</AvatarFallback>
                </Avatar>
                <span className="text-xs">Haru</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
