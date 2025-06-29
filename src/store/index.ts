import { create } from 'zustand';
import { User, CallRecord, Appointment, DocumentTranslation, PricingRule } from '../types';

// 用户状态
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: {
    id: 'demo-user-1',
    email: 'demo@example.com',
    name: '演示用户',
    phone: '138****8888',
    userType: 'individual',
    balance: 100.50,
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  isAuthenticated: true,
  loading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ loading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// 通话状态
interface CallState {
  activeCall: CallRecord | null;
  callHistory: CallRecord[];
  isInCall: boolean;
  setActiveCall: (call: CallRecord | null) => void;
  setCallHistory: (history: CallRecord[]) => void;
  addCallRecord: (record: CallRecord) => void;
  setIsInCall: (inCall: boolean) => void;
}

export const useCallStore = create<CallState>((set, get) => ({
  activeCall: null,
  callHistory: [],
  isInCall: false,
  setActiveCall: (call) => set({ activeCall: call }),
  setCallHistory: (history) => set({ callHistory: history }),
  addCallRecord: (record) => {
    const { callHistory } = get();
    set({ callHistory: [record, ...callHistory] });
  },
  setIsInCall: (inCall) => set({ isInCall: inCall }),
}));

// 预约状态
interface AppointmentState {
  appointments: Appointment[];
  selectedDate: string;
  setAppointments: (appointments: Appointment[]) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  setSelectedDate: (date: string) => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  appointments: [],
  selectedDate: new Date().toISOString().split('T')[0],
  setAppointments: (appointments) => set({ appointments }),
  addAppointment: (appointment) => {
    const { appointments } = get();
    set({ appointments: [...appointments, appointment] });
  },
  updateAppointment: (id, updates) => {
    const { appointments } = get();
    set({
      appointments: appointments.map((apt) =>
        apt.id === id ? { ...apt, ...updates } : apt
      ),
    });
  },
  deleteAppointment: (id) => {
    const { appointments } = get();
    set({ appointments: appointments.filter((apt) => apt.id !== id) });
  },
  setSelectedDate: (date) => set({ selectedDate: date }),
}));

// 文档翻译状态
interface DocumentState {
  documents: DocumentTranslation[];
  uploadingDocuments: DocumentTranslation[];
  setDocuments: (documents: DocumentTranslation[]) => void;
  addDocument: (document: DocumentTranslation) => void;
  updateDocument: (id: string, updates: Partial<DocumentTranslation>) => void;
  deleteDocument: (id: string) => void;
  addUploadingDocument: (document: DocumentTranslation) => void;
  removeUploadingDocument: (id: string) => void;
}

export const useDocumentStore = create<DocumentState>((set, get) => ({
  documents: [],
  uploadingDocuments: [],
  setDocuments: (documents) => set({ documents }),
  addDocument: (document) => {
    const { documents } = get();
    set({ documents: [document, ...documents] });
  },
  updateDocument: (id, updates) => {
    const { documents } = get();
    set({
      documents: documents.map((doc) =>
        doc.id === id ? { ...doc, ...updates } : doc
      ),
    });
  },
  deleteDocument: (id) => {
    const { documents } = get();
    set({ documents: documents.filter((doc) => doc.id !== id) });
  },
  addUploadingDocument: (document) => {
    const { uploadingDocuments } = get();
    set({ uploadingDocuments: [...uploadingDocuments, document] });
  },
  removeUploadingDocument: (id) => {
    const { uploadingDocuments } = get();
    set({ uploadingDocuments: uploadingDocuments.filter((doc) => doc.id !== id) });
  },
}));

// 应用设置状态
interface AppState {
  pricingRules: PricingRule[];
  theme: 'light' | 'dark';
  language: 'zh' | 'en';
  notifications: boolean;
  setPricingRules: (rules: PricingRule[]) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'zh' | 'en') => void;
  setNotifications: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  pricingRules: [],
  theme: 'light',
  language: 'zh',
  notifications: true,
  setPricingRules: (rules) => set({ pricingRules: rules }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setNotifications: (notifications) => set({ notifications }),
})); 