import { getPosts, getCategories } from "../../src/lib/notion";
import type { Metadata } from "next";
import { CategoryNavigation } from "@/components/category-navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tools & Craft | Haru.dev",
  description: "Modern blog by Haru",
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
  const categories: string[] = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="xl:grid xl:grid-cols-[300px_auto] xl:gap-12">
          {/* Left Side - Category Navigation */}
          <div className="hidden xl:block">
            <CategoryNavigation categories={categories} />
          </div>

          {/* Right Side - Posts Grid */}
          <div>
            {/* Mobile Title */}
            <div className="xl:hidden mb-8">
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Haru's
                <br />
                <span className="italic font-light">Dev</span>
              </h1>
              <p className="text-gray-600 text-base leading-relaxed mb-6">
                업무 방식의 미래를 이끄는 사람들과
                <br />
                팀이 전하는 생각
              </p>

              {/* Mobile Category Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm rounded-full bg-black text-white"
                >
                  최근
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${encodeURIComponent(category)}`}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => {
                const title =
                  post.properties.이름?.title[0]?.plain_text || "제목 없음";
                const date = post.properties.날짜?.date?.start || "";
                const category = post.properties.카테고리?.select?.name || "";
                const slug =
                  post.properties.Slug?.rich_text[0]?.plain_text || post.id;

                return (
                  <Link
                    href={`/posts/${slug}`}
                    key={post.id}
                    className="block group"
                  >
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-1px]">
                      {/* Image Area */}
                      <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                          <div className="text-center p-8">
                            <div className="text-6xl mb-4">🚀</div>
                            <div className="text-lg font-semibold text-gray-800 mb-2">
                              {title.length > 20
                                ? title.substring(0, 20) + "..."
                                : title}
                            </div>
                            <div className="text-sm text-gray-600">
                              새로운 아이디어와 인사이트를
                              <br />
                              담은 실무형 콘텐츠
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Category */}
                        {category && (
                          <div className="text-sm text-gray-500 mb-2">
                            {category}
                          </div>
                        )}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                          {title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {title}
                        </p>

                        {/* Author */}
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-sm bg-gray-200 text-gray-700">
                              H
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Haru
                            </div>
                            <div className="text-xs text-gray-500">
                              Haru.dev
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">아직 게시물이 없습니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
