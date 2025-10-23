import { getPosts, getCategories, getUserInfo } from "../../src/lib/notion";
import type { Metadata } from "next";
import { CategoryNavigation } from "@/components/category-navigation";
import { PostCard } from "@/components/post-card";
import { BrandHeader } from "@/components/brand-header";
import Link from "next/link";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const metadata: Metadata = {
  title: "friday.tech",
  description:
    "배움과 도전의 흔적을 남기는 개발자들의 공간. 개발, 기술, 혁신에 대한 인사이트를 공유합니다.",
  keywords: [
    "기술 블로그",
    "개발",
    "프로그래밍",
    "혁신",
    "업무 효율성",
    "Friday",
    "AI",
    "개발자",
  ],
  authors: [{ name: "Team Friday", url: "https://blog.friday.ai.kr" }],
  creator: "Team Friday",
  publisher: "Friday",
  openGraph: {
    title: "friday.tech",
    description: "배움과 도전의 흔적을 남기는 개발자들의 공간",
    url: "https://blog.friday.ai.kr",
    siteName: "friday.tech",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "friday.tech",
    description: "배움과 도전의 흔적을 남기는 개발자들의 공간",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console 인증 코드 추가 시 사용
    // google: "your-google-verification-code",
  },
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
    <div className="min-h-screen bg-white dark:bg-[#252827] transition-colors">
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
              <BrandHeader />

              {/* Mobile Category Navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm rounded-full bg-black dark:bg-white text-white dark:text-black"
                >
                  모든
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/category/${encodeURIComponent(category)}`}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-15">
              {postsWithAuthors.map(({ post, author }, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={author}
                  priority={index === 0} // 첫 번째 이미지만 우선순위
                />
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
