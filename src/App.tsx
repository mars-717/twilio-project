import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import Navigation from './navigation';
import { useUserStore } from './store';
import { authService } from './services/supabase';

const App: React.FC = () => {
  const { setUser, setLoading } = useUserStore();

  useEffect(() => {
    // 监听认证状态变化
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        setLoading(true);
        
        if (session?.user) {
          // 用户已登录，设置用户信息
          const userInfo = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || '',
            phone: session.user.user_metadata?.phone || '',
            userType: session.user.user_metadata?.userType || 'individual',
            balance: 0, // 需要从API获取实际余额
            avatar: session.user.user_metadata?.avatar || '',
            createdAt: session.user.created_at || '',
            updatedAt: session.user.updated_at || '',
          };
          
          setUser(userInfo);
        } else {
          // 用户已登出
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    // 清理订阅
    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setLoading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <StatusBar 
          barStyle="dark-content" 
          backgroundColor="transparent" 
          translucent 
        />
        <Navigation />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App; 