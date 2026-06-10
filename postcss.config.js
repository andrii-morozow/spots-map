module.exports = {
  plugins: {
    "postcss-preset-env": {
      autoprefixer: { grid: true },
      browsers: ["last 4 versions"],
    },
    cssnano: {
      preset: "default",
    },
    autoprefixer: {},
    "@tailwindcss/postcss": {},
  },
};
