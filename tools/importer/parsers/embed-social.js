/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-social. Base: embed.
 * Source: https://fahertybrand.com/ - Section 10: Social Video Carousel (Tolstoy widget)
 * Selectors from captured DOM: tolstoy-carousel, .shopify-app-block
 * Embed block: 1 column, 2 rows: [name] [placeholder image + URL]
 * xwalk model fields: embed_placeholder (reference), embed_placeholderAlt (collapsed), embed_uri (text)
 * Fields share prefix embed_ so they group into one cell.
 */
export default function parse(element, { document }) {
  // The Tolstoy widget is a third-party embed with a custom element
  // Extract any available URL or use the widget's data attributes
  const tolstoy = element.querySelector('tolstoy-carousel, [class*="tolstoy"]');
  const appBlock = element.querySelector('.shopify-app-block, .shopify-block');

  const cellFrag = document.createDocumentFragment();

  // Placeholder image (if any poster/thumbnail exists)
  const img = element.querySelector('img');
  if (img) {
    cellFrag.appendChild(document.createComment(' field:embed_placeholder '));
    const pic = document.createElement('img');
    pic.src = img.src;
    pic.alt = img.alt || '';
    cellFrag.appendChild(pic);
  }

  // Embed URI - try to find any link or use a placeholder for the social widget
  cellFrag.appendChild(document.createComment(' field:embed_uri '));
  const link = element.querySelector('a[href]');
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.href;
    cellFrag.appendChild(a);
  } else {
    // Tolstoy widget has no static URL; use a descriptive placeholder
    const a = document.createElement('a');
    a.href = 'https://player.gotolstoy.com/faherty';
    a.textContent = 'https://player.gotolstoy.com/faherty';
    cellFrag.appendChild(a);
  }

  const cells = [[cellFrag]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-social', cells });
  element.replaceWith(block);
}
