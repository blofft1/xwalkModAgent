/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-product. Base: carousel.
 * Source: https://fahertybrand.com/ - Section 3: Product Slider
 * Selectors from captured DOM: .product-card, .product-card__image--primary, .product-card__title, .product-card__price
 * Carousel block: 2 columns, N rows. Each row: [image | text (name, price, badge)]
 * xwalk model fields (per slide): media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 */
export default function parse(element, { document }) {
  const productCards = element.querySelectorAll('.product-card');
  const cells = [];

  productCards.forEach((card) => {
    // Cell 1: Product image with field hint
    const img = card.querySelector('.product-card__image--primary, .product-card__figure img');
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const pic = document.createElement('img');
      pic.src = img.src;
      pic.alt = img.alt || '';
      imgFrag.appendChild(pic);
    }

    // Cell 2: Product info (badge + name + price) with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:content_text '));

    // Badge (Best Seller / New)
    const badge = card.querySelector('.badge--best-seller, [class*="badge"]');
    if (badge) {
      const em = document.createElement('em');
      em.textContent = badge.textContent.trim();
      textFrag.appendChild(em);
    }

    // Product name
    const titleLink = card.querySelector('.product-card__title a, .product-card__title');
    if (titleLink) {
      const h4 = document.createElement('h4');
      if (titleLink.href) {
        const a = document.createElement('a');
        a.href = titleLink.href;
        a.textContent = titleLink.textContent.trim();
        h4.appendChild(a);
      } else {
        h4.textContent = titleLink.textContent.trim();
      }
      textFrag.appendChild(h4);
    }

    // Price
    const price = card.querySelector('.product-card__price .text-subdued, .price-list .text-subdued, .product-card__price');
    if (price) {
      const p = document.createElement('p');
      p.textContent = price.textContent.trim().replace(/\s+/g, ' ');
      textFrag.appendChild(p);
    }

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-product', cells });
  element.replaceWith(block);
}
