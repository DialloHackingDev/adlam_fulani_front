import { useEffect } from 'react';

const SEOHead = ({ 
  title, 
  description, 
  keywords = [], 
  image, 
  url,
  type = 'article',
  author,
  publishedTime,
  modifiedTime
}) => {
  useEffect(() => {
    // Title
    if (title) {
      document.title = `${title} | Adlam`;
    }

    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    } else if (description) {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = description;
      document.head.appendChild(meta);
    }

    // Meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && keywords.length > 0) {
      metaKeywords.setAttribute('content', keywords.join(', '));
    } else if (keywords.length > 0) {
      const meta = document.createElement('meta');
      meta.name = 'keywords';
      meta.content = keywords.join(', ');
      document.head.appendChild(meta);
    }

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: 'Adlam' }
    ];

    if (publishedTime) {
      ogTags.push({ property: 'article:published_time', content: publishedTime });
    }
    if (modifiedTime) {
      ogTags.push({ property: 'article:modified_time', content: modifiedTime });
    }
    if (author) {
      ogTags.push({ property: 'article:author', content: author });
    }

    ogTags.forEach(({ property, content }) => {
      if (content) {
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      }
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    twitterTags.forEach(({ name, content }) => {
      if (content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (meta) {
          meta.setAttribute('content', content);
        } else {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          meta.setAttribute('content', content);
          document.head.appendChild(meta);
        }
      }
    });

  }, [title, description, keywords, image, url, type, author, publishedTime, modifiedTime]);

  return null;
};

export default SEOHead;
