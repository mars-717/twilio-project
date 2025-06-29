// Web兼容的Twilio视频组件
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// 模拟的TwilioVideoLocalView组件
export const TwilioVideoLocalView = ({ style, enabled = true }) => {
  return (
    <View style={[styles.videoContainer, style]}>
      <Text style={styles.videoText}>
        {enabled ? '📹 本地视频' : '📹 视频已关闭'}
      </Text>
      <Text style={styles.demoText}>Web演示模式</Text>
    </View>
  );
};

// 模拟的TwilioVideoParticipantView组件
export const TwilioVideoParticipantView = ({ style }) => {
  return (
    <View style={[styles.videoContainer, style]}>
      <Text style={styles.videoText}>👤 远程视频</Text>
      <Text style={styles.demoText}>Web演示模式</Text>
    </View>
  );
};

// 模拟的TwilioVideo组件
export const TwilioVideo = ({ 
  roomName, 
  accessToken, 
  onRoomDidConnect, 
  onRoomDidDisconnect, 
  onRoomDidFailToConnect,
  onParticipantAddedVideoTrack,
  children 
}) => {
  React.useEffect(() => {
    // 模拟连接成功
    setTimeout(() => {
      if (onRoomDidConnect) {
        onRoomDidConnect({ roomName });
      }
    }, 1000);
  }, []);

  return (
    <View style={styles.twilioContainer}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    minHeight: 120,
  },
  videoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  demoText: {
    color: '#888',
    fontSize: 12,
  },
  twilioContainer: {
    flex: 1,
  },
});

// 导出默认组件
export default TwilioVideo; 