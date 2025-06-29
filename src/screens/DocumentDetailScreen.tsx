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

interface DocumentDetailScreenProps {
  navigation: any;
  route: any;
}

const DocumentDetailScreen: React.FC<DocumentDetailScreenProps> = ({ navigation, route }) => {
  const { documentId } = route.params || {};

  // 模拟文档数据
  const document = {
    id: documentId || '1',
    name: '合同翻译文档.pdf',
    size: '2.5 MB',
    uploadDate: '2024-01-15 14:30',
    status: 'completed',
    originalLanguage: '中文',
    targetLanguage: '英文',
    progress: 100,
    description: '这是一份商业合同的翻译文档，包含了所有重要的条款和条件。',
  };

  const handlePreview = () => {
    Alert.alert('预览', '预览功能开发中...');
  };

  const handleDownload = () => {
    Alert.alert('下载', '正在下载文档...');
  };

  const handleShare = () => {
    Alert.alert('分享', '分享功能开发中...');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'processing': return '#FF9800';
      case 'failed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '翻译完成';
      case 'processing': return '翻译中';
      case 'failed': return '翻译失败';
      default: return '未知状态';
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>文档详情</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.documentCard}>
          <View style={styles.documentIcon}>
            <Icon name="description" size={60} color="#007AFF" />
          </View>
          
          <Text style={styles.documentName}>{document.name}</Text>
          <Text style={styles.documentSize}>{document.size}</Text>
          <Text style={styles.documentDate}>上传时间: {document.uploadDate}</Text>
          
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(document.status) }]}>
              <Text style={styles.statusText}>{getStatusText(document.status)}</Text>
            </View>
          </View>

          <View style={styles.languageInfo}>
            <View style={styles.languageItem}>
              <Text style={styles.languageLabel}>原语言:</Text>
              <Text style={styles.languageValue}>{document.originalLanguage}</Text>
            </View>
            <Icon name="arrow-forward" size={20} color="#666" />
            <View style={styles.languageItem}>
              <Text style={styles.languageLabel}>目标语言:</Text>
              <Text style={styles.languageValue}>{document.targetLanguage}</Text>
            </View>
          </View>

          {document.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>描述:</Text>
              <Text style={styles.descriptionText}>{document.description}</Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.button, styles.primaryButton]}
            onPress={handlePreview}
          >
            <Icon name="visibility" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>预览文档</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleDownload}
          >
            <Icon name="download" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>下载文档</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]}
            onPress={handleShare}
          >
            <Icon name="share" size={20} color="#007AFF" />
            <Text style={styles.secondaryButtonText}>分享文档</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
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
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentIcon: {
    marginBottom: 16,
  },
  documentName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  documentSize: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  documentDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  languageItem: {
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  languageValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  descriptionSection: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
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
});

export default DocumentDetailScreen; 