import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface PaymentScreenProps {
  navigation: any;
  route: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { amount } = route.params || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState(amount?.toString() || '100');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: 'card', name: '信用卡/借记卡', icon: 'credit-card' },
    { id: 'alipay', name: '支付宝', icon: 'payment' },
    { id: 'wechat', name: '微信支付', icon: 'payment' },
  ];

  const quickAmounts = [50, 100, 200, 500];

  const handlePayment = async () => {
    if (!validatePaymentInfo()) {
      return;
    }

    setIsProcessing(true);

    // 模拟支付处理
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        '充值成功',
        `已成功充值 ¥${rechargeAmount} 到您的账户`,
        [
          {
            text: '确定',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 2000);
  };

  const validatePaymentInfo = () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      Alert.alert('错误', '请输入有效的充值金额');
      return false;
    }

    if (selectedPaymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        Alert.alert('错误', '请填写完整的信用卡信息');
        return false;
      }
      if (cardNumber.replace(/\s/g, '').length < 16) {
        Alert.alert('错误', '请输入有效的卡号');
        return false;
      }
    }
    return true;
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  return (
    <ScrollView style={styles.container}>
      {/* 充值金额选择 */}
      <View style={styles.amountSection}>
        <Text style={styles.sectionTitle}>充值金额</Text>
        
        <View style={styles.quickAmountContainer}>
          {quickAmounts.map((amount) => (
            <TouchableOpacity
              key={amount}
              style={[
                styles.quickAmountButton,
                rechargeAmount === amount.toString() && styles.selectedQuickAmount,
              ]}
              onPress={() => setRechargeAmount(amount.toString())}
            >
              <Text style={[
                styles.quickAmountText,
                rechargeAmount === amount.toString() && styles.selectedQuickAmountText,
              ]}>
                ¥{amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.customAmountContainer}>
          <Text style={styles.inputLabel}>自定义金额</Text>
          <TextInput
            style={styles.amountInput}
            value={rechargeAmount}
            onChangeText={setRechargeAmount}
            placeholder="请输入充值金额"
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* 支付方式选择 */}
      <View style={styles.paymentMethods}>
        <Text style={styles.sectionTitle}>选择支付方式</Text>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.paymentMethod,
              selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
            ]}
            onPress={() => setSelectedPaymentMethod(method.id)}
          >
            <Icon name={method.icon} size={24} color="#007AFF" />
            <Text style={styles.paymentMethodText}>{method.name}</Text>
            {selectedPaymentMethod === method.id && (
              <Icon name="check-circle" size={20} color="#007AFF" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* 信用卡信息输入 */}
      {selectedPaymentMethod === 'card' && (
        <View style={styles.cardInfo}>
          <Text style={styles.sectionTitle}>信用卡信息</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>持卡人姓名</Text>
            <TextInput
              style={styles.input}
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="请输入持卡人姓名"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>卡号</Text>
            <TextInput
              style={styles.input}
              value={cardNumber}
              onChangeText={(text) => {
                const formatted = formatCardNumber(text);
                if (formatted.replace(/\s/g, '').length <= 16) {
                  setCardNumber(formatted);
                }
              }}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>有效期</Text>
              <TextInput
                style={styles.input}
                value={expiryDate}
                onChangeText={(text) => {
                  const formatted = formatExpiryDate(text);
                  if (formatted.length <= 5) {
                    setExpiryDate(formatted);
                  }
                }}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>
        </View>
      )}

      {/* 其他支付方式提示 */}
      {selectedPaymentMethod !== 'card' && (
        <View style={styles.otherPaymentInfo}>
          <Icon name="info" size={24} color="#007AFF" />
          <Text style={styles.otherPaymentText}>
            {selectedPaymentMethod === 'alipay' ? '将跳转到支付宝完成支付' : '将跳转到微信完成支付'}
          </Text>
        </View>
      )}

      {/* 支付按钮 */}
      <View style={styles.paymentButton}>
        <TouchableOpacity
          style={[styles.button, isProcessing && styles.disabledButton]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Text style={styles.buttonText}>处理中...</Text>
          ) : (
            <Text style={styles.buttonText}>
              立即充值 ¥{rechargeAmount}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  amountSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  quickAmountButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedQuickAmount: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  quickAmountText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  selectedQuickAmountText: {
    color: '#007AFF',
  },
  customAmountContainer: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  paymentMethods: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 8,
  },
  selectedPaymentMethod: {
    borderColor: '#007AFF',
    backgroundColor: '#f0f8ff',
  },
  paymentMethodText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  cardInfo: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  otherPaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  otherPaymentText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
  },
  paymentButton: {
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentScreen; 