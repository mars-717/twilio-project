// Web版本的Twilio Video库模拟
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 模拟TwilioVideo主组件
export const TwilioVideo = ({ children, ...props }) => {
  return React.createElement(View, {}, children);
};

// 模拟TwilioVideoLocalView组件
export const TwilioVideoLocalView = ({ style, enabled = true, ...props }) => {
  return React.createElement(
    View,
    { style: [styles.videoContainer, style] },
    React.createElement(
      View,
      { style: styles.videoContent },
      React.createElement(Text, { style: styles.videoText }, '📹'),
      React.createElement(Text, { style: styles.videoLabel }, '本地视频'),
      React.createElement(Text, { style: styles.statusText }, enabled ? '已开启' : '已关闭')
    )
  );
};

// 模拟TwilioVideoParticipantView组件
export const TwilioVideoParticipantView = ({ style, trackIdentifier, ...props }) => {
  return React.createElement(
    View,
    { style: [styles.videoContainer, style] },
    React.createElement(
      View,
      { style: styles.videoContent },
      React.createElement(Text, { style: styles.videoText }, '👤'),
      React.createElement(Text, { style: styles.videoLabel }, '远程视频'),
      React.createElement(Text, { style: styles.statusText }, 'Web演示模式')
    )
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  videoContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    fontSize: 40,
    marginBottom: 8,
  },
  videoLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusText: {
    color: '#ccc',
    fontSize: 12,
  },
});

// 默认导出
export default {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
}; 