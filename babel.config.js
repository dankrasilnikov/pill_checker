// eslint-disable-next-line no-undef
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          $app: './app',
          $shared: './shared',
          $features: './features',
          $entities: './entities',
          $widgets: './widgets',
          $pages: './pages',
          $assets: './assets',
        },
      },
    ],
  ],
};
