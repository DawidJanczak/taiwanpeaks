// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
export default {
  mount: {
    src: '/'
  },
  plugins: [
    '@snowpack/plugin-postcss',
    '@snowpack/plugin-typescript',
    'snowpack-plugin-elm'
  ],
  packageOptions: {},
  devOptions: {
    /* ... */
  },
  buildOptions: {
    bundle: true
  },
  exclude: ['**/node_modules/**/*', 'todo', '.git/**/*', '.snowpack/**/*'],
  optimize: {
    minify: true,
    bundle: true,
    treeshake: true,
    splitting: true
  }
};
