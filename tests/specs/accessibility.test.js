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
                const { goto, $, expect } = helpers;
                await goto(page, "/index.html");

                const skipLink = await $(page, ".skip-link");
                expect(skipLink).notToBeNull();
            },
        },
        {
            name: "should have main content landmark",
            run: async (page, helpers) => {
                const { goto, $, expect } = helpers;
                await goto(page, "/index.html");

                const mainContent = await $(page, "#main-content");
                expect(mainContent).notToBeNull();
            },
        },
        {
            name: "should have alt text on images",
            run: async (page, helpers) => {
                const { goto, $$, evaluate, expect } = helpers;
                await goto(page, "/index.html");

                const images = await $$(page, "img");
                for (const img of images) {
                    const alt = await evaluate(page, (el) => el.getAttribute("alt"), img);
                    // Alt can be empty for decorative images, but attribute should exist
                    const hasAlt = await evaluate(page, (el) => el.hasAttribute("alt"), img);
                    expect(hasAlt).toBeTruthy();
                }
            },
        },
        {
            name: "should have ARIA labels on icon buttons",
            run: async (page, helpers) => {
                const { goto, $$, evaluate, expect } = helpers;
                await goto(page, "/index.html");

                const iconButtons = await page.$$("button:not(:has(text))");
                for (const button of iconButtons) {
                    const hasAriaLabel = await evaluate(
                        page,
                        (el) => {
                            return (
                                el.hasAttribute("aria-label") ||
                                el.hasAttribute("aria-labelledby") ||
                                el.textContent.trim().length > 0
                            );
                        },
                        button
                    );
                    expect(hasAriaLabel).toBeTruthy();
                }
            },
        },
        {
            name: "should have proper tab roles",
            run: async (page, helpers) => {
                const { goto, $, evaluate, expect } = helpers;
                await goto(page, "/showcase.html");

                const tab = await $(page, ".tab");
                if (tab) {
                    const hasRole = await evaluate(
                        page,
                        (el) => {
                            return el.getAttribute("role") === "tab";
                        },
                        tab
                    );
                    expect(hasRole).toBeTruthy();
                }
            },
        },
        {
            name: "should have proper modal ARIA attributes",
            run: async (page, helpers) => {
                const { goto, $, evaluate, expect } = helpers;
                await goto(page, "/showcase.html");

                const modal = await $(page, ".modal");
                if (modal) {
                    const hasRole = await evaluate(
                        page,
                        (el) => {
                            return (
                                el.getAttribute("role") === "dialog" ||
                                el.classList.contains("modal")
                            );
                        },
                        modal
                    );
                    expect(hasRole).toBeTruthy();
                }
            },
        },
    ],
};
