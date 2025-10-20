import { getPosts, getCategories } from "../../../lib/notion";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { CategoryNavigation } from "@/components/category-navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

export const revalidate = 60;

type Post = {
  id: string;
  properties: {
    [key: string]: any;
  };
};

export async function generateStaticParams() {
  const posts: Post[] = (await getPosts()) as Post[];
  const categories = new Set<string>();
  posts.forEach((post) => {
    const category = post.properties.카테고리?.select?.name;
    if (category) categories.add(category);
  });
  return Array.from(categories).map((category) => ({
    category: encodeURIComponent(category),
  }));
}

export async function generateMetadata(props: {
  params: { category: string };
}): Promise<Metadata> {
  const { category } = await props.params;
  const decodedCategory = decodeURIComponent(category);
  return {
    title: `${decodedCategory} | Haru.dev`,
    description: `${decodedCategory} 카테고리의 글들`,
  };
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function CategoryPage(props: {
  params: { category: string };
}) {
  const { category } = await props.params;
  const decodedCategory = decodeURIComponent(category);
  const allPosts: Post[] = (await getPosts()) as Post[];
  const categories: string[] = await getCategories();

  const posts = allPosts.filter((post) => {
    const postCategory = post.properties.카테고리?.select?.name;
    return postCategory === decodedCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="xl:grid xl:grid-cols-[300px_auto] xl:gap-12">
          <div className="hidden xl:block">
            <CategoryNavigation categories={categories} />
          </div>
          <div>
            <div className="xl:hidden mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {decodedCategory}
                </h1>
                <Badge variant="outline">{posts.length}개의 글</Badge>
              </div>

              {/* Mobile Category Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  최근
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/category/${encodeURIComponent(cat)}`}
                    className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                      cat === decodedCategory
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div className="hidden xl:block mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {decodedCategory}
                </h2>
                <Badge variant="outline">{posts.length}개의 글</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => {
                const title =
                  post.properties.이름?.title[0]?.plain_text || "제목 없음";
                const date = post.properties.날짜?.date?.start || "";
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
                            <div className="text-6xl mb-4">📝</div>
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
                        <div className="text-sm text-gray-500 mb-2">
                          {decodedCategory}
                        </div>

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
                <p className="text-gray-500">
                  이 카테고리에는 아직 글이 없습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
