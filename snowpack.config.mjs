// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    src: '/'
  },
  plugins: [
    'snowpack-plugin-elm',
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-typescript'
  ],
  packageOptions: {
    origin: 'https://cdn.skypack.dev',
    source: 'remote',
    types: true
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    bundle: true
  },
  exclude: ['**/node_modules/**/*', 'todo', '.git/**/*', '.snowpack/**/*']
};
