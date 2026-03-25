/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-category. Base: cards.
 * Source: https://fahertybrand.com/ - Section 6: Category Grid
 * Selectors from captured DOM: .multi-column__item, .multi-column__image-heading-link, .link-wrapper
 * Cards block: 2 columns, N rows. Each row: [image | text (heading, links)]
 * xwalk model fields (per card): image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.multi-column__item');
  const cells = [];

  items.forEach((item) => {
    // Cell 1: Category image with field hint
    const img = item.querySelector('a.multi-column__image-heading-link img, img.responsive-img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      imgFrag.appendChild(pic);
    }

    // Cell 2: Text content (heading + links) with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const heading = item.querySelector('a.multi-column__image-heading-link p.h4, a.multi-column__image-heading-link p.h3, .v-stack p.h4');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textFrag.appendChild(h3);
    }

    // Gender links (Men's / Women's)
    const links = item.querySelectorAll('.link-wrapper a.link, .multi-column__link-row a.link');
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(a);
      textFrag.appendChild(p);
    });

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-category', cells });
  element.replaceWith(block);
}
