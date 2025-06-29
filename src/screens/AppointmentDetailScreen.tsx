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

interface AppointmentDetailScreenProps {
  navigation: any;
  route: any;
}

const AppointmentDetailScreen: React.FC<AppointmentDetailScreenProps> = ({ navigation, route }) => {
  const { appointment } = route.params || {};

  const handleStartCall = () => {
    navigation.navigate('CallActive', {
      roomName: `appointment-${appointment?.id}`,
      accessToken: 'dummy-token', // 实际应用中应该从服务器获取
    });
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      '取消预约',
      '确定要取消这个预约吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          style: 'destructive',
          onPress: () => {
            // 取消预约逻辑
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleReschedule = () => {
    navigation.navigate('Calendar', { 
      mode: 'reschedule',
      appointmentId: appointment?.id 
    });
  };

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>预约信息未找到</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>预约详情</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.appointmentCard}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) }]}>
              <Text style={styles.statusText}>{getStatusText(appointment.status)}</Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Icon name="event" size={20} color="#666" />
              <Text style={styles.infoText}>{appointment.date} {appointment.time}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="translate" size={20} color="#666" />
              <Text style={styles.infoText}>{appointment.language} 翻译</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="schedule" size={20} color="#666" />
              <Text style={styles.infoText}>{appointment.duration} 分钟</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Icon name="person" size={20} color="#666" />
              <Text style={styles.infoText}>翻译员: {appointment.interpreter || '待分配'}</Text>
            </View>
          </View>

          {appointment.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>备注:</Text>
              <Text style={styles.notesText}>{appointment.notes}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          {appointment.status === 'confirmed' && (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handleStartCall}
            >
              <Icon name="videocam" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>开始通话</Text>
            </TouchableOpacity>
          )}

          {appointment.status === 'pending' && (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleReschedule}
              >
                <Icon name="schedule" size={20} color="#007AFF" />
                <Text style={styles.secondaryButtonText}>重新安排</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.dangerButton]}
                onPress={handleCancelAppointment}
              >
                <Icon name="cancel" size={20} color="#fff" />
                <Text style={styles.dangerButtonText}>取消预约</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'confirmed': return '#4CAF50';
    case 'pending': return '#FF9800';
    case 'completed': return '#2196F3';
    case 'cancelled': return '#F44336';
    default: return '#9E9E9E';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'confirmed': return '已确认';
    case 'pending': return '待确认';
    case 'completed': return '已完成';
    case 'cancelled': return '已取消';
    default: return '未知';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  notesSection: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  dangerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default AppointmentDetailScreen; 