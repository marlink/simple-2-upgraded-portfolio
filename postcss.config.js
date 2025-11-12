module.exports = {
    plugins: [
        require('cssnano')({
            preset: ['default', {
                discardComments: {
                    removeAll: true
                },
                normalizeWhitespace: true,
                minifyFontValues: true,
                minifySelectors: true,
                // Preserve CSS custom properties
                reduceIdents: false,
                zindex: false
            }]
        })
    ]
};

