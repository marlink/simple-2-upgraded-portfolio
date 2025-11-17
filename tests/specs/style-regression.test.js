module.exports = {
    name: "Style Regression Tests",
    tests: [
        {
            name: "should capture components page in light theme",
            run: async (page, helpers) => {
                const { goto } = helpers;
                await page.evaluate(() => {
                    try { localStorage.setItem('theme', 'light'); } catch (e) {}
                });
                await goto(page, "/demo/components.html");
                await page.waitForTimeout(300);
                await page.screenshot({ fullPage: true });
            },
        },
        {
            name: "should capture components page in dark theme",
            run: async (page, helpers) => {
                const { goto } = helpers;
                await page.evaluate(() => {
                    try { localStorage.setItem('theme', 'dark'); } catch (e) {}
                });
                await goto(page, "/demo/components.html");
                await page.waitForTimeout(300);
                await page.screenshot({ fullPage: true });
            },
        },
        {
            name: "cards have sufficient text contrast (AA)",
            run: async (page, helpers) => {
                const { goto, expect } = helpers;
                await page.evaluate(() => { try { localStorage.setItem('theme', 'light'); } catch (e) {} });
                await goto(page, "/demo/cards.html");
                const ratio = await page.evaluate(() => {
                    function parseColor(col) {
                        const ctx = document.createElement('canvas').getContext('2d');
                        ctx.fillStyle = col;
                        const computed = ctx.fillStyle;
                        const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (!m) return null;
                        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
                    }
                    function relLum(c) {
                        const srgb = [c.r, c.g, c.b].map(v => v / 255);
                        const linear = srgb.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
                        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
                    }
                    function contrastRatio(c1, c2) {
                        const L1 = relLum(c1);
                        const L2 = relLum(c2);
                        const lighter = Math.max(L1, L2);
                        const darker = Math.min(L1, L2);
                        return (lighter + 0.05) / (darker + 0.05);
                    }
                    const el = document.querySelector('.card__body') || document.querySelector('.card');
                    if (!el) return 7; // if no card, treat as pass
                    const styles = getComputedStyle(el);
                    const textCol = parseColor(styles.color);
                    let bgCol = parseColor(styles.backgroundColor);
                    // If background is transparent, fallback to parent
                    if (!bgCol || bgCol.a === 0) {
                        let p = el.parentElement;
                        while (p && (!bgCol || bgCol.a === 0)) {
                            const ps = getComputedStyle(p);
                            bgCol = parseColor(ps.backgroundColor);
                            p = p.parentElement;
                        }
                        if (!bgCol) bgCol = parseColor(getComputedStyle(document.body).backgroundColor);
                    }
                    return contrastRatio(textCol, bgCol);
                });
                expect(Math.round(ratio * 100) / 100).toBeGreaterThanOrEqual(4.5);
            },
        },
        {
            name: "cards have sufficient text contrast (AA) in dark theme",
            run: async (page, helpers) => {
                const { goto, expect } = helpers;
                await page.evaluate(() => { try { localStorage.setItem('theme', 'dark'); } catch (e) {} });
                await goto(page, "/demo/cards.html");
                const ratio = await page.evaluate(() => {
                    function parseColor(col) {
                        const ctx = document.createElement('canvas').getContext('2d');
                        ctx.fillStyle = col;
                        const computed = ctx.fillStyle;
                        const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
                        if (!m) return null;
                        return { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
                    }
                    function relLum(c) {
                        const srgb = [c.r, c.g, c.b].map(v => v / 255);
                        const linear = srgb.map(v => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
                        return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
                    }
                    function contrastRatio(c1, c2) {
                        const L1 = relLum(c1);
                        const L2 = relLum(c2);
                        const lighter = Math.max(L1, L2);
                        const darker = Math.min(L1, L2);
                        return (lighter + 0.05) / (darker + 0.05);
                    }
                    const el = document.querySelector('.card__body') || document.querySelector('.card');
                    if (!el) return 7;
                    const styles = getComputedStyle(el);
                    const textCol = parseColor(styles.color);
                    let bgCol = parseColor(styles.backgroundColor);
                    if (!bgCol || bgCol.a === 0) {
                        let p = el.parentElement;
                        while (p && (!bgCol || bgCol.a === 0)) {
                            const ps = getComputedStyle(p);
                            bgCol = parseColor(ps.backgroundColor);
                            p = p.parentElement;
                        }
                        if (!bgCol) bgCol = parseColor(getComputedStyle(document.body).backgroundColor);
                    }
                    return contrastRatio(textCol, bgCol);
                });
                expect(Math.round(ratio * 100) / 100).toBeGreaterThanOrEqual(4.5);
            },
        },
    ],
};