import { getPosts, getCategories, getUserInfo } from "../../../lib/notion";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { CategoryNavigation } from "@/components/category-navigation";
import { PostCard } from "@/components/post-card";
import { BrandHeader } from "@/components/brand-header";
import Link from "next/link";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 60;

type Post = PageObjectResponse;

export async function generateStaticParams() {
  const posts = (await getPosts()) as Post[];
  const categories = new Set<string>();
  posts.forEach((post) => {
    const categoryProperty = post.properties.카테고리;
    if (
      categoryProperty &&
      "type" in categoryProperty &&
      categoryProperty.type === "multi_select"
    ) {
      const multiSelectProperty = categoryProperty as {
        type: "multi_select";
        multi_select: Array<{ name: string; id: string; color: string }>;
      };
      multiSelectProperty.multi_select?.forEach((cat) => {
        if (cat.name) categories.add(cat.name);
      });
    }
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
    title: `${decodedCategory} | friday.tech`,
    description: `${decodedCategory} on friday.tech blog`,
  };
}

export default async function CategoryPage(props: {
  params: { category: string };
}) {
  const { category } = await props.params;
  const decodedCategory = decodeURIComponent(category);
  const allPosts: Post[] = (await getPosts()) as Post[];
  const categories: string[] = await getCategories();

  const filteredPosts = allPosts.filter((post) => {
    const categoryProperty = post.properties.카테고리;
    if (
      categoryProperty &&
      "type" in categoryProperty &&
      categoryProperty.type === "multi_select"
    ) {
      const multiSelectProperty = categoryProperty as {
        type: "multi_select";
        multi_select: Array<{ name: string; id: string; color: string }>;
      };
      return multiSelectProperty.multi_select?.some(
        (cat) => cat.name === decodedCategory
      );
    }
    return false;
  });

  // 각 포스트의 작성자 정보를 가져오기
  const postsWithAuthors = await Promise.all(
    filteredPosts.map(async (post) => {
      const authorId = post.created_by?.id;
      const author = authorId ? await getUserInfo(authorId) : null;
      return {
        post,
        author: author
          ? {
              name: author.name,
              avatar_url: author.avatar_url,
            }
          : undefined,
      };
    })
  );

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="xl:grid xl:grid-cols-[300px_auto] xl:gap-12">
          <div className="hidden xl:block">
            <CategoryNavigation categories={categories} />
          </div>
          <div>
            <div className="xl:hidden mb-8">
              <BrandHeader />

              {/* Mobile Category Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  모든
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
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {decodedCategory}
                </h2>
                <Badge variant="outline">
                  {postsWithAuthors.length}개의 글
                </Badge>
              </div>
            </div>
            <div className="hidden xl:block mb-8">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {decodedCategory}
                </h2>
                <Badge variant="outline">
                  {postsWithAuthors.length}개의 글
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {postsWithAuthors.map(({ post, author }) => (
                <PostCard key={post.id} post={post} author={author} />
              ))}
            </div>
            {postsWithAuthors.length === 0 && (
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
