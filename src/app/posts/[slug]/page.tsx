import {
  getPosts,
  getPageBySlug,
  getPageContent,
  getPageBySlugValue,
} from "../../../lib/notion";
import type { Metadata } from "next";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneLight,
  oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/theme-toggle";
import { CodeBlock } from "@/components/code-block";

export const revalidate = 60; // Revalidate every 60 seconds

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

  // Try to find by slug first, then fall back to ID
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

// Define the shape of the page component's props
type PageProps = {
  params: {
    slug: string;
  };
};

// Helper function for rendering rich text arrays
const renderRichText = (richText: any[]) => {
  if (!richText) return null;
  return richText.map((text, index) => {
    const { annotations, plain_text, href } = text;
    let element: React.ReactNode = plain_text;

    if (annotations.bold) {
      element = <strong>{element}</strong>;
    }
    if (annotations.italic) {
      element = <em>{element}</em>;
    }
    if (annotations.strikethrough) {
      element = <del>{element}</del>;
    }
    if (annotations.underline) {
      element = <u>{element}</u>;
    }
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

// Helper function to group consecutive list items
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
      // End current group if it exists
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

  // Don't forget the last group
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

// Enhanced renderer for Notion blocks with shadcn components
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
    case "toggle":
      return (
        <Collapsible className="mb-6">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start p-0 h-auto font-normal"
            >
              <span className="mr-2">▶</span>
              {renderRichText(block.toggle.rich_text)}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 pl-6 text-muted-foreground">
            <p className="text-sm">
              Toggle content (requires additional API call)
            </p>
          </CollapsibleContent>
        </Collapsible>
      );
    case "divider":
      return <Separator className="my-8" />;
    case "code":
      return (
        <CodeBlock language={block.code.language || "text"}>
          {block.code.rich_text[0]?.plain_text || ""}
        </CodeBlock>
      );
    case "image":
      const src =
        block.image.type === "external"
          ? block.image.external.url
          : block.image.file.url;
      const caption =
        block.image.caption.length > 0 ? block.image.caption[0].plain_text : "";
      return (
        <figure className="mb-8">
          <div className="rounded-lg overflow-hidden border">
            <img
              src={src}
              alt={caption || "Blog post image"}
              className="w-full h-auto"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-muted-foreground mt-3">
              {caption}
            </figcaption>
          )}
        </figure>
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
  const groupedContent = groupBlocks(content);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 bg-background/80 backdrop-blur-sm border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Haru.dev
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      {/* Article */}
      <article className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-6 leading-tight">
            {title}
          </h1>
          {date && (
            <div className="flex items-center text-muted-foreground mb-8">
              <Calendar className="mr-2 h-4 w-4" />
              <time dateTime={date}>{formatDate(date)}</time>
            </div>
          )}
          <Separator />
        </header>

        {/* Content */}
        <section className="prose-custom">
          {groupedContent.map((block) => (
            <div key={block.id}>{renderBlock(block)}</div>
          ))}
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t">
          <Link href="/">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              다른 글 보기
            </Button>
          </Link>
        </footer>
      </article>
    </div>
  );
}
