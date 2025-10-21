import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type Post = PageObjectResponse;

interface Author {
  name?: string | null;
  avatar_url?: string | null;
}

interface PostCardProps {
  post: Post;
  author?: Author;
}

export function PostCard({ post, author }: PostCardProps) {
  // 제목 속성 처리
  const titleProperty = post.properties.이름;
  const title =
    titleProperty && "type" in titleProperty && titleProperty.type === "title"
      ? titleProperty.title?.[0]?.plain_text || "제목 없음"
      : "제목 없음";

  // 카테고리 속성 처리 (모든 카테고리 가져오기)
  const categoryProperty = post.properties.카테고리;
  const categories =
    categoryProperty &&
    "type" in categoryProperty &&
    categoryProperty.type === "multi_select"
      ? (
          categoryProperty as {
            type: "multi_select";
            multi_select: Array<{ name: string; id: string; color: string }>;
          }
        ).multi_select
          ?.map((cat) => cat.name)
          .filter(Boolean) || []
      : [];

  // slug 속성 처리
  const slugProperty = post.properties.slug;
  const slug =
    slugProperty && "type" in slugProperty && slugProperty.type === "rich_text"
      ? slugProperty.rich_text?.[0]?.plain_text || post.id
      : post.id;

  // Description 속성 처리
  const descriptionProperty = post.properties.description;
  const description =
    descriptionProperty &&
    "type" in descriptionProperty &&
    descriptionProperty.type === "rich_text"
      ? descriptionProperty.rich_text?.[0]?.plain_text || ""
      : "";

  // Position 속성 처리
  const positionProperty = post.properties.position;
  const position =
    positionProperty &&
    "type" in positionProperty &&
    positionProperty.type === "select"
      ? positionProperty.select?.name || "개발자"
      : "개발자";

  // 커버 이미지 처리
  const coverImage = post.cover
    ? post.cover.type === "external"
      ? post.cover.external?.url
      : post.cover.type === "file"
      ? post.cover.file?.url
      : null
    : null;

  return (
    <Link href={`/posts/${slug}`} className="block group">
      <article className="flex flex-col gap-[8px] overflow-hidden">
        {/* Hero Image */}
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden border border-[#00000014] rounded-[0.375rem]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl mb-3 opacity-80">📝</div>
                <div className="text-sm font-medium text-gray-600 px-4">
                  {title.length > 40 ? title.substring(0, 40) + "..." : title}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          {/* All Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap h-6 gap-1.5 mb-1">
              {categories.map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs font-medium text-[#00000096]"
                >
                  {category}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h2 className="text-[22px] font-semibold text-[#191918] leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h2>

          {/* Description */}
          <div className="m-[8px_0_10px] text-[#00000096] text-[16px] leading-relaxed line-clamp-2">
            {description ||
              "새로운 아이디어와 인사이트를 담은 실무형 콘텐츠입니다."}
          </div>

          {/* Footer */}
          <div className="flex items-center">
            <div className="flex items-center gap-2.5 flex-[0_1_auto] w-full">
              <Avatar className="w-9 h-9">
                {author?.avatar_url && (
                  <AvatarImage
                    src={author.avatar_url}
                    alt={author.name || "Author"}
                  />
                )}
                <AvatarFallback className="text-xs bg-blue-100 text-blue-700 font-medium">
                  {author?.name?.charAt(0)?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-[#191918]">
                  {author?.name || "???"}
                </p>
                <p className="text-xs text-[#a39e98]">{position}</p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
