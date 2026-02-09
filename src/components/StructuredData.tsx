interface JsonLdProps {
  type: string;
  data: Record<string, any>;
}

export function JsonLd({ type, data }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * BlogPost schema for article pages
 */
export function BlogPostSchema({
  title,
  description,
  datePublished,
  dateModified,
  url,
  imageUrl,
  authorName,
}: {
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  url: string;
  imageUrl?: string;
  authorName?: string;
}) {
  return (
    <JsonLd
      type="BlogPosting"
      data={{
        headline: title,
        description,
        datePublished,
        dateModified,
        url,
        image: imageUrl,
        author: {
          '@type': 'Person',
          name: authorName || 'depp',
        },
        publisher: {
          '@type': 'Organization',
          name: 'the-house-of-the-depp',
          logo: {
            '@type': 'ImageObject',
            url: 'https://the-house-of-the-depp.vercel.app/icon.png',
          },
        },
      }}
    />
  );
}

/**
 * WebSite schema for homepage
 */
export function WebSiteSchema() {
  const baseUrl = 'https://the-house-of-the-depp.vercel.app';

  return (
    <JsonLd
      type="WebSite"
      data={{
        url: baseUrl,
        name: 'the-house-of-the-depp',
        description: 'Agentic Engineer의 기술 블로그 & 포트폴리오',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

/**
 * Person schema for About page
 */
export function PersonSchema() {
  return (
    <JsonLd
      type="Person"
      data={{
        name: 'depp',
        description: 'Agentic Engineer',
        jobTitle: 'Software Engineer',
        url: 'https://the-house-of-the-depp.vercel.app',
        sameAs: [
          'https://github.com/lightwater2',
          // Add more social links if needed
        ],
      }}
    />
  );
}

/**
 * BreadcrumbList schema for navigation
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      type="BreadcrumbList"
      data={{
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  );
}
