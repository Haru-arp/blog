import { getPosts, getCategories, getUserInfo } from "../../src/lib/notion";
import type { Metadata } from "next";
import { CategoryNavigation } from "@/components/category-navigation";
import { PostCard } from "@/components/post-card";
import Link from "next/link";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const metadata: Metadata = {
  title: "Tools & Craft | Haru.dev",
  description: "Modern blog by Haru",
};

export const revalidate = 60;

type Post = PageObjectResponse;

export default async function Home() {
  const posts: Post[] = (await getPosts()) as Post[];
  const categories: string[] = await getCategories();

  // 각 포스트의 작성자 정보를 가져오기
  const postsWithAuthors = await Promise.all(
    posts.map(async (post) => {
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
                Haru&apos;s
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
                  모든
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-15">
              {postsWithAuthors.map(({ post, author }) => (
                <PostCard key={post.id} post={post} author={author} />
              ))}
            </div>

            {postsWithAuthors.length === 0 && (
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
