/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Faherty Brand cleanup.
 * Selectors from captured DOM of https://fahertybrand.com/
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove popup/modal overlays that block content (found in captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#drawer-default-template',
      '#popover-default-template',
      'template',
      'navigation-drawer',
      '.CioSearchDrawer',
      '[class*="popup"]',
      '[class*="modal"]',
    ]);

    // Fix body overflow (Shopify sets overflow:hidden when popup is open)
    if (element.style) {
      element.style.overflow = '';
      element.style.position = '';
      element.style.inset = '';
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome (selectors from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      // Header group (use class selectors - Shopify template version numbers change)
      '.shopify-section--announcement-bar',
      '.shopify-section--header',
      'store-header',
      '.header',
      'header',
      // Footer group
      '.shopify-section-group-footer-group',
      'footer',
      // Skip-to links
      '.skip-to-content',
      '#skip-to-chat',
      // Scripts, tracking, noscript
      'script',
      'noscript',
      'link',
      'iframe',
      // Shopify injected/tracking elements (be specific to avoid removing content sections)
      '[id*="shopify-features"]',
      '[id*="web-pixels"]',
      '.shopify-section-group-overlay-group',
      '.shopify-app-block',
      '.shopify-section--mobile-vis-nav',
      // Remove style-only section wrappers (have .shopify-section class token)
      // but NOT content wrappers (only have .shopify-section--* variant classes)
      'section.shopify-section',
      'style',
    ]);
  }
}
