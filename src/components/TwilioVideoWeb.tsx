import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Web版本的Twilio Video组件
export const TwilioVideo: React.FC<any> = ({ children, ...props }) => {
  return <View>{children}</View>;
};

export const TwilioVideoLocalView: React.FC<any> = ({ style, enabled = true, ...props }) => {
  return (
    <View style={[styles.videoContainer, style]}>
      <View style={styles.videoContent}>
        <Text style={styles.videoText}>📹</Text>
        <Text style={styles.videoLabel}>本地视频</Text>
        <Text style={styles.statusText}>{enabled ? '已开启' : '已关闭'}</Text>
      </View>
    </View>
  );
};

export const TwilioVideoParticipantView: React.FC<any> = ({ style, trackIdentifier, ...props }) => {
  return (
    <View style={[styles.videoContainer, style]}>
      <View style={styles.videoContent}>
        <Text style={styles.videoText}>👤</Text>
        <Text style={styles.videoLabel}>远程视频</Text>
        <Text style={styles.statusText}>Web演示模式</Text>
      </View>
    </View>
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