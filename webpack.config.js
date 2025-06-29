const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: [
          'react-native-vector-icons',
          'react-native-paper',
          'react-native-reanimated',
          'react-native-gesture-handler',
          'react-native-safe-area-context',
          'react-native-screens',
          '@react-native-async-storage/async-storage'
        ],
      },
    },
    argv
  );

  // 添加别名以支持React Native组件在web上运行
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native-vector-icons/MaterialIcons': 'react-native-vector-icons/dist/MaterialIcons',
    'react-native$': 'react-native-web',
    // 将Twilio视频组件映射到我们的Web兼容版本
    'react-native-twilio-video-webrtc$': path.resolve(__dirname, 'src/components/TwilioVideoWeb.js'),
    'react-native-twilio-video-webrtc/lib/TwilioVideo': path.resolve(__dirname, 'src/components/TwilioVideoWeb.js'),
  };

  // 添加对字体文件的支持
  config.module.rules.push({
    test: /\.ttf$/,
    loader: 'url-loader',
    include: [
      require.resolve('react-native-vector-icons'),
    ],
  });

  // 确保正确处理.web.js和.js文件
  config.resolve.extensions = ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx', '.json'];

  return config;
}; 