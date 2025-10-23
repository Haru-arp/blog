import {
  getPosts,
  getPageBySlug,
  getPageContent,
  getPageBySlugValue,
  getUserInfo,
  getBlockChildren,
} from "../../../lib/notion";
import type { Metadata } from "next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ToggleBlock } from "@/components/toggle-block";
import { ImageWithFallback } from "@/components/image-with-fallback";
import { CodeBlock } from "@/components/code-block";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import type {
  PageObjectResponse,
  BlockObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => {
    const pagePost = post as PageObjectResponse;
    const slugProperty = pagePost.properties?.slug;
    const slug =
      slugProperty &&
      "type" in slugProperty &&
      slugProperty.type === "rich_text"
        ? slugProperty.rich_text?.[0]?.plain_text || pagePost.id
        : pagePost.id;
    return { slug };
  });
}

export async function generateMetadata(props: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await props.params;
  let page = await getPageBySlugValue(slug);
  if (!page) {
    page = await getPageBySlug(slug);
  }

  if (!page) {
    return {
      title: "게시물을 찾을 수 없습니다 - friday.tech",
      description: "요청하신 게시물을 찾을 수 없습니다.",
    };
  }

  const pagePost = page as PageObjectResponse;

  // 제목 추출
  const titleProperty = pagePost?.properties?.이름;
  const title =
    titleProperty && "type" in titleProperty && titleProperty.type === "title"
      ? titleProperty.title?.[0]?.plain_text || "Post"
      : "Post";

  // 설명 추출
  const descriptionProperty = pagePost?.properties?.description;
  const description =
    descriptionProperty &&
    "type" in descriptionProperty &&
    descriptionProperty.type === "rich_text"
      ? descriptionProperty.rich_text?.[0]?.plain_text ||
        `${title}에 대한 Friday 팀의 기술 인사이트와 경험을 공유합니다.`
      : `${title}에 대한 Friday 팀의 기술 인사이트와 경험을 공유합니다.`;

  // 카테고리 추출
  const categoryProperty = pagePost?.properties?.카테고리;
  const categories =
    categoryProperty &&
    "type" in categoryProperty &&
    categoryProperty.type === "multi_select"
      ? (
          categoryProperty as {
            type: "multi_select";
            multi_select: Array<{ name: string; id: string; color: string }>;
          }
        ).multi_select?.map((cat) => cat.name) || []
      : [];

  // 커버 이미지 추출
  const coverImage = pagePost.cover
    ? pagePost.cover.type === "external"
      ? pagePost.cover.external?.url
      : pagePost.cover.type === "file"
      ? pagePost.cover.file?.url
      : null
    : null;

  return {
    title: `${title} - friday.tech`,
    description: description,
    keywords: [title, ...categories, "기술 블로그", "개발", "Friday"],
    authors: [{ name: "Team Friday", url: "https://blog.friday.ai.kr" }],
    openGraph: {
      title: title,
      description: description,
      url: `https://blog.friday.ai.kr/posts/${slug}`,
      siteName: "friday.tech",
      type: "article",
      locale: "ko_KR",
      ...(coverImage && { images: [{ url: coverImage, alt: title }] }),
      publishedTime: pagePost.created_time,
      modifiedTime: pagePost.last_edited_time,
      tags: categories,
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      ...(coverImage && { images: [coverImage] }),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

type PageProps = {
  params: {
    slug: string;
  };
};

const renderRichText = (richText: RichTextItemResponse[]) => {
  if (!richText) return null;
  return richText.map((text, index) => {
    const { annotations, plain_text, href } = text;
    let element: React.ReactNode = plain_text;

    // 기본 스타일 적용
    if (annotations.bold) element = <strong>{element}</strong>;
    if (annotations.italic) element = <em>{element}</em>;
    if (annotations.strikethrough) element = <del>{element}</del>;
    if (annotations.underline) element = <u>{element}</u>;
    if (annotations.code) {
      element = (
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-1.5 py-0.5 rounded text-sm font-mono">
          {element}
        </code>
      );
    }
    if (href) {
      element = (
        <a
          href={href}
          className="text-primary hover:text-primary/80 underline underline-offset-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {element}
        </a>
      );
    }

    // 색상 처리를 위한 클래스 생성
    const colorClasses: string[] = [];

    // 텍스트 색상
    if (annotations.color && annotations.color !== "default") {
      const colorMap: { [key: string]: string } = {
        gray: "text-gray-600",
        brown: "text-amber-700",
        orange: "text-orange-600",
        yellow: "text-yellow-600",
        green: "text-green-600",
        blue: "text-blue-600",
        purple: "text-purple-600",
        pink: "text-pink-600",
        red: "text-red-600",
        gray_background:
          "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-1 py-0.5 rounded",
        brown_background:
          "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1 py-0.5 rounded",
        orange_background:
          "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-1 py-0.5 rounded",
        yellow_background:
          "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-1 py-0.5 rounded",
        green_background:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-1 py-0.5 rounded",
        blue_background:
          "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.5 rounded",
        purple_background:
          "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1 py-0.5 rounded",
        pink_background:
          "bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-1 py-0.5 rounded",
        red_background:
          "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-1 py-0.5 rounded",
      };

      const colorClass = colorMap[annotations.color as string];
      if (colorClass) {
        colorClasses.push(colorClass);
      }
    }

    // 색상이 적용된 경우 span으로 감싸기
    if (colorClasses.length > 0) {
      element = <span className={colorClasses.join(" ")}>{element}</span>;
    }

    return <span key={index}>{element}</span>;
  });
};

const groupBlocks = (blocks: BlockObjectResponse[]) => {
  const grouped: (
    | BlockObjectResponse
    | {
        type: "list_group";
        listType: string;
        items: BlockObjectResponse[];
        id: string;
      }
  )[] = [];
  let currentGroup: BlockObjectResponse[] = [];
  let currentGroupType: string | null = null;

  for (const block of blocks) {
    const isListItem =
      block.type === "bulleted_list_item" ||
      block.type === "numbered_list_item";

    if (
      isListItem &&
      (currentGroupType === block.type || currentGroupType === null)
    ) {
      currentGroup.push(block);
      currentGroupType = block.type;
    } else {
      if (currentGroup.length > 0) {
        grouped.push({
          type: "list_group",
          listType: currentGroupType || "bulleted_list_item",
          items: currentGroup,
          id: `group-${currentGroup[0].id}`,
        });
        currentGroup = [];
      }
      if (isListItem) {
        currentGroup.push(block);
        currentGroupType = block.type;
      } else {
        grouped.push(block);
        currentGroupType = null;
      }
    }
  }
  if (currentGroup.length > 0) {
    grouped.push({
      type: "list_group",
      listType: currentGroupType || "bulleted_list_item",
      items: currentGroup,
      id: `group-${currentGroup[0].id}`,
    });
  }
  return grouped;
};

// 리스트 아이템 컴포넌트 (중첩 리스트 지원)
async function ListItem({
  item,
  type,
}: {
  item: BlockObjectResponse;
  type: "bulleted" | "numbered";
}) {
  const listItem = item as BlockObjectResponse & {
    bulleted_list_item?: { rich_text: RichTextItemResponse[] };
    numbered_list_item?: { rich_text: RichTextItemResponse[] };
  };

  const richText =
    type === "bulleted"
      ? listItem.bulleted_list_item?.rich_text
      : listItem.numbered_list_item?.rich_text;

  // 자식 블록들 (중첩된 리스트) 가져오기
  const children = await getBlockChildren(item.id);
  const hasChildren = children && children.length > 0;

  return (
    <li className="leading-7">
      {richText && renderRichText(richText)}
      {hasChildren && (
        <div className="mt-2">
          {children.map((child) => {
            if (!("type" in child)) return null;

            if (child.type === "bulleted_list_item") {
              return (
                <ul key={child.id} className="list-disc pl-6 mt-2 space-y-1">
                  <ListItem
                    item={child as BlockObjectResponse}
                    type="bulleted"
                  />
                </ul>
              );
            } else if (child.type === "numbered_list_item") {
              return (
                <ol key={child.id} className="list-decimal pl-6 mt-2 space-y-1">
                  <ListItem
                    item={child as BlockObjectResponse}
                    type="numbered"
                  />
                </ol>
              );
            }
            return null;
          })}
        </div>
      )}
    </li>
  );
}

// 토글 블록 래퍼 컴포넌트
async function ToggleBlockWrapper({
  blockId,
  richText,
}: {
  blockId: string;
  richText: RichTextItemResponse[];
}) {
  const children = await getBlockChildren(blockId);
  const groupedChildren = groupBlocks(children as BlockObjectResponse[]);

  return (
    <ToggleBlock richText={richText}>
      {groupedChildren.length > 0 && (
        <div>
          {groupedChildren.map((childBlock) => (
            <div key={childBlock.id}>{renderBlock(childBlock)}</div>
          ))}
        </div>
      )}
    </ToggleBlock>
  );
}

// 테이블 블록 컴포넌트
async function TableBlock({ blockId }: { blockId: string }) {
  const tableRows = await getBlockChildren(blockId);

  if (!tableRows || tableRows.length === 0) {
    return (
      <div className="mb-6 p-4 border border-gray-200 rounded-lg">
        <p className="text-gray-500 text-sm">빈 테이블</p>
      </div>
    );
  }

  return (
    <div className="mb-6 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
        <tbody>
          {tableRows.map((row, rowIndex) => {
            const tableRow = row as BlockObjectResponse & {
              table_row: {
                cells: RichTextItemResponse[][];
              };
            };

            if (!("type" in row) || row.type !== "table_row") return null;

            return (
              <tr
                key={row.id}
                className={rowIndex === 0 ? "bg-gray-50" : "bg-white"}
              >
                {tableRow.table_row.cells.map((cell, cellIndex) => {
                  const CellTag = rowIndex === 0 ? "th" : "td";
                  return (
                    <CellTag
                      key={cellIndex}
                      className={`px-4 py-3 border border-gray-300 text-left ${
                        rowIndex === 0
                          ? "font-semibold text-gray-900"
                          : "text-gray-700"
                      }`}
                    >
                      {renderRichText(cell)}
                    </CellTag>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const renderBlock = (
  block:
    | BlockObjectResponse
    | {
        type: "list_group";
        listType: string;
        items: BlockObjectResponse[];
        id: string;
      }
) => {
  switch (block.type) {
    case "heading_1":
      const heading1Block = block as BlockObjectResponse & {
        heading_1: { rich_text: RichTextItemResponse[] };
      };
      return (
        <h1 className="text-3xl font-bold mt-12 mb-6 tracking-tight">
          {renderRichText(heading1Block.heading_1.rich_text)}
        </h1>
      );
    case "heading_2":
      const heading2Block = block as BlockObjectResponse & {
        heading_2: { rich_text: RichTextItemResponse[] };
      };
      return (
        <h2 className="text-2xl font-semibold mt-10 mb-4 tracking-tight">
          {renderRichText(heading2Block.heading_2.rich_text)}
        </h2>
      );
    case "heading_3":
      const heading3Block = block as BlockObjectResponse & {
        heading_3: { rich_text: RichTextItemResponse[] };
      };
      return (
        <h3 className="text-xl font-semibold mt-8 mb-3 tracking-tight">
          {renderRichText(heading3Block.heading_3.rich_text)}
        </h3>
      );
    case "paragraph":
      const paragraphBlock = block as BlockObjectResponse & {
        paragraph: { rich_text: RichTextItemResponse[] };
      };
      return (
        <p className="leading-7 mb-6 text-foreground">
          {renderRichText(paragraphBlock.paragraph.rich_text)}
        </p>
      );
    case "list_group":
      if (block.listType === "bulleted_list_item") {
        return (
          <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
            {block.items.map((item: BlockObjectResponse) => (
              <ListItem key={item.id} item={item} type="bulleted" />
            ))}
          </ul>
        );
      } else if (block.listType === "numbered_list_item") {
        return (
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground">
            {block.items.map((item: BlockObjectResponse) => (
              <ListItem key={item.id} item={item} type="numbered" />
            ))}
          </ol>
        );
      }
      break;
    case "quote":
      const quoteBlock = block as BlockObjectResponse & {
        quote: { rich_text: RichTextItemResponse[] };
      };
      return (
        <blockquote className="border-l-4 border-border pl-6 mb-6 italic text-muted-foreground bg-muted/50 py-4 rounded-r-lg">
          {renderRichText(quoteBlock.quote.rich_text)}
        </blockquote>
      );
    case "callout":
      const calloutBlock = block as BlockObjectResponse & {
        callout: {
          rich_text: RichTextItemResponse[];
          icon?: { emoji?: string };
        };
      };
      const emoji = calloutBlock.callout.icon?.emoji || "💡";
      return (
        <Alert className="mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">{emoji}</span>
            <AlertDescription className="text-sm leading-6">
              {renderRichText(calloutBlock.callout.rich_text)}
            </AlertDescription>
          </div>
        </Alert>
      );
    case "divider":
      return <Separator className="my-8" />;
    case "table":
      return <TableBlock blockId={block.id} />;
    case "table_row":
      // 테이블 행은 TableBlock 컴포넌트에서 처리됩니다
      return null;
    case "image":
      const imageBlock = block as BlockObjectResponse & {
        image: {
          type: "file" | "external";
          file?: { url: string };
          external?: { url: string };
          caption?: RichTextItemResponse[];
        };
      };
      const imageUrl =
        imageBlock.image.type === "file"
          ? imageBlock.image.file?.url
          : imageBlock.image.external?.url;
      const caption = imageBlock.image.caption;

      if (!imageUrl) return null;

      // GIF나 애니메이션 이미지는 일반 img 태그 사용
      const isAnimated =
        imageUrl.toLowerCase().includes(".gif") ||
        imageUrl.includes("giphy.com");

      return (
        <div className="mb-6">
          {isAnimated ? (
            <img
              src={imageUrl}
              alt={caption?.[0]?.plain_text || "Image"}
              className="w-full h-auto rounded-lg"
              loading="eager"
              decoding="async"
            />
          ) : (
            <ImageWithFallback
              src={imageUrl}
              alt={caption?.[0]?.plain_text || "Image"}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-lg"
              quality={90}
              priority={false}
            />
          )}
          {caption && caption.length > 0 && (
            <p className="text-sm text-gray-500 text-center mt-2 italic">
              {renderRichText(caption)}
            </p>
          )}
        </div>
      );
    case "code":
      const codeBlock = block as BlockObjectResponse & {
        code: {
          rich_text: RichTextItemResponse[];
          language?: string;
        };
      };
      return (
        <CodeBlock
          language={codeBlock.code.language || "text"}
          code={codeBlock.code.rich_text[0]?.plain_text || ""}
        />
      );
    case "to_do":
      const todoBlock = block as BlockObjectResponse & {
        to_do: {
          rich_text: RichTextItemResponse[];
          checked: boolean;
        };
      };
      return (
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 mt-1">
            <div
              className={`w-4 h-4 border-2 rounded-sm flex items-center justify-center ${
                todoBlock.to_do.checked
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {todoBlock.to_do.checked && (
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <div
            className={`flex-1 leading-7 ${
              todoBlock.to_do.checked
                ? "line-through text-gray-500"
                : "text-foreground"
            }`}
          >
            {renderRichText(todoBlock.to_do.rich_text)}
          </div>
        </div>
      );
    case "toggle":
      const toggleBlock = block as BlockObjectResponse & {
        toggle: {
          rich_text: RichTextItemResponse[];
        };
      };

      // 토글 블록의 자식 콘텐츠를 비동기로 가져와야 하므로 별도 컴포넌트 필요
      return (
        <ToggleBlockWrapper
          key={block.id}
          blockId={block.id}
          richText={toggleBlock.toggle.rich_text}
        />
      );
    default:
      return (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>
            지원되지 않는 블록 타입: {block.type}
          </AlertDescription>
        </Alert>
      );
  }
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function PostPage(props: PageProps) {
  const { slug } = await props.params;
  let page = await getPageBySlugValue(slug);
  let pageId = page?.id;
  if (!page) {
    page = await getPageBySlug(slug);
    pageId = slug;
  }
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            게시물을 찾을 수 없습니다
          </h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              홈으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const content = (await getPageContent(
    pageId || slug
  )) as BlockObjectResponse[];

  const pagePost = page as PageObjectResponse;

  // 제목 속성 처리
  const titleProperty = pagePost.properties?.이름;
  const title =
    titleProperty && "type" in titleProperty && titleProperty.type === "title"
      ? titleProperty.title?.[0]?.plain_text || "제목 없음"
      : "제목 없음";

  // 날짜 속성 처리
  const dateProperty = pagePost.properties?.날짜;
  const date =
    dateProperty && "type" in dateProperty && dateProperty.type === "date"
      ? dateProperty.date?.start || ""
      : "";

  // 카테고리 속성 처리
  const categoryProperty = pagePost.properties?.카테고리;
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

  // Position 속성 처리
  const positionProperty = pagePost.properties?.position;
  const position =
    positionProperty &&
    "type" in positionProperty &&
    positionProperty.type === "select"
      ? positionProperty.select?.name || "개발자"
      : "개발자";

  const groupedContent = groupBlocks(content);

  // 작성자 정보 가져오기
  const authorId = pagePost.created_by?.id;
  const authorInfo = authorId ? await getUserInfo(authorId) : null;
  const author = authorInfo
    ? {
        name: authorInfo.name,
        avatar_url: authorInfo.avatar_url,
      }
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#252827] transition-colors">
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="xl:grid xl:grid-cols-[300px_auto] xl:gap-12">
          {/* Left Side - Back Navigation */}
          <div className="hidden xl:block">
            <div className="sticky top-8">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  모든 게시글
                </Link>
                <ThemeToggle size="sm" />
              </div>
            </div>
          </div>

          {/* Right Side - Article Content */}
          <div className="max-w-4xl">
            {/* Mobile Back Button */}
            <div className="xl:hidden mb-8">
              <div className="flex items-center justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  모든 게시글
                </Link>
                <ThemeToggle size="xs" />
              </div>
            </div>

            {/* Article Header */}
            <header className="my-15">
              {/* Categories and Date */}
              <div className="flex items-center flex-wrap gap-1 text-sm mb-1 text-[#0009] dark:text-gray-400">
                {categories.length > 0 && (
                  <>
                    {categories.map((cat, index) => (
                      <Link
                        key={index}
                        href={`/category/${encodeURIComponent(cat)}`}
                        className="hover:text-gray-700 dark:hover:text-gray-200 whitespace-nowrap transition-colors underline"
                      >
                        {cat}
                      </Link>
                    ))}
                  </>
                )}
              </div>
              {date && (
                <div className="text-sm text-[#191918] dark:text-gray-300 mb-3">
                  {formatDate(date)}
                </div>
              )}

              {/* Title */}
              <h1 className="text-[32px] xl:text-[54px] font-bold tracking-tight leading-none text-[#191918] dark:text-white">
                {title}
              </h1>

              {/* Author Info */}
              <div className="flex items-center justify-start gap-2.5 mt-3">
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
                  <p className="text-sm font-medium text-[#191918] dark:text-white">
                    {author?.name || "???"}
                  </p>
                  <p className="text-xs text-[#a39e98] dark:text-gray-400">
                    {position}
                  </p>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <article className="prose prose-lg prose-gray max-w-none">
              {groupedContent.map((block) => (
                <div key={block.id}>{renderBlock(block)}</div>
              ))}
            </article>
          </div>
        </div>
      </main>
    </div>
  );
}
