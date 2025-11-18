/**
 * ============================================================================
 * MAIN.JS - Core Site Functionality
 * ============================================================================
 *
 * This file handles all core site-wide functionality including:
 * - Theme management (light/dark mode with smooth transitions)
 * - Navigation behavior (scroll-responsive header, mobile menu)
 * - Form validation (newsletter email validation)
 * - Active navigation link highlighting
 *
 * Dependencies:
 * - utils.js (must be loaded before this file for utility functions)
 *
 * Performance optimizations:
 * - Uses requestAnimationFrame for scroll handling
 * - Throttled/debounced event handlers where appropriate
 * - Passive event listeners for better scroll performance
 *
 * @author Design System
 * @version 1.0.0
 * ============================================================================
 */

// Import utility functions from utils.js (loaded globally)
// Note: utils.js must be loaded before this file
// Use functions directly from window (exported by utils.js)
(function () {
    'use strict'
    // Use utility functions from utils.js (loaded before this file)
    const safeQuery = window.safeQuery
    const safeQueryAll = window.safeQueryAll

    const updateTokenValueDisplays = () => {
        try {
            if (!document.body) return
            const tokenValueEls = safeQueryAll('[data-token-value]')
            if (!tokenValueEls.length) return
            const styles = window.getComputedStyle(document.body)
            tokenValueEls.forEach((el) => {
                const tokenName = el.getAttribute('data-token-value')
                if (!tokenName) return
                const rawValue = styles.getPropertyValue(tokenName)
                if (rawValue) {
                    el.textContent = rawValue.trim()
                }
            })
        } catch (error) {
            console.error('Error updating token values:', error)
        }
    }

    /* ========================================================================
     * 0️⃣ PAGE LOAD SPINNER
     * ========================================================================
     * Remove spinner when DOM is fully loaded
     * Spinner must exist in HTML before this script runs
     */
    const removeSpinner = () => {
        const spinner = safeQuery('.page-spinner')
        if (spinner) {
            spinner.classList.add('hidden')
            // Remove from DOM after transition completes
            setTimeout(() => {
                spinner.remove()
            }, 400) // Match CSS transition duration
        }
    }

    // Remove spinner and show content smoothly
    const showContent = () => {
        removeSpinner()
        // Add loaded class to trigger smooth opacity transition
        setTimeout(() => {
            document.documentElement.classList.add('loaded')
        }, 50)
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showContent)
    } else {
        // DOM already loaded
        showContent()
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateTokenValueDisplays()
        try {
        /* ========================================================================
         * 1️⃣ FOOTER YEAR UPDATE
         * ========================================================================
         * Automatically updates the current year in the footer
         * Element must have id="year" to be updated
         */
            const yearEl = document.getElementById('year')
            if (yearEl) {
                yearEl.textContent = new Date().getFullYear()
            } else {
                console.warn('Footer year element not found (id="year")')
            }
        } catch (error) {
            console.error('Error updating footer year:', error)
        }

        /* ========================================================================
     * 2️⃣ THEME MANAGEMENT SYSTEM - REBUILT
     * ========================================================================
     * Simple, reliable theme switching
     * - Persists theme preference in localStorage
     * - Smooth hero image fade transitions
     * - Preloads opposite theme image for instant switching
     */

        /**
         * Apply theme to the document
         * @param {string} theme - 'light' or 'dark'
         */
        const applyTheme = (theme) => {
            if (!document.body) {
                console.error('Body element not found!')
                return
            }

            // Validate theme parameter
            if (theme !== 'light' && theme !== 'dark') {
                console.warn('Invalid theme:', theme, '- defaulting to dark')
                theme = 'dark'
            }

            // Set theme attributes
            document.body.setAttribute('data-theme', theme)
            document.documentElement.setAttribute('data-theme', theme)

            // Save to localStorage using safe utility
            if (!safeStorageSet('theme', theme)) {
                console.warn('Could not save theme to localStorage')
            }

            // Force reflow to ensure CSS updates
            void document.body.offsetHeight

            // Handle hero image transition if present
            const hero = safeQuery('.hero')
            if (hero) {
                // Use CSS transition for smoother animation
                hero.style.setProperty('--transition-opacity', '0')
                requestAnimationFrame(() => {
                    void hero.offsetHeight // Force reflow
                    requestAnimationFrame(() => {
                        hero.style.setProperty('--transition-opacity', '1')
                    })
                })
            }

            updateTokenValueDisplays()
        }

        /**
     * Toggle between light and dark themes
     */
        const toggleTheme = (e) => {
            // Don't prevent default - let button work normally
            if (e) {
                e.stopPropagation()
            }

            const currentTheme = document.body?.getAttribute('data-theme') || 'dark'
            const newTheme = currentTheme === 'light' ? 'dark' : 'light'
            applyTheme(newTheme)

            return false
        }

        // Load saved theme preference on page load
        const savedTheme = safeStorageGet('theme', 'dark')
        if (document.body) {
            applyTheme(savedTheme)
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                applyTheme(savedTheme)
            })
        }

        /**
         * Preload the opposite theme's hero image with WebP support
         */
        const preloadThemeImage = () => {
            const currentTheme = document.body.getAttribute('data-theme') || 'dark'
            const otherTheme = currentTheme === 'light' ? 'dark' : 'light'
            const basePath = otherTheme === 'light'
                ? 'assets/images/heros/white-rider-lg'
                : 'assets/images/heros/black-rider-lg'

            // Try WebP first, fallback to JPG
            const img = new Image()
            img.src = `${basePath}.webp`

            // Fallback to JPG if WebP fails to load
            img.onerror = () => {
                img.src = `${basePath}.jpg`
            }
        }

        // Preload after page is fully loaded
        if (document.readyState === 'complete') {
            preloadThemeImage()
        } else {
            window.addEventListener('load', preloadThemeImage)
        }

        // Attach click handlers using event delegation (efficient and reliable)
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.theme-toggle')
            if (toggle) {
                toggleTheme(e)
            }
        })

        // Initialize existing toggles and set up mutation observer for dynamically added ones
        const initThemeToggles = () => {
            const themeToggles = safeQueryAll('.theme-toggle')
            themeToggles.forEach((toggle) => {
                if (toggle && !toggle.dataset.themeListenerAttached) {
                    // Mark as initialized to avoid duplicate listeners
                    toggle.dataset.themeListenerAttached = 'true'
                }
            })
        }

        // Initialize on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initThemeToggles)
        } else {
            initThemeToggles()
        }

        /* ========================================================================
     * 2️⃣.7 SCROLL-RESPONSIVE NAVIGATION
     * ========================================================================
     * Navigation bar that becomes fixed after scrolling past hero section
     * - Navbar is static initially, becomes fixed after scrolling past hero section
     * - Always visible after scroll (no auto-hide behavior)
     * - Uses requestAnimationFrame for smooth 60fps performance
     *
     * Behavior:
     * - Navbar position: static until past hero section, then fixed
     * - Always visible: Navbar remains visible at all times for easy navigation access
     * - After 275px scroll: Navbar becomes "scrolled" state (glassmorphism styling)
     */
        try {
            const siteHeader = safeQuery('.site-header')
            if (!siteHeader) {
                console.warn('Site header not found')
                return
            }

            // Configuration constants
            const fixedThreshold = 275 // Navbar becomes "scrolled" state after this scroll distance (px)

            // State tracking
            let ticking = false
            let heroHeight = 0
            let heroOffsetTop = 0
            let isInitialized = false

            // Get hero section
            const hero = safeQuery('.hero')

            // Calculate hero dimensions
            const calculateHeroDimensions = () => {
                if (!hero) return

                const rect = hero.getBoundingClientRect()
                heroHeight = rect.height
                heroOffsetTop = rect.top + window.scrollY
            }

            // Optimized scroll handler
            const handleScroll = () => {
                const scrollY = window.scrollY || window.pageYOffset

                // Make navbar fixed only after scrolling past hero section
                if (hero && isInitialized) {
                    const heroBottom = heroOffsetTop + heroHeight
                    const shouldBeFixed = scrollY >= heroBottom

                    siteHeader.classList.toggle('site-header--fixed', shouldBeFixed)
                    document.body.classList.toggle('navbar-fixed', shouldBeFixed)
                } else if (!hero) {
                    // No hero section: make fixed immediately (for pages without hero)
                    siteHeader.classList.add('site-header--fixed')
                    document.body.classList.add('navbar-fixed')
                }

                // Handle scrolled state (for styling changes)
                const shouldBeScrolled = scrollY > fixedThreshold
                siteHeader.classList.toggle('site-header--scrolled', shouldBeScrolled)
                document.body.classList.toggle('navbar-scrolled', shouldBeScrolled)

                ticking = false
            }

            // Throttled scroll event handler
            const onScroll = () => {
                if (!ticking) {
                    requestAnimationFrame(handleScroll)
                    ticking = true
                }
            }

            // Initialize dimensions and scroll state
            const initializeScrollNav = () => {
                calculateHeroDimensions()
                isInitialized = true
                handleScroll() // Initial state check
            }

            // Set up event listeners
            window.addEventListener('scroll', onScroll, { passive: true })
            window.addEventListener('touchmove', onScroll, { passive: true })

            // Debounced resize handler
            const debouncedResize = debounce(() => {
                calculateHeroDimensions()
                if (!ticking) {
                    requestAnimationFrame(handleScroll)
                }
            }, 100)

            window.addEventListener('resize', debouncedResize, { passive: true })

            // Initialize after page load or immediately if already loaded
            if (document.readyState === 'complete') {
                initializeScrollNav()
            } else {
                window.addEventListener('load', initializeScrollNav)
            }

            // Fallback initialization after a short delay
            setTimeout(() => {
                if (!isInitialized) {
                    initializeScrollNav()
                }
            }, 100)
        } catch (error) {
            console.error('Error initializing scroll-responsive navigation:', error)
        }

        /* ========================================================================
     * 2️⃣.8 MOBILE MENU TOGGLE
     * ========================================================================
     * Handles mobile navigation menu (hamburger menu)
     * Features:
     * - Opens/closes on burger button click
     * - Closes on overlay click, escape key, or link click
     * - Prevents body scroll when open
     * - Manages focus for accessibility
     * - Auto-closes on window resize to desktop width
     * - Syncs theme toggle state
     */
        try {
            const nav = safeQuery('.nav')
            const burgerButton = safeQuery('.nav__burger')
            const overlay = safeQuery('.nav__overlay')
            const mobileMenu = safeQuery('.nav__mobile-menu')
            const mobileMenuClose = safeQuery('.nav__mobile-close')
            const mobileMenuLinks = safeQueryAll('.nav__mobile-menu .nav__link')

            if (!nav || !burgerButton || !overlay || !mobileMenu) {
                console.warn('Mobile menu elements not found')
                return
            }

            // State management
            let isMenuOpen = false
            let previousFocus = null
            let savedScrollY = 0

            // Mobile menu theme toggle syncing removed - handled by global theme toggle

            const openMenu = () => {
                if (isMenuOpen) return

                isMenuOpen = true
                nav.setAttribute('data-menu-open', 'true')
                burgerButton.setAttribute('aria-expanded', 'true')

                // Prevent body scroll
                savedScrollY = window.scrollY
                document.body.style.position = 'fixed'
                document.body.style.top = `-${savedScrollY}px`
                document.body.style.width = '100%'
                document.body.classList.add('nav-menu-open')

                // Focus management
                previousFocus = document.activeElement
                const firstFocusable = safeQuery('a, button, input, [tabindex]:not([tabindex="-1"])', mobileMenu)
                if (firstFocusable) {
                    requestAnimationFrame(() => firstFocusable.focus())
                }
            }

            const closeMenu = () => {
                if (!isMenuOpen) return

                isMenuOpen = false
                nav.setAttribute('data-menu-open', 'false')
                burgerButton.setAttribute('aria-expanded', 'false')

                // Restore body scroll
                document.body.style.position = ''
                document.body.style.top = ''
                document.body.style.width = ''
                document.body.classList.remove('nav-menu-open')
                window.scrollTo(0, savedScrollY)

                // Restore focus
                if (previousFocus && typeof previousFocus.focus === 'function') {
                    previousFocus.focus()
                    previousFocus = null
                }
            }

            // Event handlers
            const handleBurgerClick = (e) => {
                e.preventDefault()
                e.stopPropagation()
                isMenuOpen ? closeMenu() : openMenu()
            }

            const handleEscapeKey = (e) => {
                if (e.key === 'Escape' && isMenuOpen) {
                    closeMenu()
                }
            }

            const handleResize = debounce(() => {
                if (window.innerWidth > 768 && isMenuOpen) {
                    closeMenu()
                }
            }, 100)

            // Attach event listeners
            burgerButton.addEventListener('click', handleBurgerClick)
            overlay.addEventListener('click', closeMenu)
            document.addEventListener('keydown', handleEscapeKey)
            window.addEventListener('resize', handleResize, { passive: true })

            // Close on link clicks
            mobileMenuLinks.forEach(link => {
                link.addEventListener('click', closeMenu)
            })

            // Close button if exists
            if (mobileMenuClose) {
                mobileMenuClose.addEventListener('click', closeMenu)
            }
        } catch (error) {
            console.error('Error initializing mobile menu:', error)
        }

        /* ========================================================================
     * 3️⃣ ACTIVE NAVIGATION LINK HIGHLIGHTING
     * ========================================================================
     * Automatically highlights the current page's navigation link
     * Handles edge cases:
     * - Root path ("/") matches "index.html"
     * - Trailing slashes
     * - Different path formats
     */
        const setActiveNavLink = () => {
            const navLinks = safeQueryAll('.nav__link')
            const currentPath = window.location.pathname
            const currentPage = currentPath.split('/').pop() || 'index.html'

            navLinks.forEach(link => {
                const href = link.getAttribute('href')
                // Remove active state from all links first
                link.classList.remove('is-active')

                // Check if this link matches the current page
                // Handle both root "/" and "index.html" for home
                if ((currentPage === '' || currentPage === 'index.html' || currentPath === '/' || currentPath.endsWith('/')) && href === 'index.html') {
                    link.classList.add('is-active')
                } else if (href === currentPage) {
                    link.classList.add('is-active')
                }
            })
        }

        setActiveNavLink()

        /* ========================================================================
     * 4️⃣ FOOTER NEWSLETTER EMAIL VALIDATION
     * ========================================================================
     * Real-time email validation for newsletter subscription
     * - Validates email format as user types
     * - Enables/disables subscribe button based on validity
     * - Uses comprehensive email validation from utils.js
     */
        try {
            const emailInput = safeQuery('.footer__email-input')
            const subscribeBtn = safeQuery('.footer__subscribe-btn')

            if (emailInput && subscribeBtn) {
                // Initially disable the button (no email entered)
                subscribeBtn.disabled = true

                /**
                 * Update subscribe button state based on email validity
                 * Debounced for better performance
                 */
                const updateSubscribeButton = debounce(() => {
                    const email = emailInput.value.trim()
                    const isValid = window.validateEmail ? window.validateEmail(email) : false
                    subscribeBtn.disabled = !isValid
                }, 150)

                // Validate on input (real-time feedback)
                emailInput.addEventListener('input', updateSubscribeButton)

                // Validate on blur (when user leaves the field)
                emailInput.addEventListener('blur', updateSubscribeButton)

                // Clear validation on focus
                emailInput.addEventListener('focus', () => {
                    if (emailInput.value.trim() === '') {
                        subscribeBtn.disabled = true
                    }
                })
            }
        } catch (error) {
            console.error('Error initializing newsletter validation:', error)
        }

        /* ========================================================================
     * 5️⃣ CONTACT FORM SUBMISSION
     * ========================================================================
     * Handles contact form submission with fetch API
     * - Prevents default form submission
     * - Shows loading state during submission
     * - Displays success/error messages
     * - Resets form on success
     *
     * Note: Update FORMSPREE_ENDPOINT with your Formspree endpoint URL
     * or replace with your own backend endpoint
     */
        try {
            const contactForm = safeQuery('#contact-form')
            const formMessages = safeQuery('#form-messages')
            const submitBtn = safeQuery('#submit-btn')

            // Formspree endpoint - replace with your actual endpoint
            // Get your endpoint from https://formspree.io/
            const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'

            if (!contactForm || !formMessages || !submitBtn) {
                // Contact form not available on this page
                return
            }

            // Form state management
            let isSubmitting = false

            /**
             * Show message to user
             * @param {string} message - Message text
             * @param {string} type - 'success' or 'error'
             */
            const showMessage = (message, type) => {
                formMessages.textContent = message
                formMessages.className = `form__messages form__messages--${type}`
                formMessages.style.display = 'block'
                formMessages.setAttribute('role', 'alert')
                formMessages.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite')

                // Scroll to message for better UX
                formMessages.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

                // Auto-hide error messages after delay
                if (type === 'error') {
                    setTimeout(() => {
                        if (formMessages.style.display !== 'none') {
                            formMessages.style.display = 'none'
                        }
                    }, 8000) // Longer delay for errors
                }
            }

            /**
             * Set loading state
             */
            const setLoading = (loading) => {
                isSubmitting = loading
                submitBtn.disabled = loading
                submitBtn.classList.toggle('btn--loading', loading)
                submitBtn.setAttribute('aria-busy', loading.toString())
            }

            /**
             * Validate form data
             */
            const validateFormData = (data) => {
                const required = ['name', 'email', 'message']
                const missing = required.filter(field => !data[field]?.trim())

                if (missing.length > 0) {
                    throw new Error(`Please fill in all required fields: ${missing.join(', ')}`)
                }

                if (!window.validateEmail?.(data.email)) {
                    throw new Error('Please enter a valid email address')
                }

                if (data.message.trim().length < 10) {
                    throw new Error('Please provide a message with at least 10 characters')
                }
            }

            /**
             * Handle form submission
             */
            const handleSubmit = async (e) => {
                e.preventDefault()

                if (isSubmitting) return

                // Hide previous messages
                formMessages.style.display = 'none'

                // Validate form using native validation
                if (!contactForm.checkValidity()) {
                    contactForm.reportValidity()
                    return
                }

                // Get and validate form data
                const formData = new FormData(contactForm)
                const data = Object.fromEntries(formData)

                try {
                    validateFormData(data)
                } catch (error) {
                    showMessage(error.message, 'error')
                    return
                }

                // Show loading state
                setLoading(true)

                try {
                    const response = await fetch(FORMSPREE_ENDPOINT, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json'
                        },
                        body: JSON.stringify(data)
                    })

                    if (response.ok) {
                        const result = await response.json().catch(() => ({}))
                        showMessage(result.message || 'Thank you! Your message has been sent successfully.', 'success')
                        contactForm.reset()
                        // Keep success message visible
                    } else {
                        // Handle server errors
                        let errorMessage = 'There was an error sending your message. Please try again.'
                        try {
                            const errorData = await response.json()
                            errorMessage = errorData.error || errorMessage
                        } catch {
                            // Use default error message if JSON parsing fails
                        }
                        showMessage(errorMessage, 'error')
                    }
                } catch (error) {
                    console.error('Form submission error:', error)
                    showMessage('Unable to send message. Please check your connection and try again.', 'error')
                } finally {
                    setLoading(false)
                }
            }

            // Attach form submission handler
            contactForm.addEventListener('submit', handleSubmit)
        } catch (error) {
            console.error('Error initializing contact form:', error)
        }

        /* ========================================================================
     * 6️⃣ NEWSLETTER SUBSCRIPTION
     * ========================================================================
     * Handles newsletter subscription form submission
     * - Uses same backend approach as contact form (Formspree recommended)
     * - Shows success/error messages
     * - Clears input on success
     * - Updates button state during submission
     *
     * Note: Update NEWSLETTER_ENDPOINT with your Formspree endpoint URL
     * or replace with your own backend endpoint
     */
        try {
            const newsletterForm = safeQuery('.footer__newsletter')
            const newsletterInput = safeQuery('.footer__email-input')
            const newsletterBtn = safeQuery('.footer__subscribe-btn')

            // Formspree endpoint for newsletter - replace with your actual endpoint
            const NEWSLETTER_ENDPOINT = 'https://formspree.io/f/YOUR_NEWSLETTER_FORM_ID'

            if (!newsletterForm || !newsletterInput || !newsletterBtn) {
            // Newsletter form not available on this page
            } else {
                // Create message container if it doesn't exist
                let newsletterMessage = safeQuery('.newsletter__message', newsletterForm)
                if (!newsletterMessage) {
                    newsletterMessage = document.createElement('div')
                    newsletterMessage.className = 'newsletter__message'
                    newsletterMessage.setAttribute('role', 'alert')
                    newsletterMessage.setAttribute('aria-live', 'polite')
                    newsletterMessage.style.display = 'none'
                    newsletterForm.insertBefore(newsletterMessage, newsletterInput)
                }

                /**
         * Show newsletter message
         * @param {string} message - Message text
         * @param {string} type - 'success' or 'error'
         */
                const showNewsletterMessage = (message, type) => {
                    newsletterMessage.textContent = message
                    newsletterMessage.className = `newsletter__message newsletter__message--${type}`
                    newsletterMessage.style.display = 'block'

                    // Hide message after 5 seconds for errors, keep success visible longer
                    if (type === 'error') {
                        setTimeout(() => {
                            newsletterMessage.style.display = 'none'
                        }, 5000)
                    } else {
                        setTimeout(() => {
                            newsletterMessage.style.display = 'none'
                        }, 10000)
                    }
                }

                /**
         * Handle newsletter form submission
         */
                const handleNewsletterSubmit = async (e) => {
                    e.preventDefault()

                    const email = newsletterInput.value.trim()

                    // Validate email
                    const isValidEmail = window.validateEmail ? window.validateEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                    if (email && isValidEmail) {
                        // Show loading state
                        newsletterBtn.disabled = true
                        newsletterBtn.classList.add('btn--loading')

                        try {
                            // Submit to Formspree or your backend
                            const response = await fetch(NEWSLETTER_ENDPOINT, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json'
                                },
                                body: JSON.stringify({ email })
                            })

                            if (response.ok) {
                                // Success
                                showNewsletterMessage('Thank you! You have been subscribed successfully.', 'success')
                                newsletterInput.value = ''
                                newsletterBtn.disabled = true // Keep disabled until new email entered
                                newsletterBtn.classList.remove('btn--loading')
                            } else {
                                // Error from server
                                const errorData = await response.json().catch(() => ({}))
                                const errorMessage = errorData.error || 'There was an error subscribing. Please try again.'
                                showNewsletterMessage(errorMessage, 'error')
                                newsletterBtn.disabled = false
                                newsletterBtn.classList.remove('btn--loading')
                            }
                        } catch (error) {
                            // Network or other error
                            console.error('Newsletter subscription error:', error)
                            showNewsletterMessage('Unable to subscribe. Please check your connection and try again.', 'error')
                            newsletterBtn.disabled = false
                            newsletterBtn.classList.remove('btn--loading')
                        }
                    } else {
                        showNewsletterMessage('Please enter a valid email address.', 'error')
                    }
                }

                // Handle form submission (when Enter is pressed in input)
                newsletterInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !newsletterBtn.disabled) {
                        e.preventDefault()
                        handleNewsletterSubmit(e)
                    }
                })

                // Handle button click
                newsletterBtn.addEventListener('click', handleNewsletterSubmit)
            }
        } catch (error) {
            console.error('Error initializing newsletter subscription:', error)
        }
    })
})() // Close IIFE to scope safeQuery and safeQueryAll
