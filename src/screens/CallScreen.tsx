import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUserStore, useCallStore, useAppStore } from '../store';
import { callAPI } from '../services/api';
import { CallType, CallMode, PricingRule } from '../types';

const CallScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUserStore();
  const { callHistory } = useCallStore();
  const { pricingRules, setPricingRules } = useAppStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPricingRules();
  }, []);

  const loadPricingRules = async () => {
    try {
      const response = await callAPI.getPricingRules();
      if (response.success && response.data) {
        setPricingRules(response.data);
      }
    } catch (error) {
      console.error('Failed to load pricing rules:', error);
    }
  };

  const getPriceForMode = (type: CallType, mode: CallMode): number => {
    const rule = pricingRules.find(r => r.type === type && r.mode === mode);
    return rule?.pricePerMinute || 0;
  };

  const checkBalanceAndStartCall = (type: CallType, mode: CallMode) => {
    const pricePerMinute = getPriceForMode(type, mode);
    const minimumBalance = pricePerMinute * 5; // 5分钟最低余额

    if (!user || user.balance < minimumBalance) {
      Alert.alert(
        '余额不足',
        `当前余额不足以支付5分钟通话费用（¥${minimumBalance.toFixed(2)}），请先充值。`,
        [
          { text: '取消', style: 'cancel' },
          { 
            text: '去充值', 
            onPress: () => navigation.navigate('Payment' as never, { amount: minimumBalance } as never)
          },
        ]
      );
      return;
    }

    startCall(type, mode);
  };

  const startCall = async (type: CallType, mode: CallMode) => {
    setLoading(true);
    try {
      const response = await callAPI.startCall({ type, mode });
      if (response.success && response.data) {
        navigation.navigate('CallScreen' as never, {
          type,
          mode,
        } as never);
      } else {
        Alert.alert('错误', '无法发起通话，请稍后重试');
      }
    } catch (error) {
      console.error('Failed to start call:', error);
      Alert.alert('错误', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const navigateToAppointment = () => {
    navigation.navigate('Calendar' as never);
  };

  const navigateToInterpreterList = (type: CallType) => {
    navigation.navigate('InterpreterList' as never, { type } as never);
  };

  const CallModeCard = ({ 
    title, 
    description, 
    icon, 
    type, 
    mode, 
    onPress 
  }: {
    title: string;
    description: string;
    icon: string;
    type: CallType;
    mode: CallMode;
    onPress: () => void;
  }) => {
    const price = getPriceForMode(type, mode);
    
    return (
      <TouchableOpacity 
        style={styles.modeCard} 
        onPress={onPress}
        disabled={loading}
      >
        <View style={styles.modeHeader}>
          <Icon name={icon} size={32} color="#007AFF" />
          <View style={styles.modeInfo}>
            <Text style={styles.modeTitle}>{title}</Text>
            <Text style={styles.modeDescription}>{description}</Text>
            <Text style={styles.modePrice}>¥{price.toFixed(2)}/分钟</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 头部信息 */}
        <View style={styles.header}>
          <Text style={styles.title}>通话服务</Text>
          <Text style={styles.balance}>
            余额: ¥{user?.balance?.toFixed(2) || '0.00'}
          </Text>
        </View>

        {/* 预约通话快捷入口 */}
        <TouchableOpacity 
          style={styles.appointmentCard}
          onPress={navigateToAppointment}
        >
          <Icon name="event" size={24} color="#007AFF" />
          <Text style={styles.appointmentText}>预约通话</Text>
          <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>

        {/* 语音通话模式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>语音通话</Text>
          
          <CallModeCard
            title="AI语音翻译"
            description="智能语音识别和翻译"
            icon="mic"
            type="voice"
            mode="ai"
            onPress={() => checkBalanceAndStartCall('voice', 'ai')}
          />

          <CallModeCard
            title="真人翻译员"
            description="专业翻译员实时口译"
            icon="person"
            type="voice"
            mode="human_interpreter"
            onPress={() => navigateToInterpreterList('voice')}
          />
        </View>

        {/* 视频通话模式 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>视频通话</Text>
          
          <CallModeCard
            title="AI视频翻译"
            description="智能语音识别和翻译"
            icon="videocam"
            type="video"
            mode="ai"
            onPress={() => checkBalanceAndStartCall('video', 'ai')}
          />

          <CallModeCard
            title="手语虚拟形象"
            description="AI手语翻译虚拟形象"
            icon="accessibility"
            type="video"
            mode="sign_language"
            onPress={() => checkBalanceAndStartCall('video', 'sign_language')}
          />

          <CallModeCard
            title="真人翻译员"
            description="专业翻译员视频口译"
            icon="video-call"
            type="video"
            mode="human_interpreter"
            onPress={() => navigateToInterpreterList('video')}
          />
        </View>

        {/* 通话历史 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>最近通话</Text>
          {callHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="call" size={48} color="#ccc" />
              <Text style={styles.emptyText}>暂无通话记录</Text>
            </View>
          ) : (
            callHistory.slice(0, 3).map((call) => (
              <View key={call.id} style={styles.historyItem}>
                <Icon 
                  name={call.type === 'voice' ? 'call' : 'videocam'} 
                  size={24} 
                  color="#666" 
                />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyTitle}>
                    {call.mode === 'ai' ? 'AI翻译' : 
                     call.mode === 'sign_language' ? '手语翻译' : '真人翻译员'}
                  </Text>
                  <Text style={styles.historyTime}>
                    {new Date(call.startTime).toLocaleString()}
                  </Text>
                </View>
                <Text style={styles.historyCost}>¥{call.cost.toFixed(2)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  balance: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  modeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  modePrice: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyTime: {
    fontSize: 14,
    color: '#666',
  },
  historyCost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});

export default CallScreen; 