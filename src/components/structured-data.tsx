interface WebsiteData {
  name: string;
  description: string;
  url: string;
}

interface BlogData {
  name: string;
  description: string;
  url: string;
}

interface ArticleData {
  title: string;
  description: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  image?: string;
  categories?: string[];
}

type StructuredDataProps =
  | { type: "website"; data: WebsiteData }
  | { type: "blog"; data: BlogData }
  | { type: "article"; data: ArticleData };

export function StructuredData({ type, data }: StructuredDataProps) {
  let structuredData: Record<string, unknown>;

  switch (type) {
    case "website":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "friday.tech",
        description: "배움과 도전의 흔적을 남기는 개발자들의 공간",
        url: "https://blog.friday.ai.kr",
        publisher: {
          "@type": "Organization",
          name: "Friday",
          url: "https://blog.friday.ai.kr",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: "https://blog.friday.ai.kr/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      break;

    case "blog":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "friday.tech",
        description: "배움과 도전의 흔적을 남기는 개발자들의 공간",
        url: "https://blog.friday.ai.kr",
        publisher: {
          "@type": "Organization",
          name: "Friday",
        },
      };
      break;

    case "article":
      structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: data.title,
        description: data.description,
        url: data.url,
        datePublished: data.publishedTime,
        dateModified: data.modifiedTime,
        author: {
          "@type": "Organization",
          name: "Team Friday",
        },
        publisher: {
          "@type": "Organization",
          name: "Friday",
          url: "https://blog.friday.ai.kr",
        },
        ...(data.image && {
          image: {
            "@type": "ImageObject",
            url: data.image,
          },
        }),
        ...(data.categories && {
          keywords: data.categories.join(", "),
        }),
      };
      break;

    default:
      return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
