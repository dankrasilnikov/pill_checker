const path = require('path');

const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// eslint-disable-next-line no-undef
const config = getSentryExpoConfig(__dirname);

config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    // eslint-disable-next-line no-undef
    $app: path.resolve(__dirname, 'app'),
    // eslint-disable-next-line no-undef
    $shared: path.resolve(__dirname, 'shared'),
    // eslint-disable-next-line no-undef
    $features: path.resolve(__dirname, 'features'),
    // eslint-disable-next-line no-undef
    $entities: path.resolve(__dirname, 'entities'),
    // eslint-disable-next-line no-undef
    $widgets: path.resolve(__dirname, 'widgets'),
    // eslint-disable-next-line no-undef
    $pages: path.resolve(__dirname, 'pages'),
    // eslint-disable-next-line no-undef
    $assets: path.resolve(__dirname, 'assets'),
  },
};

// eslint-disable-next-line no-undef
module.exports = config;
