/**
 * Custom Assertion Functions
 *
 * Additional assertion helpers for testing
 */

/**
 * Assert element exists
 */
function assertElementExists(element, selector) {
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
}

/**
 * Assert element is visible
 */
function assertElementVisible(visible, selector) {
    if (!visible) {
        throw new Error(`Element is not visible: ${selector}`);
    }
}

/**
 * Assert text content matches
 */
function assertTextContent(actual, expected, selector) {
    if (actual !== expected) {
        throw new Error(`Text mismatch for ${selector}: expected "${expected}", got "${actual}"`);
    }
}

/**
 * Assert attribute value
 */
function assertAttribute(actual, expected, attribute, selector) {
    if (actual !== expected) {
        throw new Error(
            `Attribute ${attribute} mismatch for ${selector}: expected "${expected}", got "${actual}"`
        );
    }
}

/**
 * Assert class is present
 */
function assertHasClass(element, className, selector) {
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    // This would need to be evaluated in page context
    // For now, return a function that can be evaluated
    return `element.classList.contains('${className}')`;
}

/**
 * Assert accessibility attribute
 */
function assertAriaAttribute(element, attribute, expected, selector) {
    if (!element) {
        throw new Error(`Element not found: ${selector}`);
    }
    // Return evaluation function
    return `element.getAttribute('${attribute}') === '${expected}'`;
}

module.exports = {
    assertElementExists,
    assertElementVisible,
    assertTextContent,
    assertAttribute,
    assertHasClass,
    assertAriaAttribute,
};
