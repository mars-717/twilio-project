import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface TestScreenProps {
  navigation: any;
}

const TestScreen: React.FC<TestScreenProps> = ({ navigation }) => {
  const testPages = [
    {
      title: '通话页面',
      icon: 'call',
      route: 'CallScreen',
      params: { type: 'video' },
      description: '视频通话和语音翻译功能',
    },
    {
      title: '活跃通话页面',
      icon: 'videocam',
      route: 'CallActiveScreen',
      params: { callId: 'test-call-123' },
      description: '正在进行的视频通话界面',
    },
    {
      title: '预约详情页面',
      icon: 'event',
      route: 'AppointmentDetailScreen',
      params: { 
        appointment: {
          id: '1',
          date: '2024-01-20',
          time: '14:00',
          language: '中文 → 英文',
          duration: 60,
          status: 'confirmed',
          interpreter: {
            name: '张小明',
            avatar: 'https://via.placeholder.com/60',
            rating: 4.9,
          }
        }
      },
      description: '查看预约详情和管理预约',
    },
    {
      title: '文档详情页面',
      icon: 'description',
      route: 'DocumentDetailScreen',
      params: { 
        documentId: 'doc-123',
        document: {
          id: 'doc-123',
          name: '测试文档.pdf',
          size: '2.5MB',
          uploadDate: '2024-01-15',
          status: 'completed',
        }
      },
      description: '文档翻译详情和操作',
    },
    {
      title: '支付页面',
      icon: 'payment',
      route: 'PaymentScreen',
      params: { amount: '100' },
      description: '充值和支付功能',
    },
    {
      title: '翻译员列表',
      icon: 'people',
      route: 'InterpreterListScreen',
      params: { type: 'video' },
      description: '浏览和选择翻译员',
    },
    {
      title: '日历页面',
      icon: 'calendar-today',
      route: 'CalendarScreen',
      params: {},
      description: '查看预约日历',
    },
    {
      title: '文档页面',
      icon: 'folder',
      route: 'DocumentScreen',
      params: {},
      description: '文档管理和翻译',
    },
    {
      title: '个人资料',
      icon: 'person',
      route: 'ProfileScreen',
      params: {},
      description: '用户个人信息设置',
    },
  ];

  const handleNavigate = (item: typeof testPages[0]) => {
    try {
      navigation.navigate(item.route, item.params);
    } catch (error) {
      Alert.alert('导航错误', `无法导航到 ${item.title}，请检查路由配置`);
    }
  };

  const renderTestItem = (item: typeof testPages[0], index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.testItem}
      onPress={() => handleNavigate(item)}
    >
      <View style={styles.iconContainer}>
        <Icon name={item.icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemRoute}>路由: {item.route}</Text>
      </View>
      <Icon name="chevron-right" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>页面测试中心</Text>
        <Text style={styles.subtitle}>点击下方项目测试各个页面功能</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>核心功能页面</Text>
          {testPages.slice(0, 6).map((item, index) => renderTestItem(item, index))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基础功能页面</Text>
          {testPages.slice(6).map((item, index) => renderTestItem(item, index + 6))}
        </View>

        <View style={styles.infoSection}>
          <Icon name="info" size={20} color="#666" />
          <Text style={styles.infoText}>
            这是一个测试页面，用于快速访问应用中的各个功能页面。
            如果某个页面无法正常显示，请检查相关组件的导入和路由配置。
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  itemRoute: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginLeft: 8,
  },
});

export default TestScreen; 