import { Client } from "@notionhq/client";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const getPosts = async () => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "상태",
      status: {
        equals: "공개",
      },
    },
    sorts: [
      {
        property: "날짜",
        direction: "descending",
      },
    ],
  });

  return response.results;
};

export const getPageBySlug = async (slug: string) => {
  const response = await notion.pages.retrieve({ page_id: slug });
  return response;
};

export const getPageContent = async (page_id: string) => {
  const response = await notion.blocks.children.list({
    block_id: page_id,
  });
  return response.results;
};

export const getPageBySlugValue = async (slug: string) => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (response.results.length > 0) {
      return response.results[0];
    }
    return null;
  } catch (error) {
    console.error("Error fetching page by slug:", error);
    return null;
  }
};
export const getCategories = async () => {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not defined");
  }

  try {
    const response = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATABASE_ID,
      filter: {
        property: "상태",
        status: {
          equals: "공개",
        },
      },
    });

    const categories = new Set<string>();
    response.results.forEach((post) => {
      // Notion API에서 반환되는 객체의 타입이 복잡하므로 타입 단언 사용
      const pagePost = post as PageObjectResponse;
      const categoryProperty = pagePost.properties?.카테고리;

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

    return Array.from(categories).sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const getUserInfo = async (userId: string) => {
  try {
    const response = await notion.users.retrieve({ user_id: userId });
    return response;
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
};
