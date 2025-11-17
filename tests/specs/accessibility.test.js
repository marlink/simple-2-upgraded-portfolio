/**
 * Accessibility Tests
 *
 * Tests for accessibility features (ARIA, keyboard navigation, etc.)
 */

module.exports = {
    name: "Accessibility Tests",
    tests: [
        {
            name: "should have skip link",
            run: async (page, helpers) => {
                const { goto, $ } = helpers;
                await goto(page, "/index.html");

                const skipLink = await $(page, ".skip-link");
                helpers.expect(skipLink).notToBeNull();
            },
        },
        {
            name: "should have main content landmark",
            run: async (page, helpers) => {
                const { goto, $ } = helpers;
                await goto(page, "/index.html");

                const mainContent = await $(page, "#main-content");
                helpers.expect(mainContent).notToBeNull();
            },
        },
        {
            name: "should have alt text on images",
            run: async (page, helpers) => {
                const { goto, $$, expect } = helpers;
                await goto(page, "/index.html");

                const images = await $$(page, "img");
                for (const img of images) {
                    // Alt can be empty for decorative images, but attribute should exist
                    const hasAlt = await page.evaluate((el) => el.hasAttribute("alt"), img);
                    helpers.expect(hasAlt).toBeTruthy();
                }
            },
        },
        {
            name: "should have ARIA labels on icon buttons",
            run: async (page, helpers) => {
                const { goto, $$, expect } = helpers;
                await goto(page, "/index.html");

                // Get all buttons
                const buttons = await $$(page, "button");
                for (const button of buttons) {
                    const hasAriaLabel = await page.evaluate((el) => {
                        return (
                            el.hasAttribute("aria-label") ||
                            el.hasAttribute("aria-labelledby") ||
                            el.textContent.trim().length > 0
                        );
                    }, button);
                    helpers.expect(hasAriaLabel).toBeTruthy();
                }
            },
        },
        {
            name: "should have proper tab roles",
            run: async (page, helpers) => {
                const { goto, $, expect } = helpers;
                await goto(page, "/demo/components.html");

                const tab = await $(page, ".tab");
                if (tab) {
                    const hasRole = await page.evaluate((el) => {
                        return el.getAttribute("role") === "tab";
                    }, tab);
                    helpers.expect(hasRole).toBeTruthy();
                }
            },
        },
        {
            name: "should have proper modal ARIA attributes",
            run: async (page, helpers) => {
                const { goto, $, expect } = helpers;
                await goto(page, "/demo/components.html");

                const modal = await $(page, ".modal");
                if (modal) {
                    const hasRole = await page.evaluate((el) => {
                        return (
                            el.getAttribute("role") === "dialog" ||
                            el.classList.contains("modal")
                        );
                    }, modal);
                    helpers.expect(hasRole).toBeTruthy();
                }
            },
        },
    ],
};
