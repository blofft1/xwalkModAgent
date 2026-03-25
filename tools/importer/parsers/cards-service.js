/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-service. Base: cards.
 * Source: https://fahertybrand.com/ - Section 12: Service Features Bar
 * Selectors from captured DOM: .text-with-icons__item, img.image-icon, .text-with-icons__text-wrapper
 * Cards block: 2 columns, N rows. Each row: [icon | text (heading, link)]
 * xwalk model fields (per card): image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.text-with-icons__item');
  const cells = [];

  items.forEach((item) => {
    // Cell 1: Icon image with field hint
    const icon = item.querySelector('img.image-icon, img.responsive-img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (icon) {
      const pic = document.createElement('img');
      pic.src = icon.src;
      pic.alt = icon.alt || '';
      imgFrag.appendChild(pic);
    }

    // Cell 2: Text content (heading + link) with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const heading = item.querySelector('.prose p.h5, .prose p.h4, .prose h5');
    if (heading) {
      const h4 = document.createElement('h4');
      h4.textContent = heading.textContent.trim();
      textFrag.appendChild(h4);
    }

    const link = item.querySelector('.prose p a, .prose a');
    if (link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
