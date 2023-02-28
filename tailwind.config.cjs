module.exports = {
    content: ['./index.html', './src/**/*.svelte', './node_modules/components/src/*.svelte'],

    experimental: {
        optimizeUniversalDefaults: true,
    },
    corePlugins: {
        container: false,
    },
    theme: {
        extend: {
            fontFamily: {
                sans: ['Kitab', ...require('tailwindcss/defaultTheme.js').fontFamily.sans],
            },
            listStyleType: {
                arabic: 'arabic-indic',
            },
        },
    },
    plugins: [require('tailwindcss-rtl')],
}
