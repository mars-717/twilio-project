import axios from 'axios';
import { supabase } from './supabase';
import {
  User,
  CallRecord,
  Appointment,
  DocumentTranslation,
  Interpreter,
  PricingRule,
  PaymentRecord,
  ApiResponse,
} from '../types';

const API_BASE_URL = 'YOUR_API_BASE_URL';

// 创建axios实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 请求拦截器 - 添加认证token
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 用户相关API
export const userAPI = {
  // 获取用户信息
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/user/profile');
  },

  // 更新用户信息
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put('/user/profile', data);
  },

  // 获取用户余额
  async getBalance(): Promise<ApiResponse<{ balance: number }>> {
    return apiClient.get('/user/balance');
  },

  // 充值
  async recharge(amount: number): Promise<ApiResponse<PaymentRecord>> {
    return apiClient.post('/user/recharge', { amount });
  },
};

// 通话相关API
export const callAPI = {
  // 获取计费规则
  async getPricingRules(): Promise<ApiResponse<PricingRule[]>> {
    return apiClient.get('/call/pricing');
  },

  // 发起通话
  async startCall(data: {
    type: 'voice' | 'video';
    mode: 'ai' | 'sign_language' | 'human_interpreter';
    interpreterId?: string;
  }): Promise<ApiResponse<CallRecord>> {
    return apiClient.post('/call/start', data);
  },

  // 结束通话
  async endCall(callId: string): Promise<ApiResponse<CallRecord>> {
    return apiClient.post(`/call/${callId}/end`);
  },

  // 获取通话历史
  async getCallHistory(): Promise<ApiResponse<CallRecord[]>> {
    return apiClient.get('/call/history');
  },

  // 获取可用翻译员
  async getAvailableInterpreters(): Promise<ApiResponse<Interpreter[]>> {
    return apiClient.get('/interpreters/available');
  },
};

// 预约相关API
export const appointmentAPI = {
  // 获取预约列表
  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return apiClient.get('/appointments');
  },

  // 创建预约
  async createAppointment(data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return apiClient.post('/appointments', data);
  },

  // 更新预约
  async updateAppointment(id: string, data: Partial<Appointment>): Promise<ApiResponse<Appointment>> {
    return apiClient.put(`/appointments/${id}`, data);
  },

  // 取消预约
  async cancelAppointment(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`/appointments/${id}`);
  },
};

// 文档翻译相关API
export const documentAPI = {
  // 获取文档列表
  async getDocuments(): Promise<ApiResponse<DocumentTranslation[]>> {
    return apiClient.get('/documents');
  },

  // 上传文档
  async uploadDocument(formData: FormData): Promise<ApiResponse<DocumentTranslation>> {
    return apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 获取文档状态
  async getDocumentStatus(id: string): Promise<ApiResponse<DocumentTranslation>> {
    return apiClient.get(`/documents/${id}`);
  },

  // 下载翻译后的文档
  async downloadDocument(id: string): Promise<Blob> {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Twilio相关API
export const twilioAPI = {
  // 获取访问令牌
  async getAccessToken(identity: string): Promise<ApiResponse<{ token: string }>> {
    return apiClient.post('/twilio/token', { identity });
  },

  // 创建房间
  async createRoom(roomName: string): Promise<ApiResponse<{ roomSid: string }>> {
    return apiClient.post('/twilio/room', { roomName });
  },
}; 