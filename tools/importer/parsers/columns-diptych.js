/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-diptych. Base: columns.
 * Source: https://fahertybrand.com/ - Sections 4, 5: Diptych panels
 * Selectors from captured DOM: .media-container--diptych, .left-content, .right-content
 * Columns block: N columns, 1+ rows. NO field hints (Columns exception).
 */
export default function parse(element, { document }) {
  const leftPanel = element.querySelector('.left-content, .content-over-media:first-child');
  const rightPanel = element.querySelector('.right-content, .content-over-media:last-child');

  function extractColumn(panel) {
    if (!panel) return '';
    const frag = document.createDocumentFragment();

    // Image
    const img = panel.querySelector('picture img, img.responsive-img');
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      frag.appendChild(pic);
    }

    // Heading
    const heading = panel.querySelector('.prose p.h6, .prose p.h5, .prose p.h4, .prose p.h3, .prose h2, .prose h3');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      frag.appendChild(h3);
    }

    // CTAs
    const ctas = panel.querySelectorAll('.buttons-wrapper a.button, .buttons-wrapper a.btn-link');
    ctas.forEach((cta) => {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
      const p = document.createElement('p');
      p.appendChild(a);
      frag.appendChild(p);
    });

    return frag;
  }

  const col1 = extractColumn(leftPanel);
  const col2 = extractColumn(rightPanel);

  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-diptych', cells });
  element.replaceWith(block);
}
