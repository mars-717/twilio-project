const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 为Web平台添加模块解析配置
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// 为Web平台添加模块映射，避免加载原生模块
config.resolver.alias = {
  'react-native-twilio-video-webrtc': require.resolve('./src/components/TwilioVideoWeb/index.js'),
};

module.exports = config; 