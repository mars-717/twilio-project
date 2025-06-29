import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Interpreter {
  id: string;
  name: string;
  avatar: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  isOnline: boolean;
  specialties: string[];
}

interface InterpreterListScreenProps {
  navigation: any;
  route: any;
}

const InterpreterListScreen: React.FC<InterpreterListScreenProps> = ({ navigation, route }) => {
  const { type } = route.params || {};
  const [searchText, setSearchText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  // 模拟翻译员数据
  const interpreters: Interpreter[] = [
    {
      id: '1',
      name: '张小明',
      avatar: 'https://via.placeholder.com/60',
      languages: ['中文', '英文'],
      rating: 4.9,
      reviewCount: 128,
      hourlyRate: 200,
      isOnline: true,
      specialties: ['商务翻译', '法律翻译'],
    },
    {
      id: '2',
      name: '李小红',
      avatar: 'https://via.placeholder.com/60',
      languages: ['中文', '日文'],
      rating: 4.8,
      reviewCount: 95,
      hourlyRate: 180,
      isOnline: true,
      specialties: ['医疗翻译', '技术翻译'],
    },
    {
      id: '3',
      name: 'John Smith',
      avatar: 'https://via.placeholder.com/60',
      languages: ['英文', '中文'],
      rating: 4.7,
      reviewCount: 156,
      hourlyRate: 220,
      isOnline: false,
      specialties: ['商务翻译', '学术翻译'],
    },
    {
      id: '4',
      name: '王小华',
      avatar: 'https://via.placeholder.com/60',
      languages: ['中文', '韩文'],
      rating: 4.6,
      reviewCount: 87,
      hourlyRate: 160,
      isOnline: true,
      specialties: ['旅游翻译', '生活翻译'],
    },
  ];

  const languages = ['全部', '中文', '英文', '日文', '韩文'];
  const sortOptions = [
    { key: 'rating', label: '评分' },
    { key: 'price', label: '价格' },
    { key: 'reviews', label: '评价数' },
  ];

  const handleBookInterpreter = (interpreter: Interpreter) => {
    if (!interpreter.isOnline) {
      Alert.alert('提示', '该翻译员当前不在线，请选择其他翻译员');
      return;
    }

    Alert.alert(
      '预约翻译员',
      `确定要预约 ${interpreter.name} 吗？\n费用: ¥${interpreter.hourlyRate}/小时`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '确定', 
          onPress: () => {
            navigation.navigate('CallScreen', {
              type,
              mode: 'human_interpreter',
              interpreterId: interpreter.id,
            });
          }
        },
      ]
    );
  };

  const renderInterpreter = ({ item }: { item: Interpreter }) => (
    <TouchableOpacity 
      style={styles.interpreterCard}
      onPress={() => handleBookInterpreter(item)}
    >
      <View style={styles.interpreterHeader}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.interpreterInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.interpreterName}>{item.name}</Text>
            <View style={[styles.statusDot, { backgroundColor: item.isOnline ? '#4CAF50' : '#9E9E9E' }]} />
          </View>
          
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
          
          <View style={styles.languageRow}>
            {item.languages.map((lang, index) => (
              <View key={index} style={styles.languageTag}>
                <Text style={styles.languageText}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>¥{item.hourlyRate}</Text>
          <Text style={styles.priceUnit}>/小时</Text>
        </View>
      </View>
      
      <View style={styles.specialtyContainer}>
        <Text style={styles.specialtyLabel}>专业领域:</Text>
        <View style={styles.specialtyTags}>
          {item.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredInterpreters = interpreters.filter(interpreter => {
    const matchesSearch = interpreter.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesLanguage = selectedLanguage === 'all' || 
      interpreter.languages.some(lang => lang.includes(selectedLanguage));
    return matchesSearch && matchesLanguage;
  });

  return (
    <View style={styles.container}>
      {/* 搜索和筛选 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索翻译员"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>语言:</Text>
          <View style={styles.languageFilter}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[
                  styles.filterButton,
                  (selectedLanguage === 'all' && lang === '全部') ||
                  (selectedLanguage !== 'all' && lang === selectedLanguage) ? 
                    styles.filterButtonActive : null
                ]}
                onPress={() => setSelectedLanguage(lang === '全部' ? 'all' : lang)}
              >
                <Text style={[
                  styles.filterButtonText,
                  (selectedLanguage === 'all' && lang === '全部') ||
                  (selectedLanguage !== 'all' && lang === selectedLanguage) ? 
                    styles.filterButtonTextActive : null
                ]}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 翻译员列表 */}
      <FlatList
        data={filteredInterpreters}
        renderItem={renderInterpreter}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="person-search" size={64} color="#ccc" />
            <Text style={styles.emptyText}>未找到符合条件的翻译员</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  languageFilter: {
    flexDirection: 'row',
    flex: 1,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  filterButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  interpreterCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  interpreterHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  interpreterInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  interpreterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 6,
  },
  languageTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  languageText: {
    fontSize: 12,
    color: '#007AFF',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  priceUnit: {
    fontSize: 12,
    color: '#666',
  },
  specialtyContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  specialtyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  specialtyTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
});

export default InterpreterListScreen; 