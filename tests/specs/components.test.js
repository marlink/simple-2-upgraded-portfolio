/**
 * Component Tests
 * 
 * Tests for UI components (tabs, modals, accordions, etc.)
 */

module.exports = {
  name: 'Component Tests',
  tests: [
    {
      name: 'should initialize tabs component',
      run: async (page, helpers) => {
        const { goto, $, expect } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForSelector('.tabs', { timeout: 5000 });
        
        const tabs = await $(page, '.tabs');
        expect(tabs).notToBeNull();
      }
    },
    {
      name: 'should switch tabs on click',
      run: async (page, helpers) => {
        const { goto, click, getAttribute, expect } = helpers;
        await goto(page, '/showcase.html');
        await page.waitForSelector('.tab', { timeout: 5000 });
        
        // Get first tab
        const firstTab = await page.$('.tab');
        if (!firstTab) {
          throw new Error('No tabs found');
        }
        
        // Get second tab if available
        const allTabs = await page.$$('.tab');
        if (allTabs.length < 2) {
          // Skip if only one tab
          return;
        }
        
        // Click second tab
        await click(page, `.tab:nth-child(2)`);
        await page.waitForTimeout(300);
        
        // Check second tab is active
        const secondTab = await page.$('.tab:nth-child(2)');
        const isActive = await page.evaluate(el => {
          return el.classList.contains('is-active') || 
                 el.getAttribute('aria-selected') === 'true';
        }, secondTab);
        
        expect(isActive).toBeTruthy();
      }
    },
    {
      name: 'should open modal on trigger click',
      run: async (page, helpers) => {
        const { goto, click, isVisible, expect } = helpers;
        await goto(page, '/showcase.html');
        
        // Find modal trigger
        const trigger = await page.$('[data-modal-target]');
        if (!trigger) {
          // Skip if no modal on page
          return;
        }
        
        const modalId = await page.evaluate(el => el.getAttribute('data-modal-target'), trigger);
        const modalSelector = modalId.replace('#', '.modal');
        
        // Check modal is initially hidden
        const initiallyVisible = await isVisible(page, modalSelector);
        expect(initiallyVisible).toBeFalsy();
        
        // Click trigger
        await click(page, '[data-modal-target]');
        await page.waitForTimeout(300);
        
        // Check modal is visible
        const afterClick = await isVisible(page, modalSelector);
        expect(afterClick).toBeTruthy();
      }
    },
    {
      name: 'should close modal on close button click',
      run: async (page, helpers) => {
        const { goto, click, isVisible, expect } = helpers;
        await goto(page, '/showcase.html');
        
        const trigger = await page.$('[data-modal-target]');
        if (!trigger) return;
        
        const modalId = await page.evaluate(el => el.getAttribute('data-modal-target'), trigger);
        const modalSelector = modalId.replace('#', '.modal');
        
        // Open modal
        await click(page, '[data-modal-target]');
        await page.waitForTimeout(300);
        
        // Close modal
        await click(page, '[data-modal-close]');
        await page.waitForTimeout(300);
        
        // Check modal is hidden
        const isHidden = await isVisible(page, modalSelector);
        expect(isHidden).toBeFalsy();
      }
    },
    {
      name: 'should toggle accordion on button click',
      run: async (page, helpers) => {
        const { goto, click, getAttribute, expect } = helpers;
        await goto(page, '/showcase.html');
        
        const accordionButton = await page.$('.accordion__button');
        if (!accordionButton) {
          // Skip if no accordion on page
          return;
        }
        
        // Get initial state
        const initialExpanded = await getAttribute(page, '.accordion__button', 'aria-expanded');
        
        // Click button
        await click(page, '.accordion__button');
        await page.waitForTimeout(300);
        
        // Check state changed
        const newExpanded = await getAttribute(page, '.accordion__button', 'aria-expanded');
        expect(newExpanded).notToBe(initialExpanded);
      }
    }
  ]
};

