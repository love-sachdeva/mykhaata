/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brandBg: '#fcfbf8',
                cardBg: '#f4f0e6',
                btnPrimary: '#fac638',
                textPrimary: '#1c180d',
                textSecondary: '#9e8747'
            },
            fontFamily: {
                sans: ['Inter','Noto Sans','sans-serif']
            }
        }
    }
};
