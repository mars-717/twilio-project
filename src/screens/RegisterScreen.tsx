import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../services/supabase';
import { useUserStore } from '../store';

const RegisterScreen: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    userType: 'individual' as 'individual' | 'enterprise',
    companyName: '',
  });
  const [loading, setLoading] = useState(false);
  
  const navigation = useNavigation();
  const { setUser, setLoading: setUserLoading } = useUserStore();

  const handleRegister = async () => {
    // 验证表单
    if (!formData.email || !formData.password || !formData.name) {
      Alert.alert('错误', '请填写必填信息');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('错误', '两次输入的密码不一致');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('错误', '密码长度至少6位');
      return;
    }

    if (formData.userType === 'enterprise' && !formData.companyName) {
      Alert.alert('错误', '企业用户请填写公司名称');
      return;
    }

    setLoading(true);
    setUserLoading(true);

    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        userType: formData.userType,
        ...(formData.userType === 'enterprise' && { companyName: formData.companyName }),
      };

      const { data, error } = await authService.signUp(
        formData.email,
        formData.password,
        userData
      );
      
      if (error) {
        Alert.alert('注册失败', error.message || '请检查输入信息');
        return;
      }

      Alert.alert(
        '注册成功', 
        '请检查您的邮箱并点击验证链接完成注册',
        [{ text: '确定', onPress: () => navigation.navigate('Login' as never) }]
      );
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('注册失败', '网络错误，请稍后重试');
    } finally {
      setLoading(false);
      setUserLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <Text style={styles.title}>注册账号</Text>
            <Text style={styles.subtitle}>创建您的口译服务账号</Text>

            <View style={styles.form}>
              <TextInput
                style={styles.input}
                placeholder="姓名 *"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                autoCapitalize="words"
              />

              <TextInput
                style={styles.input}
                placeholder="邮箱 *"
                value={formData.email}
                onChangeText={(text) => setFormData({...formData, email: text})}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                style={styles.input}
                placeholder="手机号"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
                keyboardType="phone-pad"
              />

              <TextInput
                style={styles.input}
                placeholder="密码 *"
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
                secureTextEntry
                autoCapitalize="none"
              />

              <TextInput
                style={styles.input}
                placeholder="确认密码 *"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
                secureTextEntry
                autoCapitalize="none"
              />

              {/* 用户类型选择 */}
              <View style={styles.userTypeContainer}>
                <Text style={styles.label}>用户类型</Text>
                <View style={styles.userTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      formData.userType === 'individual' && styles.userTypeButtonActive
                    ]}
                    onPress={() => setFormData({...formData, userType: 'individual'})}
                  >
                    <Text style={[
                      styles.userTypeButtonText,
                      formData.userType === 'individual' && styles.userTypeButtonTextActive
                    ]}>
                      个人用户
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      formData.userType === 'enterprise' && styles.userTypeButtonActive
                    ]}
                    onPress={() => setFormData({...formData, userType: 'enterprise'})}
                  >
                    <Text style={[
                      styles.userTypeButtonText,
                      formData.userType === 'enterprise' && styles.userTypeButtonTextActive
                    ]}>
                      企业用户
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* 企业用户额外字段 */}
              {formData.userType === 'enterprise' && (
                <TextInput
                  style={styles.input}
                  placeholder="公司名称 *"
                  value={formData.companyName}
                  onChangeText={(text) => setFormData({...formData, companyName: text})}
                />
              )}

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
              >
                <Text style={styles.buttonText}>
                  {loading ? '注册中...' : '注册'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkButton}
                onPress={navigateToLogin}
              >
                <Text style={styles.linkText}>已有账号？立即登录</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 48,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  userTypeContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },
  userTypeButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  userTypeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  userTypeButtonTextActive: {
    color: 'white',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    marginTop: 24,
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default RegisterScreen; 