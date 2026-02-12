const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');

const config = getDefaultConfig(__dirname);

module.exports = config;
