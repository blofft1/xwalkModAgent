/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroBannerParser from './parsers/hero-banner.js';
import cardsCategoryParser from './parsers/cards-category.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import cardsServiceParser from './parsers/cards-service.js';
import columnsDiptychParser from './parsers/columns-diptych.js';
import carouselProductParser from './parsers/carousel-product.js';
import embedSocialParser from './parsers/embed-social.js';

// TRANSFORMER IMPORTS (cleanup only - sections handled inline below)
import cleanupTransformer from './transformers/faherty-cleanup.js';

// PARSER REGISTRY
const parsers = {
  'hero-banner': heroBannerParser,
  'cards-category': cardsCategoryParser,
  'cards-feature': cardsFeatureParser,
  'cards-service': cardsServiceParser,
  'columns-diptych': columnsDiptychParser,
  'carousel-product': carouselProductParser,
  'embed-social': embedSocialParser,
};

// TRANSFORMER REGISTRY (cleanup only)
const transformers = [
  cleanupTransformer,
];

// PAGE TEMPLATE CONFIGURATION
// Uses [id*="suffix"] attribute selectors instead of exact #id selectors
// because Shopify template version numbers change between deploys
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://fahertybrand.com/',
  ],
  description: 'Faherty Brand homepage with hero, product collections, lifestyle imagery, and brand storytelling',
  blocks: [
    {
      name: 'hero-banner',
      instances: [
        'section[id*="homepage_slideshow_XTNM7e"]',
        'section[id*="homepage_slideshow_Qwpkep"]',
        'section[id*="homepage_slideshow_8qAWWT"]',
      ],
    },
    {
      name: 'carousel-product',
      instances: [
        '[id*="react_slider_BNhDQE"]',
      ],
    },
    {
      name: 'columns-diptych',
      instances: [
        'section[id*="homepage_slideshow_cbMCQk"]',
        'section[id*="homepage_slideshow_Rp6Gc4"]',
      ],
    },
    {
      name: 'cards-category',
      instances: [
        '[id*="multi_column_M4b47H"]',
      ],
    },
    {
      name: 'embed-social',
      instances: [
        '.shopify-section--apps',
      ],
    },
    {
      name: 'cards-feature',
      instances: [
        "section:has(img[alt*='Store Locator'])",
      ],
    },
    {
      name: 'cards-service',
      instances: [
        "section:has(img[alt*='Faherty Truck'])",
      ],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Slideshow',
      selector: 'section[id*="homepage_slideshow_XTNM7e"]',
      style: 'dark',
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'New Arrivals Divider',
      selector: '[id*="rich_text_c87wNC"]',
      style: null,
      blocks: [],
      defaultContent: [
        '[id*="rich_text_c87wNC"] h2',
        '[id*="rich_text_c87wNC"] img',
      ],
    },
    {
      id: 'section-3',
      name: 'Product Slider',
      selector: '[id*="react_slider_BNhDQE"]',
      style: null,
      blocks: ['carousel-product'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Diptych - Dresses & Reserve',
      selector: 'section[id*="homepage_slideshow_cbMCQk"]',
      style: null,
      blocks: ['columns-diptych'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Diptych - Linen & Shorts',
      selector: 'section[id*="homepage_slideshow_Rp6Gc4"]',
      style: null,
      blocks: ['columns-diptych'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Category Grid',
      selector: '[id*="multi_column_M4b47H"]',
      style: null,
      blocks: ['cards-category'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Reef Collaboration Banner',
      selector: 'section[id*="homepage_slideshow_Qwpkep"]',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Design Studio Banner',
      selector: 'section[id*="homepage_slideshow_8qAWWT"]',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Social Divider',
      selector: "main > div:has(> img[alt='Wave'])",
      style: null,
      blocks: [],
      defaultContent: [
        "main > div:has(> img[alt='Wave']) h2",
        "main > div:has(> img[alt='Wave']) img",
      ],
    },
    {
      id: 'section-10',
      name: 'Social Video Carousel',
      selector: '.shopify-section--apps',
      style: null,
      blocks: ['embed-social'],
      defaultContent: [],
    },
    {
      id: 'section-11',
      name: 'Brand Values',
      selector: "section:has(img[alt*='Store Locator'])",
      style: 'dark',
      blocks: ['cards-feature'],
      defaultContent: [],
    },
    {
      id: 'section-12',
      name: 'Service Features Bar',
      selector: "section:has(img[alt*='Faherty Truck'])",
      style: null,
      blocks: ['cards-service'],
      defaultContent: [],
    },
  ],
};

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

/**
 * Insert section markers (comment nodes) before each section element.
 * These markers survive element.replaceWith() during parsing, so they can
 * be used as anchor points for <hr> and section-metadata after parsing.
 */
function insertSectionMarkers(document, template) {
  const markers = [];

  template.sections.forEach((section) => {
    const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
    let sectionEl = null;
    for (const sel of selectors) {
      sectionEl = document.querySelector(sel);
      if (sectionEl) break;
    }

    if (sectionEl) {
      const marker = document.createComment(`section-marker:${section.id}`);
      sectionEl.before(marker);
      markers.push({ section, marker });
    } else {
      console.warn(`Section "${section.name}" not found with selector: ${selectors.join(', ')}`);
    }
  });

  return markers;
}

/**
 * Insert section breaks (<hr>) and Section Metadata blocks using markers.
 * Runs after parsing and cleanup when original elements may be replaced.
 */
function applySectionBreaks(document, markers) {
  markers.forEach(({ section, marker }, index) => {
    // Insert <hr> before non-first sections
    if (index > 0) {
      const hr = document.createElement('hr');
      marker.after(hr);
    }

    // Insert Section Metadata if section has a style
    if (section.style) {
      // Find the next marker to know where this section ends
      const nextMarker = index < markers.length - 1 ? markers[index + 1].marker : null;
      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });

      if (nextMarker) {
        // Insert before the next section's marker
        nextMarker.before(metaBlock);
      } else {
        // Last section - append after last content in main
        marker.parentNode.appendChild(metaBlock);
      }
    }

    // Clean up marker comment
    marker.remove();
  });
}

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Insert section markers BEFORE parsing (markers survive element replacement)
    const sectionMarkers = insertSectionMarkers(document, PAGE_TEMPLATE);

    // 3. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 4. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 5. Execute afterTransform transformers (cleanup only)
    executeTransformers('afterTransform', main, payload);

    // 6. Apply section breaks and section-metadata using markers
    applySectionBreaks(document, sectionMarkers);

    // 7. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 8. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
