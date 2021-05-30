// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  plugins: [
    'snowpack-plugin-elm',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-typescript'
  ],
  packageOptions: {
    source: 'remote',
    types: true
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
