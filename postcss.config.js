module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-preset-env")({
      stage: 0,
      features: {
        autoprefixer: {
          flexbox: false,
          grid: false,
        },
        "custom-properties": false,
        rem: false,
      },
    }),
    require("postcss-font-magician")({
      display: "swap",
      variants: {
        Montserrat: {
          300: [],
          400: [],
          500: [],
          600: [],
          700: [],
        },
        "Source Code Pro": {
          400: [],
          700: [],
        },
      },
    }),
    require("css-mqpacker")({
      sort: true,
    }),
  ],
};