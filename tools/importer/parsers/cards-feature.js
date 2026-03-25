/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-feature. Base: cards.
 * Source: https://fahertybrand.com/ - Section 11: Brand Values (triptych)
 * Selectors from captured DOM: .media-container--triptych, .left-content, .center-content, .right-content
 * Cards block: 2 columns, N rows. Each row: [image | text (eyebrow, heading, CTA)]
 * xwalk model fields (per card): image (reference), text (richtext)
 */
export default function parse(element, { document }) {
  const panels = element.querySelectorAll('.content-over-media, .left-content, .center-content, .right-content');
  const cells = [];

  panels.forEach((panel) => {
    // Cell 1: Background image with field hint
    const img = panel.querySelector('picture img, img.responsive-img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      imgFrag.appendChild(pic);
    }

    // Cell 2: Text content (eyebrow + heading + CTA) with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    const eyebrow = panel.querySelector('.prose p.subheading');
    if (eyebrow) {
      const p = document.createElement('p');
      p.textContent = eyebrow.textContent.trim();
      textFrag.appendChild(p);
    }

    const heading = panel.querySelector('.prose p.h3, .prose p.h4, .prose h3, .prose h4');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textFrag.appendChild(h3);
    }

    const cta = panel.querySelector('.buttons-wrapper a.btn-link, .buttons-wrapper a.button');
    if (cta) {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
      const p = document.createElement('p');
      p.appendChild(a);
      textFrag.appendChild(p);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
