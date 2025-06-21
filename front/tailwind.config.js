/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{jsx,js}",
        "./node_modules/tw-elements/js/**/*.js"
    ],

    theme: {
        extend: {
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                xl: '1280px',
            },
            fontFamily: {
                'open-sans': ['Open Sans', 'sans-serif'],
            },
        },
    },

    plugins: [require("tw-elements/plugin.cjs")],

    darkMode: "class",
};
