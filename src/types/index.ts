// 用户类型
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userType: 'individual' | 'enterprise';
  balance: number;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 企业用户扩展信息
export interface EnterpriseUser extends User {
  companyName: string;
  contractId: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
}

// 通话类型
export type CallType = 'voice' | 'video';

// 通话模式
export type CallMode = 'ai' | 'sign_language' | 'human_interpreter';

// 通话状态
export type CallStatus = 'pending' | 'connecting' | 'active' | 'ended' | 'failed';

// 通话记录
export interface CallRecord {
  id: string;
  userId: string;
  type: CallType;
  mode: CallMode;
  status: CallStatus;
  duration: number; // 分钟
  cost: number;
  interpreterId?: string;
  startTime: string;
  endTime?: string;
  createdAt: string;
}

// 翻译员信息
export interface Interpreter {
  id: string;
  name: string;
  avatar?: string;
  languages: string[];
  specialties: string[];
  rating: number;
  ratePerMinute: number;
  isAvailable: boolean;
  totalCalls: number;
  createdAt: string;
}

// 预约信息
export interface Appointment {
  id: string;
  userId: string;
  interpreterId?: string;
  type: CallType;
  mode: CallMode;
  scheduledTime: string;
  duration: number; // 预计分钟数
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

// 文档翻译
export interface DocumentTranslation {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  sourceLanguage: string;
  targetLanguage: string;
  status: 'uploading' | 'processing' | 'completed' | 'failed';
  progress: number;
  cost: number;
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// 计费规则
export interface PricingRule {
  type: CallType;
  mode: CallMode;
  pricePerMinute: number;
  minimumCharge: number; // 最低收费分钟数
}

// 支付记录
export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  type: 'recharge' | 'deduction';
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

// 通知类型
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'appointment' | 'payment' | 'call';
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// 导航参数类型
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  CallScreen: {
    type: CallType;
    mode: CallMode;
    interpreterId?: string;
  };
  AppointmentDetail: {
    appointmentId: string;
  };
  DocumentDetail: {
    documentId: string;
  };
  Payment: {
    amount?: number;
  };
  InterpreterList: {
    type: CallType;
  };
  Profile: undefined;
};

export type MainTabParamList = {
  Call: undefined;
  Calendar: undefined;
  Document: undefined;
  Profile: undefined;
};

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 