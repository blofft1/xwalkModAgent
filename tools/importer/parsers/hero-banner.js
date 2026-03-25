/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner. Base: hero.
 * Source: https://fahertybrand.com/
 * Selectors from captured DOM: .slideshow__slide, .content-over-media, .prose, .buttons-wrapper
 * Hero block: 1 column, 3 rows: [name] [image] [text]
 * xwalk model fields: image (reference), imageAlt (collapsed), text (richtext)
 */
export default function parse(element, { document }) {
  // Extract background video (if present)
  const bgVideo = element.querySelector('video-media video, video');
  const videoSrc = bgVideo ? (bgVideo.src || bgVideo.querySelector('source')?.src) : null;

  // Extract background image (poster image or first prominent img)
  const bgImg = bgVideo?.poster
    ? { src: bgVideo.poster, alt: bgVideo.alt || '' }
    : element.querySelector('.content-over-media > picture img, .content-over-media > img, .slideshow__slide img.responsive-img, video-media + img, img.responsive-img');

  // Extract text content from the overlay
  const prose = element.querySelector('.homepage-slideshow-content .prose');
  const contentCell = [];

  if (prose) {
    // Heading (could be h1-h6 or p.h3, p.h4, p.h6, or .logo-icon img)
    const heading = prose.querySelector('p.h3, p.h4, p.h5, p.h6, h1, h2, h3, h4');
    const logoIcon = prose.querySelector('.logo-icon img');

    if (heading) {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent.trim();
      contentCell.push(h2);
    } else if (logoIcon) {
      const h2 = document.createElement('h2');
      h2.textContent = logoIcon.alt || 'Hero';
      contentCell.push(h2);
    }

    // Description paragraph
    const desc = prose.querySelector('.description p, .description');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      contentCell.push(p);
    }

    // CTA buttons
    const ctas = prose.querySelectorAll('.buttons-wrapper a.button, .buttons-wrapper a.btn-link');
    ctas.forEach((cta) => {
      const a = document.createElement('a');
      a.href = cta.href;
      a.textContent = cta.textContent.trim().replace(/\s+/g, ' ');
      const p = document.createElement('p');
      p.appendChild(a);
      contentCell.push(p);
    });
  }

  // Build cells: row 1 = image, row 2 = text content
  const cells = [];

  // Row 1: Background image (+ video link if present) with field hint
  if (bgImg || videoSrc) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (bgImg) {
      const pic = document.createElement('img');
      pic.src = bgImg.src;
      pic.alt = bgImg.alt || '';
      imgFrag.appendChild(pic);
    }
    // Include video source as a link so the block JS can detect and render it
    if (videoSrc) {
      const videoLink = document.createElement('a');
      videoLink.href = videoSrc;
      videoLink.textContent = videoSrc;
      imgFrag.appendChild(videoLink);
    }
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: Text content with field hint
  if (contentCell.length > 0) {
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    contentCell.forEach((el) => textFrag.appendChild(el));
    cells.push([textFrag]);
  } else {
    cells.push(['']);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
