import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { TwilioVideo, TwilioVideoLocalView, TwilioVideoParticipantView } from 'react-native-twilio-video-webrtc';

const { width, height } = Dimensions.get('window');

interface CallActiveScreenProps {
  navigation: any;
  route: any;
}

const CallActiveScreen: React.FC<CallActiveScreenProps> = ({ navigation, route }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [status, setStatus] = useState('connecting');
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());

  const { accessToken, roomName } = route.params || {};

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    // 结束通话逻辑
    navigation.goBack();
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
  };

  const switchCamera = () => {
    // 切换摄像头逻辑
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* 远程视频区域 */}
      <View style={styles.remoteVideoContainer}>
        {Array.from(videoTracks, ([trackSid, trackIdentifier]) => (
          <TwilioVideoParticipantView
            style={styles.remoteVideo}
            key={trackSid}
            trackIdentifier={trackIdentifier}
          />
        ))}
        {videoTracks.size === 0 && (
          <View style={styles.placeholderContainer}>
            <Icon name="person" size={80} color="#fff" />
            <Text style={styles.placeholderText}>等待对方加入...</Text>
          </View>
        )}
      </View>

      {/* 通话信息 */}
      <View style={styles.callInfoContainer}>
        <Text style={styles.callDuration}>{formatTime(callDuration)}</Text>
        <Text style={styles.roomName}>{roomName || '通话中'}</Text>
      </View>

      {/* 本地视频 */}
      <View style={styles.localVideoContainer}>
        <TwilioVideoLocalView 
          enabled={isVideoEnabled} 
          style={styles.localVideo} 
        />
      </View>

      {/* 控制按钮 */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, !isAudioEnabled && styles.controlButtonDisabled]}
          onPress={toggleAudio}
        >
          <Icon 
            name={isAudioEnabled ? "mic" : "mic-off"} 
            size={30} 
            color="#fff" 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.endCallButton]}
          onPress={handleEndCall}
        >
          <Icon name="call-end" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, !isVideoEnabled && styles.controlButtonDisabled]}
          onPress={toggleVideo}
        >
          <Icon 
            name={isVideoEnabled ? "videocam" : "videocam-off"} 
            size={30} 
            color="#fff" 
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={switchCamera}
        >
          <Icon name="switch-camera" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <TwilioVideo
        onRoomDidConnect={() => setStatus('connected')}
        onRoomDidDisconnect={() => navigation.goBack()}
        onRoomDidFailToConnect={() => navigation.goBack()}
        onParticipantAddedVideoTrack={({ participant, track }: { participant: any; track: any }) => {
          setVideoTracks(prev => {
            const newTracks = new Map(prev);
            newTracks.set(track.trackSid, {
              participantSid: participant.sid,
              videoTrackSid: track.trackSid,
            });
            return newTracks;
          });
        }}
        onParticipantRemovedVideoTrack={({ participant, track }: { participant: any; track: any }) => {
          setVideoTracks(prev => {
            const newTracks = new Map(prev);
            newTracks.delete(track.trackSid);
            return newTracks;
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  remoteVideoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  remoteVideo: {
    width: width,
    height: height * 0.7,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 16,
  },
  callInfoContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  callDuration: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  roomName: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
    opacity: 0.8,
  },
  localVideoContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  localVideo: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    backgroundColor: 'rgba(255, 0, 0, 0.6)',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
  },
});

export default CallActiveScreen; 