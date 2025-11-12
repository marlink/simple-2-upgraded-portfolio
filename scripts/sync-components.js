#!/usr/bin/env node

/**
 * Component Sync Script
 * 
 * Extracts component patterns from assets/js/components.js and updates:
 * - .cursorrules (component documentation section)
 * - docs/COMPONENT-LIBRARY.md (full component reference)
 * 
 * Run: npm run sync-components
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_FILE = path.join(__dirname, '../assets/js/components.js');
const CURSOR_RULES_FILE = path.join(__dirname, '../.cursorrules');
const COMPONENT_LIBRARY_FILE = path.join(__dirname, '../docs/COMPONENT-LIBRARY.md');

// Component patterns extracted from components.js
const components = {
    tabs: {
        name: 'Tabs Component',
        file: 'assets/js/components.js',
        dependencies: 'utils.js (safeQuery, safeQueryAll)',
        description: 'Multi-panel tab interface with full ARIA support and keyboard navigation.',
        html: `<div class="tabs">
    <div class="tablist" role="tablist" aria-label="Tab navigation">
        <button class="tab is-active" role="tab" aria-selected="true" aria-controls="tab-panel-1" id="tab-btn-1">Tab 1</button>
        <button class="tab" role="tab" aria-selected="false" aria-controls="tab-panel-2" id="tab-btn-2">Tab 2</button>
    </div>
    <div id="tab-panel-1" class="tab__panel is-active" role="tabpanel" aria-labelledby="tab-btn-1">Content 1</div>
    <div id="tab-panel-2" class="tab__panel" role="tabpanel" aria-labelledby="tab-btn-2">Content 2</div>
</div>`,
        features: [
            'ARIA attributes for accessibility',
            'Keyboard navigation support',
            'Smooth transitions (handled by CSS)',
            'Active state management via .is-active class'
        ],
        requiredAttributes: [
            'role="tab" on buttons',
            'role="tabpanel" on panels',
            'aria-controls on tab buttons (must match panel id)',
            'aria-labelledby on panels (must match tab button id)',
            'aria-selected on tab buttons (true/false)',
            '.is-active class on active tab and panel'
        ]
    },
    accordion: {
        name: 'Accordion Component',
        file: 'assets/js/components.js',
        dependencies: 'utils.js (safeQuery, safeQueryAll)',
        description: 'Expandable/collapsible content sections (FAQ-style). Multiple items can be open simultaneously.',
        html: `<div class="accordion">
    <div class="accordion__item">
        <button class="accordion__button" aria-expanded="false">Question</button>
        <div class="accordion__panel" hidden>Answer</div>
    </div>
</div>`,
        features: [
            'ARIA expanded state management',
            'Uses native hidden attribute for accessibility',
            'Independent item expansion (multiple can be open)',
            'Smooth expand/collapse animations (CSS)'
        ],
        requiredAttributes: [
            'aria-expanded on buttons (true/false)',
            'hidden attribute on panels when closed'
        ]
    },
    modal: {
        name: 'Modal Component',
        file: 'assets/js/components.js',
        dependencies: 'utils.js (safeQuery, safeQueryAll)',
        description: 'Overlay dialog with focus trapping, keyboard navigation, and accessibility features.',
        html: `<!-- Trigger Button -->
<button data-modal-target="#my-modal">Open Modal</button>

<!-- Modal -->
<div class="modal" id="my-modal" hidden>
    <div class="modal__overlay"></div>
    <div class="modal__dialog">
        <button data-modal-close aria-label="Close modal">Close</button>
        <h2>Modal Title</h2>
        <p>Modal content goes here</p>
    </div>
</div>`,
        features: [
            'Focus trapping (Tab key cycles within modal)',
            'Escape key closes modal',
            'Overlay click closes modal',
            'Restores focus to trigger element on close',
            'Prevents body scroll when open',
            'Keyboard navigation support'
        ],
        dataAttributes: [
            'data-modal-target="#modal-id" - Trigger button attribute',
            'data-modal-close - Close button attribute (can be multiple)'
        ],
        requiredStructure: [
            '.modal container with id and hidden attribute',
            '.modal__overlay for backdrop',
            '.modal__dialog for content container'
        ]
    },
    tooltip: {
        name: 'Tooltip Component',
        file: 'assets/js/components.js',
        dependencies: 'None (standalone)',
        description: 'Simple hover tooltips with automatic positioning.',
        html: `<button data-tooltip="Tooltip text here">Hover me</button>`,
        features: [
            'Automatically positioned above element',
            'Created dynamically on page load',
            'Simple CSS-based positioning',
            'Works with any element'
        ]
    },
    codeCopy: {
        name: 'Code Copy Button',
        file: 'assets/js/components.js',
        dependencies: 'utils.js (copyToClipboard function)',
        description: 'Adds copy-to-clipboard functionality to code blocks with visual feedback.',
        html: `<!-- Option 1: Pre/Code Block -->
<pre class="code-block">
    <code>const example = 'code here';</code>
</pre>

<!-- Option 2: Div with Code Example -->
<div class="code-example">
    const example = 'code here';
</div>`,
        features: [
            'One-click code copying',
            'Visual feedback ("Copied!" message)',
            'Handles HTML entities and formatting',
            'Works with both <pre><code> and <div class="code-example">',
            'Touch-friendly (prevents text selection on tap)'
        ],
        supportedClasses: [
            '.code-block - Standard pre/code block',
            '.code-example - Div-based code example'
        ]
    }
};

function updateCursorRules() {
    console.log('📝 Updating .cursorrules...');
    
    let cursorRules = fs.readFileSync(CURSOR_RULES_FILE, 'utf8');
    
    // Find the JavaScript Components section
    const startMarker = '## JavaScript Components (from components.js)';
    const endMarker = '## Forbidden Patterns';
    
    const startIndex = cursorRules.indexOf(startMarker);
    const endIndex = cursorRules.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
        console.error('❌ Could not find component section markers in .cursorrules');
        return false;
    }
    
    // Generate component documentation
    let componentDocs = startMarker + '\n\n';
    
    Object.values(components).forEach(component => {
        componentDocs += `### ${component.name}\n`;
        componentDocs += `\`\`\`html\n${component.html}\n\`\`\`\n`;
        componentDocs += `- Requires: \`${component.dependencies}\`\n`;
        
        if (component.requiredAttributes) {
            componentDocs += `- Required attributes: ${component.requiredAttributes.join(', ')}\n`;
        }
        if (component.dataAttributes) {
            componentDocs += `- Data attributes: ${component.dataAttributes.join(', ')}\n`;
        }
        if (component.requiredStructure) {
            componentDocs += `- Required structure: ${component.requiredStructure.join(', ')}\n`;
        }
        if (component.supportedClasses) {
            componentDocs += `- Supported classes: ${component.supportedClasses.join(', ')}\n`;
        }
        componentDocs += '\n';
    });
    
    // Replace the section
    const before = cursorRules.substring(0, startIndex);
    const after = cursorRules.substring(endIndex);
    const updated = before + componentDocs + after;
    
    fs.writeFileSync(CURSOR_RULES_FILE, updated, 'utf8');
    console.log('✅ Updated .cursorrules');
    return true;
}

function updateComponentLibrary() {
    console.log('📚 Updating COMPONENT-LIBRARY.md...');
    
    // Read the existing file to preserve CSS components section
    let library = fs.readFileSync(COMPONENT_LIBRARY_FILE, 'utf8');
    
    // Find JavaScript Components section
    const startMarker = '## JavaScript Components';
    const endMarker = '## CSS Components';
    
    const startIndex = library.indexOf(startMarker);
    const endIndex = library.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
        console.error('❌ Could not find JavaScript Components section in COMPONENT-LIBRARY.md');
        return false;
    }
    
    // Generate component documentation
    let componentDocs = startMarker + '\n\n';
    componentDocs += `**Last Updated:** ${new Date().toISOString().split('T')[0]}\n\n`;
    
    Object.values(components).forEach(component => {
        componentDocs += `### ${component.name}\n\n`;
        componentDocs += `**File:** \`${component.file}\`  \n`;
        componentDocs += `**Dependencies:** ${component.dependencies}\n\n`;
        componentDocs += `${component.description}\n\n`;
        componentDocs += `#### HTML Structure\n\n`;
        componentDocs += `\`\`\`html\n${component.html}\n\`\`\`\n\n`;
        
        if (component.features && component.features.length > 0) {
            componentDocs += `#### Features\n\n`;
            component.features.forEach(feature => {
                componentDocs += `- ✅ ${feature}\n`;
            });
            componentDocs += '\n';
        }
        
        if (component.requiredAttributes && component.requiredAttributes.length > 0) {
            componentDocs += `#### Required Attributes\n\n`;
            component.requiredAttributes.forEach(attr => {
                componentDocs += `- ${attr}\n`;
            });
            componentDocs += '\n';
        }
        
        if (component.dataAttributes && component.dataAttributes.length > 0) {
            componentDocs += `#### Data Attributes\n\n`;
            component.dataAttributes.forEach(attr => {
                componentDocs += `- \`${attr}\`\n`;
            });
            componentDocs += '\n';
        }
        
        if (component.requiredStructure && component.requiredStructure.length > 0) {
            componentDocs += `#### Required Structure\n\n`;
            component.requiredStructure.forEach(struct => {
                componentDocs += `- ${struct}\n`;
            });
            componentDocs += '\n';
        }
        
        if (component.supportedClasses && component.supportedClasses.length > 0) {
            componentDocs += `#### Supported Classes\n\n`;
            component.supportedClasses.forEach(cls => {
                componentDocs += `- \`${cls}\`\n`;
            });
            componentDocs += '\n';
        }
        
        componentDocs += '---\n\n';
    });
    
    // Replace the section
    const before = library.substring(0, startIndex);
    const after = library.substring(endIndex);
    const updated = before + componentDocs + after;
    
    // Update last synced timestamp
    const timestampRegex = /\*\*Last Synced:\*\* .*/;
    const newTimestamp = `**Last Synced:** ${new Date().toLocaleString()}`;
    const finalUpdated = updated.replace(timestampRegex, newTimestamp);
    
    fs.writeFileSync(COMPONENT_LIBRARY_FILE, finalUpdated, 'utf8');
    console.log('✅ Updated COMPONENT-LIBRARY.md');
    return true;
}

function main() {
    console.log('🔄 Syncing components from components.js...\n');
    
    // Check if components.js exists
    if (!fs.existsSync(COMPONENTS_FILE)) {
        console.error(`❌ Components file not found: ${COMPONENTS_FILE}`);
        process.exit(1);
    }
    
    // Update files
    const rulesUpdated = updateCursorRules();
    const libraryUpdated = updateComponentLibrary();
    
    if (rulesUpdated && libraryUpdated) {
        console.log('\n✅ Component sync completed successfully!');
        console.log('📝 Updated: .cursorrules');
        console.log('📚 Updated: docs/COMPONENT-LIBRARY.md');
    } else {
        console.error('\n❌ Component sync completed with errors');
        process.exit(1);
    }
}

main();

