module.exports = {
  content: ['./your-files/**/*.{html,js}'],

  plugins: [require('daisyui')],

  // config docs: https://daisyui.com/docs/config/
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
}
