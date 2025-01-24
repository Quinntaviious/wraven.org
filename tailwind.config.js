module.exports = {
  content: [
    './src/**/*.{html,js}',
    './*.html'      
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["night", "light"],
  },
};
