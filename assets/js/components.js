/**
 * ============================================================================
 * COMPONENTS.JS - Reusable UI Components
 * ============================================================================
 *
 * Lightweight, framework-free component library using plain DOM API
 * All components use data attributes for configuration (no JavaScript config needed)
 *
 * Dependencies:
 * - utils.js (must be loaded before this file for safeQuery/safeQueryAll)
 *
 * Components included:
 * - Tabs: Multi-panel tab interface with ARIA support
 * - Accordion: Expandable/collapsible content sections
 * - Modal: Overlay dialogs with focus trapping and keyboard navigation
 * - Tooltip: Hover tooltips with automatic positioning
 * - Code Copy Button: One-click code copying with visual feedback
 *
 * Performance:
 * - No external dependencies
 * - Minimal DOM queries (cached where possible)
 * - Event delegation where appropriate
 * - Accessible (ARIA attributes, keyboard navigation)
 *
* @author Design System
 * @version 1.0.0
 * ============================================================================
 */

// Utility functions are available globally from utils.js
// $q and $qa are shorthand aliases for safeQuery and safeQueryAll

// Initialize components immediately for better performance
(() => {
    // Use setTimeout to ensure DOM is fully ready
    setTimeout(() => {
        try {
        /* ========================================================================
         * TABS COMPONENT
         * ========================================================================
         * Multi-panel tab interface with enhanced accessibility and error handling
         *
         * HTML Structure:
         * <div class="tabs">
         *   <div class="tablist" role="tablist" aria-label="Tab navigation">
         *     <button class="tab" role="tab" aria-controls="panel-1" aria-selected="true" id="tab-btn-1">Tab 1</button>
         *     <button class="tab" role="tab" aria-controls="panel-2" aria-selected="false" id="tab-btn-2">Tab 2</button>
         *   </div>
         *   <div id="panel-1" class="tab__panel is-active" role="tabpanel" aria-labelledby="tab-btn-1">Content 1</div>
         *   <div id="panel-2" class="tab__panel" role="tabpanel" aria-labelledby="tab-btn-2">Content 2</div>
         * </div>
         *
         * Features:
         * - ARIA attributes for accessibility
         * - Keyboard navigation support (arrow keys, home, end)
         * - Smooth transitions (handled by CSS)
         * - Automatic activation on focus for screen readers
         */
            const tabContainers = safeQueryAll('.tabs')
            if (!tabContainers || tabContainers.length === 0) {
            // No tabs on this page
                return
            }

            tabContainers.forEach(container => {
                if (!container) return

                const tabs = safeQueryAll('.tab', container)
                const panels = safeQueryAll('.tab__panel', container)

                if (!tabs || tabs.length === 0 || !panels || panels.length === 0) {
                // Silently skip containers without required elements (common for partial implementations)
                    return
                }

                // Create tab-to-panel mapping for efficient lookups
                const tabPanelMap = new Map()
                tabs.forEach(tab => {
                    const panelId = tab.getAttribute('aria-controls')
                    if (panelId) {
                        const panel = safeQuery('#' + panelId, container)
                        panel && tabPanelMap.set(tab, panel)
                    }
                })

                /**
             * Activate a specific tab
             * Optimized to only update elements that need changing
             */
                const activateTab = (activeTab) => {
                    if (!tabPanelMap.has(activeTab)) return

                    const activePanel = tabPanelMap.get(activeTab)
                    if (!activePanel) return

                    // Find currently active tab and panel for efficient updates
                    const currentActiveTab = tabs.find(tab => tab.classList.contains('is-active'))
                    const currentActivePanel = panels.find(panel => panel.classList.contains('is-active'))

                    // Only update if different from current active
                    if (currentActiveTab === activeTab) return

                    // Deactivate current active elements
                    if (currentActiveTab) {
                        currentActiveTab.classList.remove('is-active')
                        currentActiveTab.setAttribute('aria-selected', 'false')
                    }
                    if (currentActivePanel) {
                        currentActivePanel.classList.remove('is-active')
                        currentActivePanel.setAttribute('hidden', '')
                    }

                    // Activate selected tab and panel
                    activeTab.classList.add('is-active')
                    activeTab.setAttribute('aria-selected', 'true')
                    activePanel.classList.add('is-active')
                    activePanel.removeAttribute('hidden')
                }

                /**
             * Handle keyboard navigation for accessibility
             * Supports Arrow Left/Right, Home, and End keys
             * @param {KeyboardEvent} e - Keyboard event
             */
                const tabArray = Array.from(tabs)
                const handleKeydown = (e) => {
                    const currentTab = e.target.closest('.tab')
                    if (!currentTab || !tabPanelMap.has(currentTab)) return

                    const currentIndex = tabArray.indexOf(currentTab)
                    let newIndex = currentIndex

                    switch (e.key) {
                        case 'ArrowLeft':
                            newIndex = currentIndex > 0 ? currentIndex - 1 : tabArray.length - 1
                            break
                        case 'ArrowRight':
                            newIndex = currentIndex < tabArray.length - 1 ? currentIndex + 1 : 0
                            break
                        case 'Home':
                            newIndex = 0
                            break
                        case 'End':
                            newIndex = tabArray.length - 1
                            break
                        default:
                            return // Don't prevent default for other keys
                    }

                    e.preventDefault()
                    const newTab = tabArray[newIndex]
                    if (newTab) {
                        newTab.focus()
                        activateTab(newTab)
                    }
                }

                // Set up event listeners
                tabs.forEach(tab => {
                // Click handler
                    tab.addEventListener('click', (e) => {
                        e.preventDefault()
                        activateTab(tab)
                    })

                    // Keyboard navigation
                    tab.addEventListener('keydown', handleKeydown)

                // Optional: Activate on focus for screen readers
                // Uncomment if you want automatic activation on focus
                // tab.addEventListener('focus', () => activateTab(tab))
                })

                // Initialize with first active tab or first tab
                const initialActiveTab = tabs.find(tab => tab.classList.contains('is-active')) || tabs[0]
                if (initialActiveTab) {
                    activateTab(initialActiveTab)
                }
            })
        } catch (error) {
            console.error('Error initializing tabs component:', error)
        }

        /* ========================================================================
     * ACCORDION COMPONENT
     * ========================================================================
     * Expandable/collapsible content sections (FAQ-style)
     *
     * HTML Structure:
     * <div class="accordion">
     *   <div class="accordion__item">
     *     <button class="accordion__button" aria-expanded="false">Question</button>
     *     <div class="accordion__panel" hidden>Answer</div>
     *   </div>
     * </div>
     *
     * Features:
     * - ARIA expanded state management
     * - Uses native `hidden` attribute for accessibility
     * - Independent item expansion (multiple can be open)
     */

        try {
            const accordions = safeQueryAll('.accordion')

            if (!accordions || accordions.length === 0) {
                return
            }

            accordions.forEach((accordion) => {
                if (!accordion) return

                const items = safeQueryAll('.accordion__item', accordion)

                if (!items || items.length === 0) {
                    return
                }

                items.forEach((item, index) => {
                    const button = safeQuery('.accordion__button', item)
                    const panel = safeQuery('.accordion__panel', item)

                    if (!button || !panel) {
                    // Skip items without required elements
                        return
                    }

                    // Generate unique IDs if not present
                    const buttonId = button.id || `accordion-btn-${index}`
                    const panelId = panel.id || `accordion-panel-${index}`

                    button.id = buttonId
                    panel.id = panelId

                    // Set up ARIA attributes
                    button.setAttribute('aria-controls', panelId)
                    button.setAttribute('aria-expanded', button.getAttribute('aria-expanded') || 'false')
                    panel.setAttribute('aria-labelledby', buttonId)
                    panel.setAttribute('role', 'region')

                    // Ensure initial state is correct
                    const isExpanded = button.getAttribute('aria-expanded') === 'true'
                    panel.hidden = !isExpanded

                    // Handle click events
                    button.addEventListener('click', (e) => {
                        e.preventDefault()

                        const currentlyExpanded = button.getAttribute('aria-expanded') === 'true'
                        const shouldExpand = !currentlyExpanded

                        // Update button state
                        button.setAttribute('aria-expanded', String(shouldExpand))

                        // Update panel visibility
                        panel.hidden = !shouldExpand

                        // Optional: Scroll to expanded panel for better UX
                        if (shouldExpand && window.getComputedStyle(panel).display !== 'none') {
                            setTimeout(() => {
                                panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                            }, 100)
                        }
                    })

                    // Optional: Support for Enter and Space keys
                    button.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            button.click()
                        }
                    })
                })
            })
        } catch (error) {
            console.error('Error initializing accordion component:', error)
        }

        try {
        /* ========================================================================
         * MODAL COMPONENT
         * ========================================================================
     * Overlay dialog with focus trapping and keyboard navigation
     *
     * HTML Structure:
     * <div class="modal" id="my-modal" hidden>
     *   <div class="modal__overlay"></div>
     *   <div class="modal__dialog">
     *     <button data-modal-close>Close</button>
     *     <h2>Modal Title</h2>
     *     <p>Modal content</p>
     *   </div>
     * </div>
     *
     * Trigger:
     * <button data-modal-target="#my-modal">Open Modal</button>
     *
     * Features:
     * - Focus trapping (Tab key cycles within modal)
     * - Escape key closes modal
     * - Overlay click closes modal
     * - Restores focus to trigger element on close
     * - Prevents body scroll when open
     */
            const openTriggers = safeQueryAll('[data-modal-target]')
            const modals = safeQueryAll('.modal')

            if (!modals || modals.length === 0) return

            // Initialize modals
            modals.forEach(modal => {
                if (!modal) return

                const overlay = safeQuery('.modal__overlay', modal)
                const dialog = safeQuery('.modal__dialog', modal)
                const closeButtons = safeQueryAll('[data-modal-close]', modal)

                if (!overlay || !dialog) {
                // Skip modals without required elements
                    return
                }

                let lastFocused = null
                let isOpen = false
                let focusableElements = []

                /**
             * Get all focusable elements within the modal dialog
             * @returns {Array<Element>} Array of focusable elements
             */
                const getFocusableElements = () => {
                    return focusableElements
                }

                /**
             * Update the cache of focusable elements for better performance
             */
                const updateFocusableElements = () => {
                    focusableElements = safeQueryAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', dialog)
                }

                /**
             * Open the modal with proper accessibility and focus management
             */
                const openModal = () => {
                    if (isOpen) return

                    isOpen = true
                    lastFocused = document.activeElement

                    // Update focusable elements cache
                    updateFocusableElements()

                    // Show modal
                    modal.removeAttribute('hidden')
                    modal.setAttribute('aria-hidden', 'false')

                    // Prevent body scroll
                    document.body.style.overflow = 'hidden'

                    // Focus management
                    if (focusableElements.length > 0) {
                        requestAnimationFrame(() => focusableElements[0].focus())
                    }

                    // Announce modal to screen readers
                    const heading = safeQuery('h1, h2, h3, h4, h5, h6', dialog)
                    if (heading) {
                        modal.setAttribute('aria-labelledby', heading.id || `modal-heading-${Date.now()}`)
                        if (!heading.id) heading.id = modal.getAttribute('aria-labelledby')
                    }
                }

                /**
             * Close the modal and restore focus to the trigger element
             */
                const closeModal = () => {
                    if (!isOpen) return

                    isOpen = false

                    // Hide modal
                    modal.setAttribute('hidden', '')
                    modal.setAttribute('aria-hidden', 'true')

                    // Restore body scroll
                    document.body.style.overflow = ''

                    // Restore focus
                    if (lastFocused && typeof lastFocused.focus === 'function') {
                        lastFocused.focus()
                    }
                }

                /**
             * Enhanced focus trapping with proper tab order
             */
                const handleKeydown = (e) => {
                    if (!isOpen) return

                    if (e.key === 'Escape') {
                        e.preventDefault()
                        closeModal()
                        return
                    }

                    if (e.key === 'Tab') {
                        const focusable = getFocusableElements()
                        if (focusable.length === 0) return

                        const first = focusable[0]
                        const last = focusable[focusable.length - 1]
                        const active = document.activeElement

                        if (e.shiftKey) {
                        // Shift+Tab: move to previous element
                            if (active === first) {
                                e.preventDefault()
                                last.focus()
                            }
                        } else {
                        // Tab: move to next element
                            if (active === last) {
                                e.preventDefault()
                                first.focus()
                            }
                        }
                    }
                }

                // Set up event handlers
                const keydownHandler = handleKeydown
                modal._keydownHandler = keydownHandler

                // Add event listeners only once
                if (!modal._initialized) {
                    modal._initialized = true

                    // Overlay click to close
                    overlay.addEventListener('click', closeModal)

                    // Close buttons
                    closeButtons.forEach(btn => {
                        btn.addEventListener('click', closeModal)
                    })

                    // Global keydown listener (added/removed dynamically)
                    modal._setupKeydown = () => {
                        document.addEventListener('keydown', keydownHandler)
                    }

                    modal._cleanupKeydown = () => {
                        document.removeEventListener('keydown', keydownHandler)
                    }
                }

                // Store functions on modal element
                modal._openModal = openModal
                modal._closeModal = closeModal
            })

            // Set up open triggers
            openTriggers.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    const targetSel = btn.getAttribute('data-modal-target')
                    const modal = safeQuery(targetSel)
                    if (modal && modal._openModal) {
                        modal._openModal()
                        // Set up keydown listener when opening
                        if (modal._setupKeydown) modal._setupKeydown()
                    }
                })
            })

            // Handle modal opening/closing with proper cleanup
            modals.forEach(modal => {
                if (modal._openModal) {
                    const originalOpen = modal._openModal
                    modal._openModal = () => {
                        originalOpen()
                        if (modal._setupKeydown) modal._setupKeydown()
                    }
                }

                if (modal._closeModal) {
                    const originalClose = modal._closeModal
                    modal._closeModal = () => {
                        if (modal._cleanupKeydown) modal._cleanupKeydown()
                        originalClose()
                    }
                }
            })

            /* ========================================================================
     * TOOLTIP COMPONENT
     * ========================================================================
     * Simple hover tooltips
     *
     * HTML Structure:
     * <button data-tooltip="Tooltip text">Hover me</button>
     *
     * Features:
     * - Automatically positioned above element
     * - Created dynamically on page load
     * - Simple CSS-based positioning
     */
            const tooltipTriggers = safeQueryAll('[data-tooltip]')
            if (!tooltipTriggers || tooltipTriggers.length === 0) return

            tooltipTriggers.forEach((trigger, index) => {
                const tooltipText = trigger.getAttribute('data-tooltip')
                if (!tooltipText) return

                // Create tooltip element
                const tip = document.createElement('span')
                tip.className = 'tooltip'
                tip.textContent = tooltipText
                tip.setAttribute('role', 'tooltip')
                tip.id = `tooltip-${index}-${Date.now()}`

                // Set up ARIA attributes
                trigger.setAttribute('aria-describedby', tip.id)
                trigger.setAttribute('tabindex', '0') // Make focusable if not already

                // Enhanced positioning with collision detection
                const positionTooltip = () => {
                    if (!tip.isConnected) return

                    // Reset positioning
                    tip.style.left = '50%'
                    tip.style.top = ''
                    tip.style.bottom = ''
                    tip.style.transform = 'translate(-50%, -6px)'

                    // Get positions
                    const tipRect = tip.getBoundingClientRect()
                    const viewportWidth = window.innerWidth

                    // Check if tooltip goes off-screen horizontally
                    if (tipRect.left < 0) {
                        tip.style.left = '0'
                        tip.style.transform = 'translateX(0)'
                    } else if (tipRect.right > viewportWidth) {
                        tip.style.left = '100%'
                        tip.style.transform = 'translateX(-100%)'
                    }

                    // Check if tooltip goes off-screen vertically (prefer bottom, fallback to top)
                    if (tipRect.top < 0) {
                    // Move to bottom
                        tip.style.top = '100%'
                        tip.style.bottom = ''
                        tip.style.transform = tip.style.transform.replace('-6px', '6px')
                    }
                }

                // Event handlers
                const showTooltip = () => {
                    tip.classList.add('tooltip--visible')
                    positionTooltip()
                }

                const hideTooltip = () => {
                    tip.classList.remove('tooltip--visible')
                }

                // Mouse events
                trigger.addEventListener('mouseenter', showTooltip)
                trigger.addEventListener('mouseleave', hideTooltip)

                // Focus events for keyboard accessibility
                trigger.addEventListener('focus', showTooltip)
                trigger.addEventListener('blur', hideTooltip)

                // Reposition on window resize (only when tooltip is visible)
                let resizeTimeout = null
                const handleResize = () => {
                    if (tip.classList.contains('tooltip--visible')) {
                        clearTimeout(resizeTimeout)
                        resizeTimeout = setTimeout(positionTooltip, 100)
                    }
                }
                window.addEventListener('resize', handleResize, { passive: true })

                // Append tooltip to trigger element
                trigger.appendChild(tip)

                // Position tooltip once initially (will be repositioned when shown)
                requestAnimationFrame(() => {
                    if (tip.isConnected) positionTooltip()
                })
            })

            /* ========================================================================
     * CODE COPY BUTTON COMPONENT
     * ========================================================================
     * Adds copy-to-clipboard functionality to code blocks
     *
     * HTML Structure:
     * <pre class="code-block">
     *   <code>code content</code>
     * </pre>
     * OR
     * <div class="code-example">code content</div>
     *
     * Features:
     * - One-click code copying
     * - Visual feedback ("Copied!" message)
     * - Handles HTML entities and formatting
     * - Works with both <pre><code> and <div class="code-example">
     * - Touch-friendly (prevents text selection on tap)
     */

            /**
         * Decode HTML entities in a string
         * @param {string} html - HTML string with entities
         * @returns {string} - Decoded string
         */
            const decodeHtmlEntities = (html) => {
            // Use a single, reusable textarea for better performance
                if (!decodeHtmlEntities.textarea) {
                    decodeHtmlEntities.textarea = document.createElement('textarea')
                }
                decodeHtmlEntities.textarea.innerHTML = html
                return decodeHtmlEntities.textarea.value
            }

            /**
     * Extract text content from a code block
     * @param {HTMLElement} codeBlock - The code block element
     * @returns {string} - The code text to copy
     */
            const extractCodeText = (codeBlock) => {
                // For .code-example, decode HTML entities and handle HTML structure
                if (codeBlock.classList.contains('code-example')) {
                    // Clone the element to avoid modifying the original
                    const clone = codeBlock.cloneNode(true)

                    // Replace <br> tags with newlines
                    clone.querySelectorAll('br').forEach(br => {
                        br.replaceWith(document.createTextNode('\n'))
                    })

                    // Remove <strong> tags but keep their content, add newline after if followed by content
                    const strongTags = Array.from(clone.querySelectorAll('strong'))
                    strongTags.forEach(strong => {
                        const parent = strong.parentNode
                        const nextSibling = strong.nextSibling

                        // Move strong content before the strong element
                        while (strong.firstChild) {
                            parent.insertBefore(strong.firstChild, strong)
                        }

                        // Add newline after strong content if there's following content
                        if (nextSibling && (nextSibling.nodeType === Node.TEXT_NODE || nextSibling.nodeType === Node.ELEMENT_NODE)) {
                            const nextText = nextSibling.textContent ? nextSibling.textContent.trim() : ''
                            if (nextText) {
                                parent.insertBefore(document.createTextNode('\n'), strong)
                            }
                        }

                        parent.removeChild(strong)
                    })

                    // Get text content and decode HTML entities
                    let text = clone.textContent || clone.innerText
                    // Clean up multiple consecutive newlines (max 2)
                    text = text.replace(/\n{3,}/g, '\n\n')
                    return decodeHtmlEntities(text).trim()
                }

                // For pre.code-block, get code element text
                if (codeBlock.classList.contains('code-block')) {
                    const codeElement = safeQuery('code', codeBlock)
                    if (codeElement) {
                        return codeElement.textContent || codeElement.innerText
                    }
                    return codeBlock.textContent || codeBlock.innerText
                }

                // Fallback: get all text content
                return codeBlock.textContent || codeBlock.innerText
            }

            /**
     * Copy text to clipboard
     * Uses copyToClipboard from utils.js
     */
            const copyToClipboard = window.copyToClipboard

            /**
     * Create and setup copy button for a code block
     * @param {HTMLElement} codeBlock - The code block element
     */
            const setupCopyButton = (codeBlock) => {
                // Skip if button already exists
                if (safeQuery('.code-copy-btn', codeBlock)) {
                    return
                }

                const copyBtn = document.createElement('button')
                copyBtn.className = 'code-copy-btn'
                copyBtn.setAttribute('aria-label', 'Copy code')
                copyBtn.setAttribute('type', 'button')
                copyBtn.textContent = 'Copy'

                // Prevent text selection when tapping
                copyBtn.addEventListener('mousedown', (e) => e.preventDefault())
                copyBtn.addEventListener('touchstart', (e) => e.preventDefault())

                // Handle copy on click/touch
                const handleCopy = async (e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    const codeText = extractCodeText(codeBlock)
                    const success = await copyToClipboard(codeText)

                    if (success) {
                        // Show success feedback
                        const originalText = copyBtn.textContent
                        copyBtn.textContent = 'Copied!'
                        copyBtn.classList.add('copied')

                        // Reset after 2 seconds
                        setTimeout(() => {
                            copyBtn.textContent = originalText
                            copyBtn.classList.remove('copied')
                        }, 2000)
                    } else {
                        // Show error feedback (optional)
                        const originalText = copyBtn.textContent
                        copyBtn.textContent = 'Error'
                        setTimeout(() => {
                            copyBtn.textContent = originalText
                        }, 2000)
                    }
                }

                // Support both click and touch events
                copyBtn.addEventListener('click', handleCopy)
                copyBtn.addEventListener('touchend', (e) => {
                    e.preventDefault()
                    handleCopy(e)
                })

                codeBlock.appendChild(copyBtn)
            }

            // Find all code blocks and add copy buttons
            const codeBlocks = safeQueryAll('.code-example, pre.code-block')
            codeBlocks.forEach(setupCopyButton)
        } catch (error) {
            console.error('Error initializing code copy button:', error)
        }

        try {
        /* ========================================================================
         * VIDEO COVER COMPONENT
         * ========================================================================
         * Video elements with static cover images that reveal video on interaction
         *
         * HTML Structure:
         * <div class="video-cover" data-video-cover>
         *   <video class="video-cover__video" loop muted playsinline>
         *     <source src="video.mp4" type="video/mp4">
         *   </video>
         *   <img src="cover.jpg" alt="Cover" class="video-cover__cover">
         *   <div class="video-cover__play-icon" aria-hidden="true">▶</div>
         *   <!-- Content here -->
         * </div>
         *
         * Features:
         * - Desktop: Hover shows play icon, click plays video
         * - Mobile: Tap shows play icon, second tap plays video
         * - Smooth cover image fade-out when video starts
         * - Toggle play/pause on repeated clicks
         */

            const videoCovers = safeQueryAll('[data-video-cover]')

            if (videoCovers && videoCovers.length > 0) {
            // Detect if device has fine pointer (desktop/mouse)
                const hasFinePointer = window.matchMedia('(pointer: fine)').matches

                videoCovers.forEach(container => {
                    const video = safeQuery('.video-cover__video', container)

                    if (!video) {
                    // Skip containers without video elements
                        return
                    }

                    let isPlaying = false
                    let showIconTimeout = null

                    /**
                 * Play video and hide cover
                 */
                    const playVideo = () => {
                        if (!isPlaying) {
                            video.play().then(() => {
                                isPlaying = true
                                container.classList.add('video-cover--playing')
                                container.classList.remove('video-cover--show-icon')
                                container.setAttribute('aria-expanded', 'true')
                            }).catch(err => {
                                console.error('Error playing video:', err)
                            })
                        } else {
                        // Toggle pause
                            video.pause()
                            isPlaying = false
                            container.classList.remove('video-cover--playing')
                            container.setAttribute('aria-expanded', 'false')
                        }
                    }

                    /**
                 * Show play icon temporarily on mobile
                 */
                    const showPlayIcon = () => {
                        container.classList.add('video-cover--show-icon')

                        // Auto-hide after 2 seconds if not played
                        clearTimeout(showIconTimeout)
                        showIconTimeout = setTimeout(() => {
                            if (!isPlaying) {
                                container.classList.remove('video-cover--show-icon')
                            }
                        }, 2000)
                    }

                    // Desktop: Click to play (hover handled by CSS)
                    if (hasFinePointer) {
                        container.addEventListener('click', (e) => {
                            e.preventDefault()
                            playVideo()
                        })
                    } else {
                    // Mobile: First tap shows icon, second tap plays
                        let tapped = false

                        container.addEventListener('click', (e) => {
                            e.preventDefault()

                            if (!tapped && !isPlaying) {
                            // First tap: show icon
                                tapped = true
                                showPlayIcon()

                                // Reset tapped state after 3 seconds
                                setTimeout(() => {
                                    tapped = false
                                }, 3000)
                            } else {
                            // Second tap or toggle: play/pause video
                                playVideo()
                                tapped = false
                            }
                        })
                    }

                    // Reset when video ends (if not looping)
                    video.addEventListener('ended', () => {
                        isPlaying = false
                        container.classList.remove('video-cover--playing')
                        container.classList.remove('video-cover--show-icon')
                        container.setAttribute('aria-expanded', 'false')
                    })

                    // Handle video pause event
                    video.addEventListener('pause', () => {
                        if (isPlaying) {
                            isPlaying = false
                            container.classList.remove('video-cover--playing')
                            container.setAttribute('aria-expanded', 'false')
                        }
                    })
                })
            }
        } catch (error) {
            console.error('Error initializing video cover component:', error)
        }
    }, 0) // Small delay to ensure DOM is ready
})()

// Components are initialized immediately when the script loads

/* ========================================================================
 * GLOBAL TAB SWITCHING FUNCTION
 * ========================================================================
 * Note: The global window.switchTab() function is defined in showcase.js
 * for showcase-specific tab switching. For standard tabs, use the click
 * handlers initialized above in the TABS COMPONENT section.
 */
