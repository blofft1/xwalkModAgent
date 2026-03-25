var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-banner.js
  function parse(element, { document }) {
    const bgImg = element.querySelector(".content-over-media > picture img, .content-over-media > img, .slideshow__slide img.responsive-img, video-media + img, img.responsive-img");
    const prose = element.querySelector(".homepage-slideshow-content .prose");
    const contentCell = [];
    if (prose) {
      const heading = prose.querySelector("p.h3, p.h4, p.h5, p.h6, h1, h2, h3, h4");
      const logoIcon = prose.querySelector(".logo-icon img");
      if (heading) {
        const h2 = document.createElement("h2");
        h2.textContent = heading.textContent.trim();
        contentCell.push(h2);
      } else if (logoIcon) {
        const h2 = document.createElement("h2");
        h2.textContent = logoIcon.alt || "Hero";
        contentCell.push(h2);
      }
      const desc = prose.querySelector(".description p, .description");
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        contentCell.push(p);
      }
      const ctas = prose.querySelectorAll(".buttons-wrapper a.button, .buttons-wrapper a.btn-link");
      ctas.forEach((cta) => {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
        const p = document.createElement("p");
        p.appendChild(a);
        contentCell.push(p);
      });
    }
    const cells = [];
    if (bgImg) {
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      const pic = document.createElement("img");
      pic.src = bgImg.src;
      pic.alt = bgImg.alt || "";
      imgFrag.appendChild(pic);
      cells.push([imgFrag]);
    } else {
      cells.push([""]);
    }
    if (contentCell.length > 0) {
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      contentCell.forEach((el) => textFrag.appendChild(el));
      cells.push([textFrag]);
    } else {
      cells.push([""]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-category.js
  function parse2(element, { document }) {
    const items = element.querySelectorAll(".multi-column__item");
    const cells = [];
    items.forEach((item) => {
      const img = item.querySelector("a.multi-column__image-heading-link img, img.responsive-img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = document.createElement("img");
        pic.src = img.src;
        pic.alt = img.alt || "";
        imgFrag.appendChild(pic);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const heading = item.querySelector("a.multi-column__image-heading-link p.h4, a.multi-column__image-heading-link p.h3, .v-stack p.h4");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textFrag.appendChild(h3);
      }
      const links = item.querySelectorAll(".link-wrapper a.link, .multi-column__link-row a.link");
      links.forEach((link) => {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      });
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-category", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse3(element, { document }) {
    const panels = element.querySelectorAll(".content-over-media, .left-content, .center-content, .right-content");
    const cells = [];
    panels.forEach((panel) => {
      const img = panel.querySelector("picture img, img.responsive-img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (img) {
        const pic = document.createElement("img");
        pic.src = img.src;
        pic.alt = img.alt || "";
        imgFrag.appendChild(pic);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const eyebrow = panel.querySelector(".prose p.subheading");
      if (eyebrow) {
        const p = document.createElement("p");
        p.textContent = eyebrow.textContent.trim();
        textFrag.appendChild(p);
      }
      const heading = panel.querySelector(".prose p.h3, .prose p.h4, .prose h3, .prose h4");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textFrag.appendChild(h3);
      }
      const cta = panel.querySelector(".buttons-wrapper a.btn-link, .buttons-wrapper a.button");
      if (cta) {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-service.js
  function parse4(element, { document }) {
    const items = element.querySelectorAll(".text-with-icons__item");
    const cells = [];
    items.forEach((item) => {
      const icon = item.querySelector("img.image-icon, img.responsive-img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:image "));
      if (icon) {
        const pic = document.createElement("img");
        pic.src = icon.src;
        pic.alt = icon.alt || "";
        imgFrag.appendChild(pic);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const heading = item.querySelector(".prose p.h5, .prose p.h4, .prose h5");
      if (heading) {
        const h4 = document.createElement("h4");
        h4.textContent = heading.textContent.trim();
        textFrag.appendChild(h4);
      }
      const link = item.querySelector(".prose p a, .prose a");
      if (link) {
        const a = document.createElement("a");
        a.href = link.href;
        a.textContent = link.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(a);
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-service", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-diptych.js
  function parse5(element, { document }) {
    const leftPanel = element.querySelector(".left-content, .content-over-media:first-child");
    const rightPanel = element.querySelector(".right-content, .content-over-media:last-child");
    function extractColumn(panel) {
      if (!panel) return "";
      const frag = document.createDocumentFragment();
      const img = panel.querySelector("picture img, img.responsive-img");
      if (img) {
        const pic = document.createElement("img");
        pic.src = img.src;
        pic.alt = img.alt || "";
        frag.appendChild(pic);
      }
      const heading = panel.querySelector(".prose p.h6, .prose p.h5, .prose p.h4, .prose p.h3, .prose h2, .prose h3");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        frag.appendChild(h3);
      }
      const ctas = panel.querySelectorAll(".buttons-wrapper a.button, .buttons-wrapper a.btn-link");
      ctas.forEach((cta) => {
        const a = document.createElement("a");
        a.href = cta.href;
        a.textContent = cta.textContent.trim().replace(/\s+/g, " ");
        const p = document.createElement("p");
        p.appendChild(a);
        frag.appendChild(p);
      });
      return frag;
    }
    const col1 = extractColumn(leftPanel);
    const col2 = extractColumn(rightPanel);
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-diptych", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-product.js
  function parse6(element, { document }) {
    const productCards = element.querySelectorAll(".product-card");
    const cells = [];
    productCards.forEach((card) => {
      const img = card.querySelector(".product-card__image--primary, .product-card__figure img");
      const imgFrag = document.createDocumentFragment();
      imgFrag.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const pic = document.createElement("img");
        pic.src = img.src;
        pic.alt = img.alt || "";
        imgFrag.appendChild(pic);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:content_text "));
      const badge = card.querySelector('.badge--best-seller, [class*="badge"]');
      if (badge) {
        const em = document.createElement("em");
        em.textContent = badge.textContent.trim();
        textFrag.appendChild(em);
      }
      const titleLink = card.querySelector(".product-card__title a, .product-card__title");
      if (titleLink) {
        const h4 = document.createElement("h4");
        if (titleLink.href) {
          const a = document.createElement("a");
          a.href = titleLink.href;
          a.textContent = titleLink.textContent.trim();
          h4.appendChild(a);
        } else {
          h4.textContent = titleLink.textContent.trim();
        }
        textFrag.appendChild(h4);
      }
      const price = card.querySelector(".product-card__price .text-subdued, .price-list .text-subdued, .product-card__price");
      if (price) {
        const p = document.createElement("p");
        p.textContent = price.textContent.trim().replace(/\s+/g, " ");
        textFrag.appendChild(p);
      }
      cells.push([imgFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-product", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-social.js
  function parse7(element, { document }) {
    const tolstoy = element.querySelector('tolstoy-carousel, [class*="tolstoy"]');
    const appBlock = element.querySelector(".shopify-app-block, .shopify-block");
    const cellFrag = document.createDocumentFragment();
    const img = element.querySelector("img");
    if (img) {
      cellFrag.appendChild(document.createComment(" field:embed_placeholder "));
      const pic = document.createElement("img");
      pic.src = img.src;
      pic.alt = img.alt || "";
      cellFrag.appendChild(pic);
    }
    cellFrag.appendChild(document.createComment(" field:embed_uri "));
    const link = element.querySelector("a[href]");
    if (link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.href;
      cellFrag.appendChild(a);
    } else {
      const a = document.createElement("a");
      a.href = "https://player.gotolstoy.com/faherty";
      a.textContent = "https://player.gotolstoy.com/faherty";
      cellFrag.appendChild(a);
    }
    const cells = [[cellFrag]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/faherty-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#drawer-default-template",
        "#popover-default-template",
        "template",
        "navigation-drawer",
        ".CioSearchDrawer",
        '[class*="popup"]',
        '[class*="modal"]'
      ]);
      if (element.style) {
        element.style.overflow = "";
        element.style.position = "";
        element.style.inset = "";
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header group (use class selectors - Shopify template version numbers change)
        ".shopify-section--announcement-bar",
        ".shopify-section--header",
        "store-header",
        ".header",
        "header",
        // Footer group
        ".shopify-section-group-footer-group",
        "footer",
        // Skip-to links
        ".skip-to-content",
        "#skip-to-chat",
        // Scripts, tracking, noscript
        "script",
        "noscript",
        "link",
        "iframe",
        // Shopify injected/tracking elements (be specific to avoid removing content sections)
        '[id*="shopify-features"]',
        '[id*="web-pixels"]',
        ".shopify-section-group-overlay-group",
        ".shopify-app-block",
        ".shopify-section--mobile-vis-nav",
        // Remove style-only section wrappers (have .shopify-section class token)
        // but NOT content wrappers (only have .shopify-section--* variant classes)
        "section.shopify-section",
        "style"
      ]);
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-banner": parse,
    "cards-category": parse2,
    "cards-feature": parse3,
    "cards-service": parse4,
    "columns-diptych": parse5,
    "carousel-product": parse6,
    "embed-social": parse7
  };
  var transformers = [
    transform
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://fahertybrand.com/"
    ],
    description: "Faherty Brand homepage with hero, product collections, lifestyle imagery, and brand storytelling",
    blocks: [
      {
        name: "hero-banner",
        instances: [
          '[id*="homepage_slideshow_XTNM7e"]:not(.shopify-section)',
          '[id*="homepage_slideshow_Qwpkep"]:not(.shopify-section)',
          '[id*="homepage_slideshow_8qAWWT"]:not(.shopify-section)'
        ]
      },
      {
        name: "carousel-product",
        instances: [
          '[id*="react_slider_BNhDQE"]'
        ]
      },
      {
        name: "columns-diptych",
        instances: [
          '[id*="homepage_slideshow_cbMCQk"]:not(.shopify-section)',
          '[id*="homepage_slideshow_Rp6Gc4"]:not(.shopify-section)'
        ]
      },
      {
        name: "cards-category",
        instances: [
          '[id*="multi_column_M4b47H"]'
        ]
      },
      {
        name: "embed-social",
        instances: [
          ".shopify-section--apps"
        ]
      },
      {
        name: "cards-feature",
        instances: [
          "section:has(img[alt*='Store Locator'])"
        ]
      },
      {
        name: "cards-service",
        instances: [
          "section:has(img[alt*='Faherty Truck'])"
        ]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Slideshow",
        selector: '[id*="homepage_slideshow_XTNM7e"]:not(.shopify-section)',
        style: "dark",
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "New Arrivals Divider",
        selector: '[id*="rich_text_c87wNC"]',
        style: null,
        blocks: [],
        defaultContent: [
          '[id*="rich_text_c87wNC"] h2',
          '[id*="rich_text_c87wNC"] img'
        ]
      },
      {
        id: "section-3",
        name: "Product Slider",
        selector: '[id*="react_slider_BNhDQE"]',
        style: null,
        blocks: ["carousel-product"],
        defaultContent: []
      },
      {
        id: "section-4",
        name: "Diptych - Dresses & Reserve",
        selector: '[id*="homepage_slideshow_cbMCQk"]:not(.shopify-section)',
        style: null,
        blocks: ["columns-diptych"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Diptych - Linen & Shorts",
        selector: '[id*="homepage_slideshow_Rp6Gc4"]:not(.shopify-section)',
        style: null,
        blocks: ["columns-diptych"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Category Grid",
        selector: '[id*="multi_column_M4b47H"]',
        style: null,
        blocks: ["cards-category"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Reef Collaboration Banner",
        selector: '[id*="homepage_slideshow_Qwpkep"]:not(.shopify-section)',
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Design Studio Banner",
        selector: '[id*="homepage_slideshow_8qAWWT"]:not(.shopify-section)',
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Social Divider",
        selector: "main > div:has(> img[alt='Wave'])",
        style: null,
        blocks: [],
        defaultContent: [
          "main > div:has(> img[alt='Wave']) h2",
          "main > div:has(> img[alt='Wave']) img"
        ]
      },
      {
        id: "section-10",
        name: "Social Video Carousel",
        selector: ".shopify-section--apps",
        style: null,
        blocks: ["embed-social"],
        defaultContent: []
      },
      {
        id: "section-11",
        name: "Brand Values",
        selector: "section:has(img[alt*='Store Locator'])",
        style: "dark",
        blocks: ["cards-feature"],
        defaultContent: []
      },
      {
        id: "section-12",
        name: "Service Features Bar",
        selector: "section:has(img[alt*='Faherty Truck'])",
        style: null,
        blocks: ["cards-service"],
        defaultContent: []
      }
    ]
  };
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
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
        console.warn(`Section "${section.name}" not found with selector: ${selectors.join(", ")}`);
      }
    });
    return markers;
  }
  function applySectionBreaks(document, markers) {
    markers.forEach(({ section, marker }, index) => {
      if (index > 0) {
        const hr = document.createElement("hr");
        marker.after(hr);
      }
      if (section.style) {
        const nextMarker = index < markers.length - 1 ? markers[index + 1].marker : null;
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        if (nextMarker) {
          nextMarker.before(metaBlock);
        } else {
          marker.parentNode.appendChild(metaBlock);
        }
      }
      marker.remove();
    });
  }
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const sectionMarkers = insertSectionMarkers(document, PAGE_TEMPLATE);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      applySectionBreaks(document, sectionMarkers);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
