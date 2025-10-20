import { Client } from "@notionhq/client";

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
