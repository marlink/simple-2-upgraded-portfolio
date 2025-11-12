/**
 * Theme Switching Tests
 *
 * Tests for light/dark theme functionality
 */

module.exports = {
    name: "Theme Tests",
    tests: [
        {
            name: "should have theme toggle button",
            run: async (page, helpers) => {
                const { goto, $ } = helpers;
                await goto(page, "/index.html");
                await page.waitForSelector("body", { timeout: 5000 });

                const themeToggle = await $(page, ".theme-toggle");
                helpers.expect(themeToggle).notToBeNull();
            },
        },
        {
            name: "should toggle theme on button click",
            run: async (page, helpers) => {
                const { goto, click, evaluate } = helpers;
                await goto(page, "/index.html");
                await page.waitForSelector("body", { timeout: 5000 });

                const initialTheme = await evaluate(page, () => {
                    return document.body.getAttribute("data-theme") || "light";
                });

                await click(page, ".theme-toggle");
                await page.waitForTimeout(300);

                const newTheme = await evaluate(page, () => {
                    return document.body.getAttribute("data-theme") || "light";
                });

                helpers.expect(newTheme).notToBe(initialTheme);
            },
        },
        {
            name: "should persist theme in localStorage",
            run: async (page, helpers) => {
                const { goto, click, evaluate } = helpers;
                await goto(page, "/index.html");
                await page.waitForSelector("body", { timeout: 5000 });

                await click(page, ".theme-toggle");
                await page.waitForTimeout(300);

                const storedTheme = await evaluate(page, () => {
                    return localStorage.getItem("theme");
                });

                helpers.expect(storedTheme).notToBeNull();
            },
        },
        {
            name: "should apply theme on page load",
            run: async (page, helpers) => {
                const { goto, evaluate } = helpers;
                await goto(page, "/index.html");
                await page.waitForSelector("body", { timeout: 5000 });

                // Set theme to dark
                await evaluate(page, () => {
                    localStorage.setItem("theme", "dark");
                });

                // Reload page
                await page.reload({ waitUntil: "networkidle0" });

                // Check theme is applied
                const theme = await evaluate(page, () => {
                    return document.body.getAttribute("data-theme");
                });

                helpers.expect(theme).toBe("dark");
            },
        },
    ],
};
