import {
  getPosts,
  getPageBySlug,
  getPageContent,
  getPageBySlugValue,
} from "../../../lib/notion";
import type { Metadata } from "next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BackNavigation } from "@/components/back-navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts: any[] = await getPosts();
  return posts.map((post) => ({
    slug: post.properties.Slug?.rich_text[0]?.plain_text || post.id,
  }));
}

export async function generateMetadata(props: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await props.params;
  let page: any = await getPageBySlugValue(slug);
  if (!page) {
    page = await getPageBySlug(slug);
  }
  const title = page?.properties?.이름?.title[0]?.plain_text || "Post";
  return {
    title: `${title} | Haru.dev`,
    description: `"${title}" on Haru.dev Blog`,
  };
}

type PageProps = {
  params: {
    slug: string;
  };
};

const renderRichText = (richText: any[]) => {
  if (!richText) return null;
  return richText.map((text, index) => {
    const { annotations, plain_text, href } = text;
    let element: React.ReactNode = plain_text;
    if (annotations.bold) element = <strong>{element}</strong>;
    if (annotations.italic) element = <em>{element}</em>;
    if (annotations.strikethrough) element = <del>{element}</del>;
    if (annotations.underline) element = <u>{element}</u>;
    if (annotations.code) {
      element = (
        <code className="bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-sm font-mono">
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
    return <span key={index}>{element}</span>;
  });
};

const groupBlocks = (blocks: any[]) => {
  const grouped: any[] = [];
  let currentGroup: any[] = [];
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
          listType: currentGroupType,
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
      listType: currentGroupType,
      items: currentGroup,
      id: `group-${currentGroup[0].id}`,
    });
  }
  return grouped;
};

const renderBlock = (block: any) => {
  switch (block.type) {
    case "heading_1":
      return (
        <h1 className="text-3xl font-bold mt-12 mb-6 tracking-tight">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-2xl font-semibold mt-10 mb-4 tracking-tight">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-xl font-semibold mt-8 mb-3 tracking-tight">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      );
    case "paragraph":
      return (
        <p className="leading-7 mb-6 text-foreground">
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );
    case "list_group":
      if (block.listType === "bulleted_list_item") {
        return (
          <ul className="list-disc pl-6 mb-6 space-y-2 text-foreground">
            {block.items.map((item: any) => (
              <li key={item.id} className="leading-7">
                {renderRichText(item.bulleted_list_item.rich_text)}
              </li>
            ))}
          </ul>
        );
      } else if (block.listType === "numbered_list_item") {
        return (
          <ol className="list-decimal pl-6 mb-6 space-y-2 text-foreground">
            {block.items.map((item: any) => (
              <li key={item.id} className="leading-7">
                {renderRichText(item.numbered_list_item.rich_text)}
              </li>
            ))}
          </ol>
        );
      }
      break;
    case "quote":
      return (
        <blockquote className="border-l-4 border-border pl-6 mb-6 italic text-muted-foreground bg-muted/50 py-4 rounded-r-lg">
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );
    case "callout":
      const emoji = block.callout.icon?.emoji || "💡";
      return (
        <Alert className="mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">{emoji}</span>
            <AlertDescription className="text-sm leading-6">
              {renderRichText(block.callout.rich_text)}
            </AlertDescription>
          </div>
        </Alert>
      );
    case "divider":
      return <Separator className="my-8" />;
    case "code":
      return (
        <div className="mb-6 rounded-lg overflow-hidden border">
          <SyntaxHighlighter
            language={block.code.language || "text"}
            style={oneLight}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              background: "transparent",
            }}
          >
            {block.code.rich_text[0]?.plain_text || ""}
          </SyntaxHighlighter>
        </div>
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
  let page: any = await getPageBySlugValue(slug);
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

  const content: any[] = await getPageContent(pageId);
  const title = page.properties.이름?.title[0]?.plain_text || "제목 없음";
  const date = page.properties.날짜?.date?.start || "";
  const category = page.properties.카테고리?.select?.name || "";
  const groupedContent = groupBlocks(content);

  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="xl:grid xl:grid-cols-[120px_auto] xl:gap-8">
          <div className="hidden xl:block">
            <BackNavigation category={category} />
          </div>
          <div className="max-w-4xl">
            {/* Mobile Back Button */}
            <div className="xl:hidden mb-6">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="p-0 h-auto font-normal text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  모든 게시글
                </Button>
              </Link>
            </div>

            <header className="mb-12">
              {category && (
                <div className="mb-4">
                  <Link href={`/category/${encodeURIComponent(category)}`}>
                    <Badge
                      variant="outline"
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      {category}
                    </Badge>
                  </Link>
                </div>
              )}
              <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight text-gray-900">
                {title}
              </h1>
              {date && (
                <div className="flex items-center text-gray-500 mb-8">
                  <Calendar className="mr-2 h-4 w-4" />
                  <time dateTime={date}>{formatDate(date)}</time>
                </div>
              )}
              <div className="border-b border-gray-200"></div>
            </header>
            <article className="prose prose-lg max-w-none">
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
