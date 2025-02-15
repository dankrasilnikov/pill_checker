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
    ['@babel/plugin-transform-class-properties', { loose: true }], // Добавляем параметр loose
    ['@babel/plugin-transform-private-methods', { loose: true }], // Добавляем параметр loose
    ['@babel/plugin-transform-private-property-in-object', { loose: true }], // Добавляем параметр loose
    ['module:react-native-dotenv'],
  ],
};
