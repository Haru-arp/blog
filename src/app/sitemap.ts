import { getPosts, getCategories } from "@/lib/notion";
import type { MetadataRoute } from "next";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://blog.friday.ai.kr";

  try {
    const posts = (await getPosts()) as PageObjectResponse[];
    const categories = await getCategories();

    // 포스트 URL들
    const postUrls = posts.map((post) => {
      const slugProperty = post.properties?.slug;
      const slug =
        slugProperty &&
        "type" in slugProperty &&
        slugProperty.type === "rich_text"
          ? slugProperty.rich_text?.[0]?.plain_text || post.id
          : post.id;

      return {
        url: `${baseUrl}/posts/${slug}`,
        lastModified: new Date(post.last_edited_time),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });

    // 카테고리 URL들
    const categoryUrls = categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.6,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
      ...postUrls,
      ...categoryUrls,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // 에러 발생 시 최소한 홈페이지는 포함
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
      },
    ];
  }
}
